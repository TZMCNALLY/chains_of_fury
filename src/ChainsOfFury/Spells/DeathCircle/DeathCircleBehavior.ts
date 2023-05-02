import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import { DeathCircleEvents } from "./DeathCircleEvents";
import Spawn from "./DeathCircleStates/Spawn";
import Damage from "./DeathCircleStates/Damage";
import Despawn from "./DeathCircleStates/Despawn";
import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import Inactive from "./DeathCircleStates/Inactive";

export const DeathCircleStates = {
    SPAWN: "SPAWN",
    DAMAGE: "DAMAGE",
    DESPAWN: "DESPAWN",
    INACTIVE: "INACTIVE"
} as const

export const DeathCircleAnimation = {
    SPAWN: "SPAWN",
    DAMAGE: "DAMAGE",
    DESPAWN: "DESPAWN"
} as const

export default class DeathCircleBehavior extends StateMachineAI {
    // The GameNode that owns this behavior
    /** The boss game node */
    protected owner: COFAnimatedSprite;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.addState(DeathCircleStates.SPAWN, new Spawn(this, this.owner));
        this.addState(DeathCircleStates.DAMAGE, new Damage(this, this.owner));
        this.addState(DeathCircleStates.DESPAWN, new Despawn(this, this.owner));
        this.addState(DeathCircleStates.INACTIVE, new Inactive(this, this.owner));
        this.initialize(DeathCircleStates.SPAWN);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error("Unhandled event caught in DeathCircleBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {   
        super.update(deltaT);
    }
}