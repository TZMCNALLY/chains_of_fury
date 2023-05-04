import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class MineBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2;
    private receiver: Receiver;

    private explodeCountdown: number;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        // IDK why this function is here, but I'll just use this to load custom options.
        this.explodeCountdown = options.countdown;
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error("Unhandled event caught in FireballBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.explodeCountdown > 0) {
            // Play animation depending of if it will explode soon
            if (this.explodeCountdown < 1) {
                // Fast flashing
            } else {
                // Slow flashing
            }
            this.explodeCountdown -= deltaT;
        } else {
            // Play explode animation
            // Emit event that should check this node and overlap.
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}

