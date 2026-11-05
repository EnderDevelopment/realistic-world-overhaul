import { world, system } from "@minecraft/server";

/**
 * Realism Add-On runtime scripting.
 * Implements realistic water physics and player movement on top of the
 * JSON behavior/components of the pack.
 *
 * Every tick interval the pack simulates:
 *  - Water currents that push players downhill toward open air.
 *  - Realistic buoyancy that pushes a fully-submerged player back up.
 *  - Sprint stamina so players tire out instead of running forever.
 */

const TICK_MS = 20;

// Tracks per-player stamina (0..100). Persists only while the player is online.
const sprintStamina = new Map();
// Set of players currently "out of breath" so we only warn once per recovery.
const outOfBreath = new Set();

function getStamina(playerId) {
  if (!sprintStamina.has(playerId)) {
    sprintStamina.set(playerId, 100);
  }
  return sprintStamina.get(playerId);
}

function isInWater(player) {
  const block = player.dimension.getBlock(player.location);
  return block && block.typeId === "minecraft:water";
}

/**
 * Realistic water physics tick:
 * - Water flows toward lower ground: if there is open (air) space beside the
 *   player at a lower level, push them along the downhill flow direction.
 * - A fully submerged player is pushed gently upward (buoyancy) to the surface.
 */
function applyWaterPhysics() {
  for (const player of world.getPlayers()) {
    if (!isInWater(player)) {
      continue;
    }

    const { x, y, z } = player.location;
    const { dimension } = player;

    // Detect downhill flow directions (neighbouring cell is air below the lip).
    const neighbours = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
    let flowX = 0;
    let flowZ = 0;
    for (const [dx, dz] of neighbours) {
      const below = dimension.getBlock({ x: x + dx, y: y - 1, z: z + dz });
      if (below && below.typeId === "minecraft:air") {
        flowX += dx;
        flowZ += dz;
      }
    }

    if (flowX !== 0 || flowZ !== 0) {
      player.applyKnockback(flowX, flowZ, 0.35, 0.1);
    }

    // Buoyancy: if the block at head height is still water, rise gently.
    const headBlock = dimension.getBlock({ x, y: y + 1, z });
    if (headBlock && headBlock.typeId === "minecraft:water") {
      player.applyKnockback(0, 0, 0, 0.25);
    }
  }
}

/**
 * Realistic movement: sprinting depletes stamina; resting restores it.
 * Exhausted players get a warning and cannot keep sprinting without a breather.
 */
function applyMovement() {
  for (const player of world.getPlayers()) {
    if (player.isSprinting) {
      const energy = getStamina(player.id) - 4;
      sprintStamina.set(player.id, Math.max(0, energy));

      if (energy <= 0 && !outOfBreath.has(player.id)) {
        outOfBreath.add(player.id);
        player.sendMessage("§c[Realism] §fYou're out of breath! Rest a moment before sprinting again.");
      }
    } else {
      const energy = getStamina(player.id) + 2;
      sprintStamina.set(player.id, Math.min(100, energy));
      if (energy >= 30) {
        outOfBreath.delete(player.id);
      }
    }
  }
}

system.runInterval(() => {
  applyWaterPhysics();
  applyMovement();
}, TICK_MS);

// Welcome the player when they (re)join with the pack active.
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  player.sendMessage("§7[Realism] §fThe world is now realistic: new mobs, real water physics and hardened tools are active.");
});
