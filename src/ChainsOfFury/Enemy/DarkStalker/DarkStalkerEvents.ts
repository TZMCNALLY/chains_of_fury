/**
 * A set of events for DarkStalker.
 */

export const DarkStalkerEvents = {
    
    CAST: "CAST_MAGIC",

    /** with data: location: Vec2 */
    TELEPORT: "TELEPORT",
    
    /** with data: node */
    MINE_EXPLODED: "MINE_EXPLODED",

    /** with data: node */
    DESPAWN_MISSLE: "DESPAWN_MISSLE",

    /** with data: node */
    MINION_HIT: "MINION_HIT",

    EYEBALL_DEAD: "EYEBALL_DEAD"
}