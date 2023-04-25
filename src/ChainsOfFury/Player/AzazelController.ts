import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Map from "../../Wolfie2D/DataTypes/Map";

import Idle from "./AzazelStates/Idle";
import Run from "./AzazelStates/Run";
import Swing from "./AzazelStates/Swing";
import Hurl from "./AzazelStates/Hurl";
import Teleport from "./AzazelStates/Teleport";
import Damaged from "./AzazelStates/Damaged";
import Dead from "./AzazelStates/Dead";

import Input from "../../Wolfie2D/Input/Input";

import { AzazelControls } from "./AzazelControls";
import COFAnimatedSprite from "../Nodes/COFAnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFEvents } from "../COFEvents";

import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
/**
 * Animation keys for the Azazel spritesheet
 */
export const AzazelAnimations = {
    IDLE_LEFT: "IDLE_LEFT",
    IDLE_RIGHT: "IDLE_RIGHT",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKEDAMAGE_RIGHT: "TAKEDAMAGE_RIGHT",
    TAKEDAMAGE_LEFT: "TAKEDAMAGE_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    RUN_LEFT: "RUN_LEFT",
    DYING_RIGHT: "DYING_RIGHT",
    DYING_LEFT: "DYING_LEFT",
    DEAD_RIGHT: "DEAD_RIGHT",
    DEAD_LEFT: "DEAD_LEFT",
    CHARGE_RIGHT: "CHARGE_RIGHT",
    CHARGE_LEFT: "CHARGE_LEFT",
} as const

export const AzazelTweens = {
    TELEPORTED: "TELEPORTED",
    IFRAME: "IFRAME"
}

/**
 * Keys for the states Azazel can be in.
 */
export const AzazelStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    SWING: "SWING",
    HURL: "HURL",
    DEAD: "DEAD",
    TELEPORT: "TELEPORT"
} as const

/**
 * The controller that controls the player.
 */
export default class AzazelController extends StateMachineAI {
    //public readonly MAX_SPEED: number = 200;
    //public readonly MIN_SPEED: number = 100;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** Stamina and max stamina for the player */
    protected _stamina: number;
    protected _maxStamina: number;

    /** Mana and max mana for the player */
    protected _mana: number;
    protected _maxMana: number;

    /** The players game node */
    protected owner: COFAnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected _lastFace: number; // Could be -1 for left, or 1 for right.

    protected tilemap: OrthogonalTilemap;

    protected isDead = false;

    protected _iframe = 0;

    protected _dashCooldown = 0;

