import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class MissleBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2;
    private receiver: Receiver;

    private player: AnimatedSprite;

    private homingTimer: number; // When this missle starts to home
    private doneHoming: boolean; // When the missle have done its homing section.

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        // IDK why this function is here, but I'll just use this to load custom options.
        this.player = options.player;
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

        if (this.homingTimer > 0) {
            this.homingTimer -=deltaT;
        }

        let toPlayerVector = new Vec2(
            this.player.position.x - this.owner.position.x,
            this.player.position.y - this.owner.position.y
        );

        if (this.owner.visible) {
            // Homing if the angle to player is not in range and has not homed yet.
            if (this.velocity.angleToCCW(toPlayerVector) > Math.PI/36 &&
             this.velocity.angleToCCW(toPlayerVector) < Math.PI*2 - Math.PI/36 && 
             this.homingTimer < 0 &&
             !this.doneHoming) {

                // Changes projectile angle.
                if (this.velocity.angleToCCW(toPlayerVector) > Math.PI) {
                    this.velocity.rotateCCW(Math.PI/90);
                } else {
                    this.velocity.rotateCCW(-Math.PI/90);
                }

                // Update position slowly while rotating towards player.
                this.owner.move(
                    this.velocity
                    .scaled(Math.abs(Math.PI-this.velocity.angleToCCW(toPlayerVector))/Math.PI)
                    .scaled(.8)
                    .scaled(deltaT));
            } else {
                if (this.homingTimer < 0) {
                    // Slightly increase velocity speed.
                    this.velocity = this.velocity.scaled(1.05);
                    this.doneHoming = true;
                }

                this.owner.move(this.velocity.scaled(deltaT));
            }
        }
    }

    public reset(): void {
        this.homingTimer = .5;
        this.doneHoming = false;
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}

