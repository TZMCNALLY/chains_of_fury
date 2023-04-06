import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

// import Fall from "./PlayerStates/Fall";
import Idle from "./AzazelStates/Idle";
import Run from "./AzazelStates/Run";
// import Walk from "./PlayerStates/Walk";

//import PlayerWeapon from "./PlayerWeapon";
import Input from "../../Wolfie2D/Input/Input";

import { AzazelControls } from "./AzazelControls";
import COFAnimatedSprite from "../Nodes/COFAnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFEvents } from "../COFEvents";
//import Dead from "./PlayerStates/Dead";

/**
 * Animation keys for the Azazel spritesheet
 */
export const AzazelAnimations = {
    IDLE_LEFT: "IDLE_LEFT",
    IDLE_RIGHT: "IDLE_RIGHT",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKINGDAMAGE_RIGHT: "TAKINGDAMAGE_RIGHT",
    TAKINGDAMAGE_LEFT: "TAKINGDAMAGE_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    RUN_LEFT: "RUN_LEFT",
    DYING_RIGHT: "DYING_RIGHT",
    DYING_LEFT: "DYING_LEFT",
    DEAD_RIGHT: "DEAD_RIGHT",
    DEAD_LEFT: "DEAD_LEFT",
    COMBO_RIGHT: "COMBO_RIGHT",
    COMBO_LEFT: "COMBO_LEFT",
} as const

/**
 * Keys for the states Azazel can be in.
 */
export const AzazelStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    DEAD: "DEAD"
} as const

/**
 * The controller that controls the player.
 */
export default class AzazelController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

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

       // this.weapon = options.weaponSystem;

        //this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        // this.health = 5;
        // this.maxHealth = 5;

        // Add the different states the player can be in to the PlayerController 
		this.addState(AzazelStates.IDLE, new Idle(this, this.owner));
        this.addState(AzazelStates.RUN, new Run(this, this.owner));
		// this.addState(AzazelStates.RUN, new Walk(this, this.owner));
        // this.addState(AzazelStates.DAMAGED, new Jump(this, this.owner));
        // this.addState(AzazelStates.Attack, new Fall(this, this.owner));
        // this.addState(AzazelStates.DEAD, new Dead(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(AzazelStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(AzazelControls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(AzazelControls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isPressed(AzazelControls.MOVE_DOWN) ? -1 : 0) + (Input.isPressed(AzazelControls.MOVE_UP) ? 1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);

        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        // if (Input.isPressed(HW3Controls.ATTACK) && !this.weapon.isSystemRunning()) {
        //     // Start the particle system at the player's current position
        //     this.weapon.startSystem(500, 0, this.owner.position);
        //     this.owner.animation.play(AzazelAnimations.ATTACK);
        // }

	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    // public set maxHealth(maxHealth: number) { 
    //     this._maxHealth = maxHealth; 
    //     // When the health changes, fire an event up to the scene.
    //     this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    // }

    public get health(): number { return this._health; }
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