    // A receiver and emitter to hook into the event queue
	public receiver: Receiver;
	public emitter: Emitter;
    
    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>){
        this.owner = owner;

       // this.weapon = options.weaponSystem;

        //this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 150;
        this.velocity = new Vec2(100, 0)
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        this.maxMana = 100;
        this.mana = this.maxMana;
        this.lastFace = 1;

        this._iframe = 0;

        // Add the different states the player can be in to the PlayerController 
		this.addState(AzazelStates.IDLE, new Idle(this, this.owner));
        this.addState(AzazelStates.RUN, new Run(this, this.owner));
        this.addState(AzazelStates.SWING, new Swing(this, this.owner));
        this.addState(AzazelStates.HURL, new Hurl(this, this.owner));
        this.addState(AzazelStates.TELEPORT, new Teleport(this, this.owner));
        this.addState(AzazelStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(AzazelStates.DEAD, new Dead(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(AzazelStates.IDLE);

        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.receiver.subscribe(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
        this.receiver.subscribe(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        this.receiver.subscribe(COFEvents.PLAYER_HURL);
        this.receiver.subscribe(COFEvents.PLAYER_RUN);
        this.receiver.subscribe(COFEvents.PLAYER_SWING);
        this.receiver.subscribe(COFEvents.PLAYER_TELEPORT);
        this.receiver.subscribe(COFEvents.REGENERATE_STAMINA);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(AzazelControls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(AzazelControls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isPressed(AzazelControls.MOVE_DOWN) ? 1 : 0) + (Input.isPressed(AzazelControls.MOVE_UP) ? -1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);

        if (this._iframe > 0) {
            this._iframe -= deltaT;
        } else {
            this.owner.tweens.stop(AzazelTweens.IFRAME);
            this.owner.alpha = 1;
        }

        if (this._dashCooldown > 0) {
            this._dashCooldown -= deltaT;
        }
	}

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
            case COFEvents.PHYSICAL_ATTACK_HIT_PLAYER: {
                this.handlePhysicalPlayerHit(event);
                break;
            }
			case COFEvents.ENEMY_PROJECTILE_HIT_PLAYER: {
				this.handleProjectilePlayerHit(event);
				break;
			}
            case COFEvents.PLAYER_HURL: {
				this.handlePlayerHurl(event);
				break;
			}
            case COFEvents.PLAYER_RUN: {
				this.handlePlayerRun(event);
				break;
			}
            case COFEvents.PLAYER_SWING: {
				this.handlePlayerSwing(event);
				break;
			}
            case COFEvents.PLAYER_TELEPORT: {
				this.handlePlayerGuard(event);
				break;
			}
            case COFEvents.REGENERATE_STAMINA: {
				this.handlePlayerRegenerateStamina(event);
				break;
			}
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}

    // ======================================================================
    // Setters and getters

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get lastFace(): number { 
        if (this.inputDir.x != 0) {
            this._lastFace = this.inputDir.x;
        }
        return this._lastFace;
    }
    public set lastFace(x: number) { this._lastFace = x; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
    }

    public get health(): number { return this._health; }

    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // If the health hit 0, change the state of the player
        if (this.health === 0 && !this.isDead) {
            this.changeState(AzazelStates.DEAD); 
            this.isDead = true;
        }
    }

    public get maxStamina(): number { return this._maxStamina; }
    public set maxStamina(maxStamina: number) { 
        this._maxStamina = maxStamina; 
    }

    public get stamina(): number { return this._stamina; }
    public set stamina(stamina: number) { 
        this._stamina = MathUtils.clamp(stamina, 0, this.maxStamina);
    }

    public get maxMana(): number { return this._maxMana; }
    public set maxMana(maxMana: number) { 
        this._maxMana = maxMana; 
    }

    public get mana(): number { return this._mana; }
    public set mana(mana: number) { 
        this._mana = MathUtils.clamp(mana, 0, this.maxMana);
    }

    public get dashCooldown(): number { return this._dashCooldown; }
    public set dashCooldown(dashCooldown: number) {
        this._dashCooldown = dashCooldown;
    }

    public get iFrames(): number { return this._iframe; }
    public set iFrames(iFrame: number) {
        this._iframe = iFrame;
    }

    // Setters and getters
    // ======================================================================


    // ======================================================================
    // Event handlers


    public handleProjectilePlayerHit(event: GameEvent): void {
        if (this._iframe > 0) {
            return;
        }
        this._iframe = .5; // Set iFrame time here.

        this.owner.tweens.play(AzazelTweens.IFRAME, true);

        this.health -= 10;
        this.emitter.fireEvent(COFEvents.PLAYER_TOOK_DAMAGE, {currHealth : this.health, maxHealth : this.maxHealth});

        if (this.health > 0)
            this.changeState(AzazelStates.DAMAGED);
    }

    public handlePhysicalPlayerHit(event: GameEvent): void {
        if (this._iframe > 0) {
            return;
        }
        this._iframe = .5; // Set _iframe time here.

        this.owner.tweens.play(AzazelTweens.IFRAME, true);

        this.health -= 10;
        this.emitter.fireEvent(COFEvents.PLAYER_TOOK_DAMAGE, {currHealth : this.health, maxHealth : this.maxHealth});

        if (this.health > 0)
            this.changeState(AzazelStates.DAMAGED);
    }

    public handlePlayerHurl(event: GameEvent): void {
        this.mana -= 10;
        this.emitter.fireEvent(COFEvents.CHANGE_MANA, {currMana : this.mana, maxMana : this.maxMana});
    }

    public handlePlayerRun(event : GameEvent) : void {
        this.stamina -= 0.05;
        this.emitter.fireEvent(COFEvents.CHANGE_STAMINA, {currStamina : this.stamina, maxStamina : this.maxStamina});
    }

    public handlePlayerSwing(event : GameEvent) : void {
        this.stamina -= 10;
        this.emitter.fireEvent(COFEvents.CHANGE_STAMINA, {currStamina : this.stamina, maxStamina : this.maxStamina});
    }

    public handlePlayerGuard(event : GameEvent) : void {
        this.mana -= .05;
        this.emitter.fireEvent(COFEvents.CHANGE_MANA, {currMana : this.mana, maxMana : this.maxMana});
    }

    public handlePlayerRegenerateStamina(event : GameEvent) : void {
        this.stamina += 0.5;

        if (this.stamina > this.maxStamina)
            this.stamina = this.maxStamina;

        this.emitter.fireEvent(COFEvents.CHANGE_STAMINA, {currStamina : this.stamina, maxStamina : this.maxStamina});
    }

    // Event handlers
    // ======================================================================
}