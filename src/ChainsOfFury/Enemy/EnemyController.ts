import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import COFAnimatedSprite from "../Nodes/COFAnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFEvents } from "../COFEvents";

import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

/**
 * The controller that controls the player.
 */
export default class EnemyController extends StateMachineAI {
    //public readonly MAX_SPEED: number = 200;
    //public readonly MIN_SPEED: number = 100;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** The boss game node */
    protected owner: COFAnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    // protected weapon: PlayerWeapon;

    protected _stunned: boolean;

    /** The player this enemy should attack. */
    protected _player: COFAnimatedSprite;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this._player = options.player;

        this.receiver = new Receiver();
        this.emitter = new Emitter();

        // Subscribe to Events.
        this.receiver.subscribe(COFEvents.SWING_HIT);
        this.receiver.subscribe(COFEvents.FIREBALL_HIT_ENEMY);

        // this.receiver.subscribe(COFEvents.ENEMY_HIT);
        this.receiver.subscribe(COFEvents.ENEMY_STUNNED);

        this._stunned = false;
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
			case COFEvents.SWING_HIT: {
				this.handleEnemySwingHit(event);
				break;
			}
            case COFEvents.FIREBALL_HIT_ENEMY: {
				this.handleEnemyFireballHit(event);
				break;
            }
            case COFEvents.ENEMY_STUNNED: {
                this.handleEnemyStunned(event);
                break;
            }
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}

    // ======================================================================
    // Getters and setters

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get stunned(): boolean { return this._stunned; }
    public set stunned(stunned: boolean) { this._stunned = stunned; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
    }

    public get player(): COFAnimatedSprite { return this._player; }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // If the health hit 0, change the state of the boss
        // if (this.health === 0) {
        //     this.changeState(Boss.DEAD);
        // }
    }

    // Getters and setters
    // ======================================================================
    

    // ======================================================================
    // Event handlers

    public handleEnemySwingHit(event: GameEvent): void {
        this.health -= 100;
        this.emitter.fireEvent(COFEvents.ENEMY_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});

        if (this.health == 0) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
    }

    public handleEnemyFireballHit(event: GameEvent): void {
        this.health -= 10;
        this.emitter.fireEvent(COFEvents.ENEMY_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});

        if (this.health == 0) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
    }

    public handleEnemyStunned(event: GameEvent): void {
        // this.owner.move(this.velocity.scaleTo(-1));
        this.stunned = true;
    }

    // Event handlers
    // ======================================================================

    // ======================================================================
    // Helper functions

    // gets the x distance between boss and player
    // directional: negative - boss to left of player
    //              positive - boss to right of player
    public getXDistanceFromPlayer() {
        return this.owner.position.x - this.player.position.x;
    }

    // gets the y distance between boss and player
    // directional: negative - boss below player
    //              positive - boss above player
    public getYDistanceFromPlayer() {
        return this.owner.position.y - this.player.position.y;
    }

    // gets the distance between player and boss (non-directional)
    public getDistanceFromPlayer() {
        let diffInX = this.getXDistanceFromPlayer();
        let diffInY = this.getYDistanceFromPlayer();

        return Math.sqrt(diffInX*diffInX + diffInY*diffInY)
    }
    
    // Helper functions
    // ======================================================================
}