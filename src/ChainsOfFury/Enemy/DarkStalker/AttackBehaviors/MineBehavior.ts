import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DarkStalkerEvents } from "../DarkStalkerEvents";

export default class MineBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2;
    private receiver: Receiver;

    private explodeCountdown: number;
    private currCountdown: number;
    private emitter: Emitter;

    public exploding: boolean;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.receiver.subscribe(DarkStalkerEvents.MINION_HIT);
        this.emitter = new Emitter();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        // IDK why this function is here, but I'll just use this to load custom options.
        this.explodeCountdown = options.countdown;
        this.currCountdown = this.explodeCountdown;
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case DarkStalkerEvents.MINION_HIT: {
                if (event.data.get("node") == this.owner.id) {
                    this.currCountdown = 0;
                }
                break;
            }
            default: {
                throw new Error("Unhandled event caught in FireballBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this._owner.visible) {
            if (this.currCountdown > 0 && !this.exploding) {
                // Play animation depending of if it will explode soon
                if (this.currCountdown < 1) {
                    this.owner.animation.playIfNotAlready("FLASH", true);
                    // Fast flashing
                } else if (this.currCountdown < 3) {
                    // Slow flashing
                    this.owner.animation.playIfNotAlready("SLOW_FLASH", true);
                } else {
                    this.owner.animation.playIfNotAlready("IDLE", true);
                }
                this.currCountdown -= deltaT;
            } else {
                if (!this.exploding) {
                    this.emitter.fireEvent(DarkStalkerEvents.MINE_EXPLODED, {"node": this._owner.id});
                    this.exploding = true;
                    this.currCountdown = this.explodeCountdown;
                }
            }

            this.owner.move(this.velocity.scaled(deltaT));
            this.velocity = this.velocity.scaled(.97); // Slow down the mine.
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}

