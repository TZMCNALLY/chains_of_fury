/**
 * A set of events for game.
 */

export const COFEvents = {
    
    // Events for starting / stopping level.
    LEVEL_START: "LEVEL_START",
    LEVEL_END: "LEVEL_END",

    // Event when peon health drops to zero
    MINION_DEAD: "MINION_DEAD",

    // Event when level boss health drops to zero.
    BOSS_DEFEATED: "BOSS_DEFEATED",

    /**
     * Event trigger when player is hit by a physical attack.
     */
    PHYSICAL_ATTACK_HIT_PLAYER: "PHYSICAL_ATTACK_HIT_PLAYER",

    /**
     * Event trigger when player is hit by a projectile.
     */
    ENEMY_PROJECTILE_HIT_PLAYER: "PROJECTILE_HIT_PLAYER",

    /**
     * Event trigger when an enemy projectile hits the wall.
     */
    ENEMY_PROJECTILE_HIT_WALL: "PROJECTILE_HIT_WALL",

    /**
     * Event trigger when player takes damage.
     * 
     * Has data: { currHealth : number, maxHealth: number }
     */
    PLAYER_TOOK_DAMAGE: "PLAYER_TOOK_DAMAGE",

    // Played when player health drops to zero.
    PLAYER_DEAD: "PLAYER_DEAD",

    /**
     * Event trigger when enemy is hit by a swing.
     */
    SWING_HIT: "SWING_HIT",

    /**
     * Event trigger when enemy gets stunned.
     */
    ENEMY_STUNNED: "ENEMY_STUNNED",

    /**
     * Event trigger when the boss entity takes damage.
     * 
     * Has data: { currHealth : number, maxHealth: number }
     */
    BOSS_TOOK_DAMAGE: "BOSS_TOOK_DAMAGE",

    /**
     * Event trigger when player swing.
     * 
     * Has data: { faceDir: numeber (-1 or 1) }
     */
    PLAYER_SWING: "PLAYER_SWING",

    /**
     * Event trigger when player is in the running state.
     */
    PLAYER_RUN: "PLAYER_RUN",

    /**
     * Event trigger when player entity throws a projectile
     * 
     * Has data: { faceDir: number, pos: Vec2 }
     */
    PLAYER_HURL: "PLAYER_HURL",

    /**
     * Event trigger when player entity teleports
     */
    PLAYER_TELEPORT: "PLAYER_TELEPORT",

    /**
     * Event trigger when player is idle, allowing them to regenerate lost stamina
     * 
     * Has data: { currStamina : number, maxStamina : number }
     */
    REGENERATE_STAMINA: "REGENERATE_STAMINA",

    /**
     * Event trigger when player entity experiences a change in stamina
     * 
     * Has data: { facedir: number, currStamina : number, maxStamina : number }
     */
    CHANGE_STAMINA: "CHANGE_STAMINA",

    /**
     * Event trigger when player entity experiences a change in mana
     * 
     * Has data: { currMana : number, maxMana : number }
     */
    CHANGE_MANA: "CHANGE_MANA",

    /**
     * Event trigger when enemy is hit by a fireball.
     */
    FIREBALL_HIT_ENEMY: "FIREBALL_HIT_ENEMY",

    /**
     * Event trigger when a fireball hit a wall.
     */
    FIREBALL_HIT_WALL: "FIREBALL_HIT_WALL"
}