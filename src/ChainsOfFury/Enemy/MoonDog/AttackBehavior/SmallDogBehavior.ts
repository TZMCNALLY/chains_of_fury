import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import { MoonDogEvents } from "../MoonDogEvents";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Point from "../../../../Wolfie2D/Nodes/Graphics/Point";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";

export default class SmallDogBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2
    private receiver: Receiver;
    private emitter: Emitter;

    private target: Vec2;
    private attackTimer: Timer;
    private circleTimer: Timer;

    private circleSpeed: Vec2;
    private chargeSpeed: Vec2;

    private charging: boolean;
    private circling: boolean;

    private circleVec: Vec2;
    private circlingDir: number;

    private player: AnimatedSprite;

    private health: number;

    private debugPoint: Point;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.circleSpeed = new Vec2(200, 200);
        this.chargeSpeed = new Vec2(380, 380);

        // This timer starts the charging process, then circling.
        this.attackTimer = new Timer(4000, () => {
            // Charge up period (similiar to parent boss)
            this._owner.animation.play("RUNNING_RIGHT", true);
            this.target.copy(this._owner.position); // Sets target to self for now. (prevents moving);
            this.circling = false;

            let actualAttackTimer = new Timer(500, () => {
                // Sets the physics group to attack
                this._owner.setGroup(COFPhysicsGroups.ENEMY_CONTACT_DMG);

                this.target = 
                    this._owner.position.clone().add
                    ( // This is the vector to be added to the current position to determine the new target.
                        this.player.position.clone().sub(
                        this._owner.position.clone()).mult(
                        new Vec2(1.5, 1.5))
                    );
                this.charging = true;

                this.circleTimer.start();
            });
            actualAttackTimer.start();
        });

        // This timer starts the circling process, then charging.
        this.circleTimer = new Timer(2200, () => {
            this._owner.animation.play("WALKING_RIGHT", true);

            this.circling = true;
            // target will be determined in the update loop.
            this.charging = false;

            this.attackTimer.start();
        })

        this.activate(options);

        this.receiver.subscribe(MoonDogEvents.MINION_HIT);

        this.reset();
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        this.player = options.player;
        this.debugPoint = options.debug_point;
        this.debugPoint.visible = false;
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case MoonDogEvents.MINION_HIT: {
                if (event.data.get("node") == this.owner.id) {
                    this.health -= 1;

                    if (this.health == 0) {
                        // Pause and reset the timers
                        this.attackTimer.pause();
                        this.attackTimer.reset();
                        this.circleTimer.pause();
                        this.circleTimer.reset();
                        this.owner.animation.play("DYING_RIGHT", false);
                        this.owner.tweens.play("death");
                    } else {
                        if (!this.owner.animation.isPlaying("RUNNING_RIGHT") && this.health > 0) {
                            this.owner.animation.play("DAMAGED_RIGHT", false);
                        }
                    }
                }
                break;
            }

            default: {
                throw new Error("Unhandled event caught in SmallDogBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {

        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.owner.visible && this.health > 0) {        
            if (!this.circling && !this.charging) {
                // Flip when preparing to charge.
                this.owner.invertX = Math.sign(this._owner.position.x - this.player.position.x) > 0;
            }
            
            if (this.circling) {
                // Flip sprite to correct way while circling.
                this.owner.invertX = Math.sign(this._owner.position.x - this.player.position.x) > 0;


                this.target = this.player.position.clone().add(this.circleVec);
                this.circleVec.rotateCCW(this.circlingDir * Math.PI / 300);

                // check bound. (flip direction of the rotation if out of bounce.)
                if (this.target.y > 740 || 
                    this.target.y < 230) {
                        this.circleVec.y *= -1;
                        this.circlingDir *= -1;
                }
                if (this.target.x > 990 || 
                    this.target.x < 270) {
                        this.circlingDir *= -1;
                        this.circleVec.x *= -1;
                }

                this.velocity.copy(
                    this.target.clone().sub(this._owner.position).normalized().mult(
                    this.circleSpeed)
                );
            }

            if (this.charging) {
                // Flip sprite for charging.
                this.owner.invertX = Math.sign(this._owner.position.x - this.target.x) > 0;

                this.velocity.copy(
                    this.target.clone().sub(this._owner.position).normalized().mult(
                    this.chargeSpeed)
                );
            }

            /** DEBUG */
            this.debugPoint.position.copy(this.target);

            // Stops spasm at when arrived at target.
            if (this.target.distanceTo(this._owner.position) < 20) {

                if (this.charging) {
                    // since target is reached, stop running animation.
                    this._owner.animation.play("IDLE_RIGHT");
                    // Also reset physics group.
                    this._owner.setGroup(COFPhysicsGroups.ENEMY);
                }

                return;
            }

            // Update position
            this.owner.move(this.velocity.scaled(deltaT));
        }
    }

    public reset(): void {
        this.circleVec = new Vec2(0, 150);
        this.circleVec.rotateCCW(RandUtils.randFloat(0, 2) * Math.PI);

        this.health = 2;

        this.circlingDir = 1;

        this.target = Vec2.ZERO;

        this._owner.animation.play("WALKING_RIGHT", true);

        this.charging = false;
        this.circling = true;

        this.circleTimer.start();
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}

