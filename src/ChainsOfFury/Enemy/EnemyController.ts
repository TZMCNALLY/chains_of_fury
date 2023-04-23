import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import COFAnimatedSprite from "../Nodes/COFAnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFEvents } from "../COFEvents";

import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import Input from "../../Wolfie2D/Input/Input";
import { COFEntities } from "../Scenes/COFLevel";

/**
 * The controller that controls the player.
 */
export default class EnemyController extends StateMachineAI {

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

    protected _lastFace: number; // Could be -1 for left, or 1 for right.

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
				this.handleEnemySwingHit(event.data.get("id"), event.data.get("entity"));
				break;
			}
            case COFEvents.FIREBALL_HIT_ENEMY: {
				this.handleEnemyFireballHit(event.data.get("other"), event.data.get("entity"));
				break;
            }
            case COFEvents.ENEMY_STUNNED: {
                this.handleEnemyStunned(event);
                break;
            }
		}
	}

    // ======================================================================
    // Getters and setters

    public get lastFace(): number { return this._lastFace; }
    public set lastFace(x: number) { this._lastFace = x; }

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
    }

    // Getters and setters
    // ======================================================================
    
    // ======================================================================
    // Event handlers

    public handleEnemySwingHit(id: number, entity: string): void {
        if (id !== this.owner.id)
            return;

        this.health -= 50;
        if (entity !== COFEntities.MINION) {
            this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});
        }
        else {
            if (this.health === 0) {
                this.emitter.fireEvent(COFEvents.MINION_DEAD, {id: id});
            }
        }
    }

    public handleEnemyFireballHit(id: number, entity: string): void {
        if (id !== this.owner.id) {
            return;
        }

        this.health -= 100;
        if (entity !== COFEntities.MINION) {
            this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});
        }
        else {
            if (this.health === 0) {
                this.emitter.fireEvent(COFEvents.MINION_DEAD, {id: id});
            }
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
    // directional: negative - boss above player
    //              positive - boss below player
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