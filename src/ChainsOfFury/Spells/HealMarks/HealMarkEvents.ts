/**
 * A set of events for heal marks.
 */

export const HealMarkEvents = {
    /**
     * Event trigger when the boss entity heals. Displays healing animation.
     * 
     * Has data: { location : Vec2, scale: number }
     */
    DISPLAY_HEAL_MARKS: "DISPLAY_HEAL_MARKS",

    /**
     * Event trigger when the boss entity finishes healing. Removes healing animation.
     * 
     * Has data: { id: number }
     */
    REMOVE_HEAL_MARKS: "REMOVE_HEAL_MARKS"
}