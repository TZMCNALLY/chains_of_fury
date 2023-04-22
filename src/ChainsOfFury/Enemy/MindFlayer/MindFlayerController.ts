import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./MindFlayerStates/Idle";
import Walk from "./MindFlayerStates/Walk";
import Teleport from "./MindFlayerStates/Teleport";
import Damaged from "./MindFlayerStates/Damaged";
import Dead from "./MindFlayerStates/Dead";
import CastFireballs from "./MindFlayerStates/CastFireballs";
import SpawnShadowDemons from "./MindFlayerStates/SpawnShadowDemons";

export const MindFlayerStates = {
    IDLE: "IDLE",
    WALK: "WALK",
	DAMAGED: "DAMAGED",
    CAST_FIREBALLS: "ATTACK",
    SPAWN_SHADOW_DEMONS: "SPAWN_SHADOW_DEMONS",
    TELEPORT: "TELEPORT",
    DEAD: "DEAD"
} as const

export const MindFlayerAnimation = {
    IDLE: "IDLE",
    CAST_FIREBALLS: "CASTING_LEFT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    SPAWN_SHADOW_DEMONS: "DANCING",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class MindFlayerController extends EnemyController {

    protected _shadowDemonCount : number = 0;
    protected _maxShadowDemonCount : number = 5;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MindFlayerStates.IDLE, new Idle(this, this.owner));
        this.addState(MindFlayerStates.WALK, new Walk(this, this.owner));
        this.addState(MindFlayerStates.CAST_FIREBALLS, new CastFireballs(this, this.owner));
        this.addState(MindFlayerStates.SPAWN_SHADOW_DEMONS, new SpawnShadowDemons(this, this.owner));
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

    public get shadowDemonCount() : number {
        return this._shadowDemonCount;
    }

    public set shadowDemonCount(count : number) {
        this._shadowDemonCount = count;
    }
    
    public get maxShadowDemonCount() : number {
        return this._maxShadowDemonCount;
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