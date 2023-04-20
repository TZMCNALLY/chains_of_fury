import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./SwordStates/Idle";
import Attack from "./SwordStates/Attack";

export const SwordStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    CHARGE: "CHARGE",
    DEAD: "DEAD",
    STUNNED: "STUNNED"
} as const

export const SwordAnimation = {
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
} as const

export const SwordTweens = {
    SPIN: "SPIN"
}

export default class SwordController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(SwordStates.IDLE, new Idle(this, this.owner));
        this.addState(SwordStates.ATTACK, new Attack(this, this.owner));
        //MAKE MORE STATES LATER

        this.initialize(SwordStates.IDLE);

        this.maxHealth = 500;
        this.health = this.maxHealth;
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}