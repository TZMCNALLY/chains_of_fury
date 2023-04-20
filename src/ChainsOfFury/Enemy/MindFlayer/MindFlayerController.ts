import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./MindFlayerStates/Idle";
import Run from "./MindFlayerStates/Run";
import Attack from "./MindFlayerStates/Attack";
import Damaged from "./MindFlayerStates/Damaged";
import Dead from "./MindFlayerStates/Dead";

export const MindFlayerStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    DEAD: "DEAD"
} as const

export const MindFlayerAnimation = {
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
    DEAD_LEFT: "DEAD_LEFT"
} as const

export default class MindFlayerController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MindFlayerStates.IDLE, new Idle(this, this.owner));
        this.addState(MindFlayerStates.RUN, new Run(this, this.owner));
        this.addState(MindFlayerStates.ATTACK, new Attack(this, this.owner));
        this.addState(MindFlayerStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(MindFlayerStates.DEAD, new Dead(this, this.owner));

        this.initialize(MindFlayerStates.IDLE);

        this.maxHealth = 500;
        this.health = this.maxHealth;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
	}

    // public handleEvent(event: GameEvent): void {
	// 	switch(event.type) {
	// 		case COFEvents.ENEMY_HIT: {
	// 			this.handleEnemyHit(event);
	// 			break;
	// 		}
	// 		default: {
	// 			throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
	// 		}
	// 	}
	// }

}