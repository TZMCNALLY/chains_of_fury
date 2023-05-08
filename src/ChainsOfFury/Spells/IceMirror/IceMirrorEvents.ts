/**
 * A set of events for the ice mirror.
 */

export const IceMirrorEvents = {
    SPAWN_MIRROR: "ICE_MIRROR_SPAWN",

    /** Requires {location: Vec2} */
    SPAWN_SNOWBALL: "SPAWN_SNOWBALL",

    /** Requires {id: number}
     * where id is the id of the circle to despawn
     */
    DESPAWN_MIRROR: "ICE_MIRROR_DESPAWN"
}