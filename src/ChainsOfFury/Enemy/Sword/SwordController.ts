import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./SwordStates/Idle";
import BasicAttack from "./SwordStates/BasicAttack";
import Walk from "./SwordStates/Walk"
import SpinAttack from "./SwordStates/SpinAttack";
import Damaged from './SwordStates/Damaged';
import Timer from '../../../Wolfie2D/Timing/Timer';

export const SwordStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    BASIC_ATTACK: "BASIC_ATTACK",
    SPIN_ATTACK: "SPIN_ATTACK",
    DAMAGED: "DAMAGED"
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

    public walkTimer: Timer; // tracks how long the sword has not been attacking

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(SwordStates.IDLE, new Idle(this, this.owner));
        this.addState(SwordStates.BASIC_ATTACK, new BasicAttack(this, this.owner));
        this.addState(SwordStates.WALK, new Walk(this, this.owner));
        this.addState(SwordStates.SPIN_ATTACK, new SpinAttack(this, this.owner));
        this.addState(SwordStates.DAMAGED, new Damaged(this, this.owner))

        this.walkTimer = new Timer(3000);
        this.walkTimer.start()

        this.initialize(SwordStates.WALK);

        this.maxHealth = 10000;
        this.health = this.maxHealth;
    }

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
			case COFEvents.SWING_HIT: {
				super.handleEnemySwingHit(event);
                this.changeState(SwordStates.DAMAGED);
				break;
			}
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}