import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Color from "../../../../Wolfie2D/Utils/Color";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { COFEvents } from "../../../COFEvents";
import { COFLayers } from "../../../Scenes/COFLevel";
import { DarkStalkerEvents } from "../DarkStalkerEvents";

export default class EyeballBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2;
    private receiver: Receiver;

    private emitter: Emitter;

    private speed: Vec2 = new Vec2(25, 25);
    private player: AnimatedSprite;

    private exploding: boolean;

    public health: number;

    private aimingLine: Line;

    private laserTimer: Timer;

    private keepAiming: boolean;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.activate(options);

        this.receiver.subscribe(DarkStalkerEvents.MINION_HIT);

        this.laserTimer = new Timer(RandUtils.randInt(8000, 12000), () => {
            // Calculates the aiming line.

            // Stops too far of a laser (since lasers don't render when origin is offscreen)
            if (this.owner.position.distanceTo(this.player.position) > 300) {
                return;
            }
            
            this.aimingLine.thickness = 1;
            this.aimingLine.color = Color.WHITE;

            this.keepAiming = true;

            let doneAimingTimer = new Timer(500, () => {
                this.keepAiming = false;
            });
            doneAimingTimer.start();
            
            this.aimingLine.visible = true;
            let shootTimer = new Timer(1000, () => {
                this.aimingLine.thickness = 5;
                this.aimingLine.color = Color.RED;
                if (this.lineIntersect()) {
                    this.emitter.fireEvent(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
                }                
            });
            shootTimer.start();

            let doneTimer = new Timer(1500, () => {
                this.aimingLine.visible = false;
            })
            doneTimer.start();
        })
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {
        // IDK why this function is here, but I'll just use this to load custom options.
        this.player = options.player;

        // Setup the line
        this.aimingLine = options.factory.graphic(GraphicType.LINE, COFLayers.PRIMARY, {
            start: Vec2.ZERO,
            end: Vec2.ZERO
        });
        this.aimingLine.visible = false;
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case DarkStalkerEvents.MINION_HIT: {
                if (event.data.get("node") == this.owner.id) {
                    this.health -= 1;
                    // TODO play animation here.

                    if (this.health <= 0) {
                        this.owner.animation.play("HURT", false);
                        this.owner.tweens.play("death");
                        // this.owner.animation.play("DEATH", false, DarkStalkerEvents.EYEBALL_DEAD, {node: event.data.get("node")})
                    } else {
                        this.owner.animation.play("HURT", false);
                    }
                }
                break;
            }
            default: {
                throw new Error("Unhandled event caught in EyeballBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        this.owner.invertX = MathUtils.sign(this.owner.position.x - this.player.position.x) > 0;

        if (this._owner.visible && this.health > 0) {
            if (this.keepAiming) {
                this.calculateLien();
            }

            if (this.laserTimer.isStopped()) {
                this.laserTimer.start();
            }

            if (Math.abs(this.owner.position.x - this.player.position.x) < 75 &&
                Math.abs(this.owner.position.y - this.player.position.y) < 75) {
                    if (!this.owner.animation.isPlaying("HURT")) {
                        this.owner.animation.playIfNotAlready("FLASH");
                    }

                    // Signal explosion
                    return;
            }

            // Slowly move towards to player if not exploding and not aiming.
            if (!this.exploding && !this.aimingLine.visible) {
                if (!this.owner.animation.isPlaying("HURT")) {
                    this.owner.animation.playIfNotAlready("IDLE");
                }

                let movementVector = new Vec2(
                    (this.player.position.x - this.owner.position.x),
                    (this.player.position.y - this.owner.position.y)
                );
        
                movementVector = movementVector.normalized().mult(this.speed);
        
                this.owner.move(movementVector.scaled(deltaT)); 
            }
        }
    }

    public reset(): void {
        this.exploding = false;
        this.health = 3;
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }


    private calculateLien(): void {
        this.aimingLine.start = this.owner.position.clone();
        this.aimingLine.end = this.aimingLine.start.clone().add(
            this.player.position.clone().sub(this.owner.position.clone()).scale(5));
    }

    private lineIntersect(): boolean {
        // Checks line against all lines of player boundary box;
        if (this.intersects(this.aimingLine.start, this.aimingLine.end, this.player.collisionShape.getBoundingRect().topLeft, this.player.collisionShape.getBoundingRect().topRight)) {
            return true;
        }
        if (this.intersects(this.aimingLine.start, this.aimingLine.end, this.player.collisionShape.getBoundingRect().topLeft, this.player.collisionShape.getBoundingRect().bottomLeft)) {
            return true;
        }
        if (this.intersects(this.aimingLine.start, this.aimingLine.end, this.player.collisionShape.getBoundingRect().topRight, this.player.collisionShape.getBoundingRect().bottomRight)) {
            return true;
        }
        if (this.intersects(this.aimingLine.start, this.aimingLine.end, this.player.collisionShape.getBoundingRect().bottomLeft, this.player.collisionShape.getBoundingRect().bottomRight)) {
            return true;
        }
        return false;
    }

    private intersects(lineAStart: Vec2, lineAEnd: Vec2, lineBStart: Vec2, lineBEnd: Vec2): boolean {
        let a = lineAStart.x;
        let b = lineAStart.y;
        let c = lineAEnd.x;
        let d = lineAEnd.y;

        let p = lineBStart.x;
        let q = lineBStart.y;
        let r = lineBEnd.x;
        let s = lineBEnd.y;

        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
          return false;
        } else {
          lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
          gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
          return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
      };
      
}

