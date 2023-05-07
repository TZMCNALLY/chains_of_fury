/**
 * A set of events for the demon summoning circles.
 */

export const DemonSummoningCircleEvents = {
    SPAWN_CIRCLE: "DEMON_SUMMONING_SPAWN_CIRCLE",

    /** Requires {location: Vec2} */
    SUMMON_SHADOW_DEMON: "SUMMON_SHADOW_DEMON",

    /** Requires {id: number}
     * where id is the id of the circle to despawn
     */
    DESPAWN_CIRCLE: "DEMON_SUMMONING_DESPAWN_CIRCLE"
}