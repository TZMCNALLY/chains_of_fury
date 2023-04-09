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

    /** The players game node */
    protected owner: COFAnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    // protected weapon: PlayerWeapon;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.receiver.subscribe(COFEvents.ENEMY_HIT);
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
			case COFEvents.ENEMY_HIT: {
				this.handleEnemyHit(event);
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

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
    }

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

    public handleEnemyHit(event: GameEvent): void {
        this.health -= 100;
        this.emitter.fireEvent(COFEvents.ENEMY_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});
    }

    // Event handlers
    // ======================================================================
}