import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./MoonDogStates/Idle";
import Run from "./MoonDogStates/Run";
import Attack from "./MoonDogStates/Attack";
import Charge from "./MoonDogStates/Charge";
import Damaged from "./MoonDogStates/Damaged";
import Dead from "./MoonDogStates/Dead";
import Stunned from "./MoonDogStates/Stunned";
import HorizontalCharge from "./MoonDogStates/HorizontalCharge";
import Magic from "./MoonDogStates/Magic";

export const MoonDogStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    CHARGE: "CHARGE",
    DEAD: "DEAD",
    STUNNED: "STUNNED",

    HORIZONTAL_CHARGE: "HORIZONTAL_CHARGE",
    MAGIC: "MAGIC"
} as const

export const MoonDogAnimation = {
    IDLE: "IDLE",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKINGDAMAGE_RIGHT: "DAMAGE_RIGHT",
    TAKINGDAMAGE_LEFT: "DAMAGE_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    RUN_LEFT: "RUN_LEFT",
    DYING_RIGHT: "DYING_RIGHT",
    DYING_LEFT: "DYING_LEFT",
    DEAD_RIGHT: "DEAD_RIGHT",
    DEAD_LEFT: "DEAD_LEFT",
    CHARGE_RIGHT: "WALKING_RIGHT",
    CHARGE_LEFT: "WALKING_LEFT",

    CHARGE: "CHARGE",
    MAGIC: "MAGIC"
} as const

export default class MoonDogController extends EnemyController {

    protected _chargeSpeed: number;
    protected _walkSpeed: number;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MoonDogStates.IDLE, new Idle(this, this.owner));
        this.addState(MoonDogStates.RUN, new Run(this, this.owner));
        this.addState(MoonDogStates.ATTACK, new Attack(this, this.owner));
        this.addState(MoonDogStates.CHARGE, new Charge(this, this.owner));
        this.addState(MoonDogStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(MoonDogStates.DEAD, new Dead(this, this.owner));
        this.addState(MoonDogStates.STUNNED, new Stunned(this, this.owner));

        this.addState(MoonDogStates.HORIZONTAL_CHARGE, new HorizontalCharge(this, this.owner));
        this.addState(MoonDogStates.MAGIC, new Magic(this, this.owner));

        this.initialize(MoonDogStates.IDLE);

        this.maxHealth = 500;
        this.health = this.maxHealth;
        this.walkSpeed = 4;
        this.chargeSpeed = 18;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
	}

    public get chargeSpeed(): number { return this._chargeSpeed; }
    public set chargeSpeed(chargeSpeed: number) {
        this._chargeSpeed = chargeSpeed;
    }

    public get walkSpeed(): number { return this._walkSpeed; }
    public set walkSpeed(walkSpeed: number) {
        this._walkSpeed = walkSpeed;
    }
}