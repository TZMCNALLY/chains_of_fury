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
     * Event trigger when player takes damage.
     * 
     * Has data: { damage: number }
     */
    PLAYER_TOOK_DAMAGE: "PLAYER_TOOK_DAMAGE",

    // Played when player health drops to zero.
    PLAYER_DEAD: "PLAYER_DEAD",

    /**
     * Event trigger when enemy entity gets hit.
     * 
     * Has data: { id: number, damage: number }
     */
    ENEMY_TOOK_DAMAGE: "ENEMY_TOOK_DAMAGE",

    /**
     * Event trigger when player swing.
     * 
     * Has data: { faceDir: numeber (-1 or 1) }
     */
    PLAYER_SWING: "PLAYER_SWING",
}