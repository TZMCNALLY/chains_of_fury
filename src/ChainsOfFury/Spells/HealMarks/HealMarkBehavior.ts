import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { HealMarkEvents } from "./HealMarkEvents";

export const HealMarkAnimation = {
    HEALING: "HEALING"
} as const

export default class HealMarkBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private receiver: Receiver;
    private emitter: Emitter;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error("Unhandled event caught in HealMarkBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void { 
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (!this.owner.animation.isPlaying(HealMarkAnimation.HEALING) && this.owner.visible) {
            this.emitter.fireEvent(HealMarkEvents.REMOVE_HEAL_MARKS, {id: this.owner.id});
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
}

