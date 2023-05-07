import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { MoonDogEvents } from "../MoonDogEvents";

export default class MoonBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2
    private receiver: Receiver;
    private emitter: Emitter;

    private indicatorPos: Vec2;
    private moonIndex: number;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        this.indicatorPos = options.indicatorPos;
        this.moonIndex = options.index;
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {

            default: {
                throw new Error("Unhandled event caught in MoonBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {   

        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.owner.visible) {
            // Update position of the fireball
            this.owner.move(this.velocity.scaled(deltaT));

            if (this.owner.position.distanceTo(this.indicatorPos) < 15) {
                // Emits explode event!
                this.emitter.fireEvent(MoonDogEvents.MOON_LANDED, {index: this.moonIndex});
            }
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}

