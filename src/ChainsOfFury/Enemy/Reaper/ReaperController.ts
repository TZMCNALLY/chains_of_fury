import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { ReaperEvents } from "./ReaperEvents";

import Idle from "./ReaperStates/Idle";
import Walk from "./ReaperStates/Walk";
import Damaged from "./ReaperStates/Damaged";
import Dead from "./ReaperStates/Dead";

export const ReaperStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    ATTACK: "ATTACK",
	DAMAGED: "DAMAGED",
    DEAD: "DEAD"
} as const

export const ReaperAnimation = {
    IDLE: "IDLE",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    ATTACKING_RIGHT: "ATTACKING_RIGHT",
    ATTACKING_LEFT: "ATTACKING_LEFT",
    TAKING_DAMAGE_RIGHT: "TAKING_DAMAGE_RIGHT",
    TAKING_DAMAGE_LEFT: "TAKING_DAMAGE_LEFT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class ReaperController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.receiver.subscribe(ReaperEvents.REAPER_DEAD);

        this.addState(ReaperStates.IDLE, new Idle(this, this.owner));
        this.addState(ReaperStates.WALK, new Walk(this, this.owner));
        this.addState(ReaperStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(ReaperStates.DEAD, new Dead(this, this.owner));

        this.initialize(ReaperStates.IDLE);

        this.maxHealth = 2000;
        this.health = this.maxHealth;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
        if (this.health <= 0 && !this.isDead) {
            this.emitter.fireEvent(ReaperEvents.REAPER_DEAD);
            this.isDead = true;
        }
	}

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
            case COFEvents.SWING_HIT: {
                this.handleSwingHit(event.data.get("id"));
				break;
			}
            case ReaperEvents.REAPER_DEAD: {
                this.handleReaperDead();
                break;
            }
            case COFEvents.FIREBALL_HIT_ENEMY: {
                this.handleFireballHit(event.data.get("other"));
            }
		}
	}
    protected handleFireballHit(id: number) {
        if (this.owner.id === id && !this.isDead) {
            this.changeState(ReaperStates.DAMAGED);
        }
    }

    protected handleSwingHit(id: number) {
        if (this.owner.id === id && !this.isDead)
            this.changeState(ReaperStates.DAMAGED);
    }

    protected handleReaperDead() {
        this.changeState(ReaperStates.DEAD);
    }
}