/**
 * A set of events for game.
 */

export const COFEvents = {
    
    // Events for starting / stopping level.
    LEVEL_START: "LEVEL_START",
    LEVEL_END: "LEVEL_END",

    // Player when level boss health drops to zero.
    BOSS_DEFEATED: "BOSS_DEFEATED",

    /**
     * Event trigger when player is hit.
     */
    PLAYER_HIT: "PLAYER_HIT",

    /**
     * Event trigger when player takes damage.
     * 
     * Has data: { currHealth : number, maxHealth: number }
     */
    PLAYER_TOOK_DAMAGE: "PLAYER_TOOK_DAMAGE",

    // Played when player health drops to zero.
    PLAYER_DEAD: "PLAYER_DEAD",

    /**
     * Event trigger when enemy is hit.
     */
    ENEMY_HIT: "ENEMY_HIT",

    /**
     * Event trigger when enemy entity takes damage.
     * 
     * Has data: { currHealth : number, maxHealth: number }
     */
    ENEMY_TOOK_DAMAGE: "ENEMY_TOOK_DAMAGE",

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
    CHANGE_MANA: "CHANGE_MANA"
}