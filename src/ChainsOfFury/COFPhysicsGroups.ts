/**
 * enum with all physics groups for game
 */

export const COFPhysicsGroups = {
    
    PLAYER: "PLAYER",
    ENEMY: "ENEMY",
    // Enemy physics group when they are supppose to do contact damage.
    ENEMY_CONTACT_DMG: "ENEMY_CONTACT_DAMAGE",
    WALL: "WALL",
    PLAYER_WEAPON: "WEAPON", // player attack hit box.
    FIREBALL: "FIREBALL",
    ENEMY_PROJECTILE: "ENEMY_PROJECTILE"

    // TODO: add terrain and enemy, projectiles etc...
}