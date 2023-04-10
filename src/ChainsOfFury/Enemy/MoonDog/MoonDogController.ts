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

export const MoonDogState = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    CHARGE: "CHARGE",
    DEAD: "DEAD"
} as const

export const MoonDogAnimation = {
    IDLE: "IDLE",
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
    CHARGE_RIGHT: "CHARGE_RIGHT",
    CHARGE_LEFT: "CHARGE_LEFT",
} as const

export default class MoonDogController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MoonDogState.IDLE, new Idle(this, this.owner));
        this.addState(MoonDogState.RUN, new Run(this, this.owner));
        this.addState(MoonDogState.ATTACK, new Attack(this, this.owner));
        this.addState(MoonDogState.CHARGE, new Charge(this, this.owner));
        this.addState(MoonDogState.DAMAGED, new Damaged(this, this.owner));
        this.addState(MoonDogState.DEAD, new Dead(this, this.owner));

        this.initialize(MoonDogState.IDLE);

        this.maxHealth = 500;
        this.health = this.maxHealth;
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

}