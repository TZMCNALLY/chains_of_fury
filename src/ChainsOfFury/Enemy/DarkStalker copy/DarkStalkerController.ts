import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import Idle from "./DarkStalkerStates/Idle";

export const DarkStalkerStates = {
    IDLE: "IDLE",
} as const

export const DarkStalkerAnimations = {
    IDLE: "IDLE",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKINGDAMAGE_RIGHT: "DAMAGE_RIGHT",
    TAKINGDAMAGE_LEFT: "DAMAGE_LEFT",
    RUN_RIGHT: "WALKING_RIGHT",
    RUN_LEFT: "WALKING_LEFT",
    DYING: "DYING",
    DEAD: "DEAD",
} as const

export default class DarkStalkerController extends EnemyController {

    protected _chargeSpeed: number;
    protected _walkSpeed: number;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(DarkStalkerStates.IDLE, new Idle(this, this.owner));

        this.initialize(DarkStalkerStates.IDLE);

        this.maxHealth = 500;
        this.health = this.maxHealth;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}