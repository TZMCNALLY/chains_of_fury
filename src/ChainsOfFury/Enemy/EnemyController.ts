import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import COFAnimatedSprite from "../Nodes/COFAnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFEvents } from "../COFEvents";

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

    
    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>){
        this.owner = owner;
    }


    public update(deltaT: number): void {
		super.update(deltaT);
	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }

    public get health(): number { return this._health; }

    // TODO: Determine if health setters are needed... if not, delete the following.

    // public set maxHealth(maxHealth: number) { 
    //     this._maxHealth = maxHealth; 
    //     // When the health changes, fire an event up to the scene.
    //     this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    // }

    // public set health(health: number) { 
    //     this._health = MathUtils.clamp(health, 0, this.maxHealth);
    //     // When the health changes, fire an event up to the scene.
    //     this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    //     // If the health hit 0, change the state of the player
    //     if (this.health === 0) {
    //         this.changeState(AzazelStates.DEAD); 
    //     }
    // }
}