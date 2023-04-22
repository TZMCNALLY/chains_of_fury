import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./SwordStates/Idle";
import BasicAttack from "./SwordStates/BasicAttack";
import Walk from "./SwordStates/Walk"
import SpinAttack from "./SwordStates/SpinAttack";

export const SwordStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    BASIC_ATTACK: "BASIC_ATTACK",
    SPIN_ATTACK: "SPIN_ATTACK"
} as const

export const SwordAnimation = {
    IDLE: "IDLE",
    SPAWN: "SPAWN",
    MOVE_RIGHT: "MOVE_RIGHT",
    MOVE_LEFT: "MOVE_LEFT",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    ATTACKED_RIGHT: "ATTACKED_RIGHT",
    ATTACKED_LEFT: "ATTACKED_LEFT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export const SwordTweens = {
    SPIN: "SPIN"
} as const

export default class SwordController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(SwordStates.IDLE, new Idle(this, this.owner));
        this.addState(SwordStates.BASIC_ATTACK, new BasicAttack(this, this.owner));
        this.addState(SwordStates.WALK, new Walk(this, this.owner));
        this.addState(SwordStates.SPIN_ATTACK, new SpinAttack(this, this.owner));

        this.initialize(SwordStates.WALK);
        
        this.maxHealth = 500;
        this.health = this.maxHealth;
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}