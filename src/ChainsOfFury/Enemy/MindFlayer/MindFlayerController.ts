import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./MindFlayerStates/Idle";
import Walk from "./MindFlayerStates/Walk";
import Attack from "./MindFlayerStates/Attack";
import Teleport from "./MindFlayerStates/Teleport";
import Damaged from "./MindFlayerStates/Damaged";
import Dead from "./MindFlayerStates/Dead";

export const MindFlayerStates = {
    IDLE: "IDLE",
    WALK: "WALK",
	DAMAGED: "DAMAGED",
    ATTACK: "ATTACK",
    TELEPORT: "TELEPORT",
    DEAD: "DEAD"
} as const

export const MindFlayerAnimation = {
    IDLE: "IDLE",
    ATTACK: "CASTING_LEFT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class MindFlayerController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MindFlayerStates.IDLE, new Idle(this, this.owner));
        this.addState(MindFlayerStates.WALK, new Walk(this, this.owner));
        this.addState(MindFlayerStates.ATTACK, new Attack(this, this.owner));
        this.addState(MindFlayerStates.TELEPORT, new Teleport(this, this.owner));
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