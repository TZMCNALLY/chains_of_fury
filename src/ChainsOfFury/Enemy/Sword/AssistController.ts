import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Walk from './AssistStates/Walk'
import Spawn from './AssistStates/Spawn'
import ThrowBeam from './AssistStates/ThrowBeam'
import Damaged from './AssistStates/Damaged'
import Dead from './AssistStates/Dead'
import Heal from './AssistStates/Heal'

import Timer from '../../../Wolfie2D/Timing/Timer';
import { COFEntities } from "../../Scenes/COFLevel";
import { SwordEvents } from './SwordEvents';
import SwordController from "./SwordController";
import { AssistEvents } from "./AssistEvents";

export const AssistStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    SPAWN: "SPAWN",
    HEAL: "HEAL",
    THROW_BEAM: "THROW_BEAM",
    //CREATE CLONES MAY BE ADDED
    DAMAGED: "DAMAGED",
    DEAD: "DEAD"
} as const

export const AssistAnimations = {
    IDLE: "IDLE",
    SPAWN: "SPAWN",
    MOVE_RIGHT: "MOVE_RIGHT",
    MOVE_LEFT: "MOVE_LEFT",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    DANCE: "DANCE",
    ATTACKED_RIGHT: "ATTACKED_RIGHT",
    ATTACKED_LEFT: "ATTACKED_LEFT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export const AssistTweens = {
    PROJECTILE: "PROJECTILE"
} as const

export default class AssistController extends EnemyController {

    public walkTime: Date; // tracks when the sword started walking

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(AssistStates.SPAWN, new Spawn(this, this.owner))
        this.addState(AssistStates.WALK, new Walk(this, this.owner));
        this.addState(AssistStates.HEAL, new Heal(this, this.owner));
        this.addState(AssistStates.THROW_BEAM, new ThrowBeam(this, this.owner));
        this.addState(AssistStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(AssistStates.DEAD, new Dead(this, this.owner));

        this.walkTime = new Date();
        this.initialize(AssistStates.SPAWN);
        this.receiver.subscribe(COFEvents.SWING_HIT)
        this.receiver.subscribe(SwordEvents.SWORD_DEAD)

        this.maxHealth = 2000;
        this.health = this.maxHealth;
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
			case COFEvents.SWING_HIT: {
                if(this.health <= 0 && this.currentState != this.stateMap.get(AssistStates.DEAD))
                    this.changeState(AssistStates.DEAD);

                else if(this.currentState == this.stateMap.get(AssistStates.WALK) 
                        || this.currentState == this.stateMap.get(AssistStates.IDLE)
                        || this.currentState == this.stateMap.get(AssistStates.HEAL))
                    this.changeState(AssistStates.DAMAGED);
                
				break;
			}
            case SwordEvents.SWORD_DEAD: {
                this.changeState(AssistStates.DEAD);
                break;
            }
		}
	}

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}