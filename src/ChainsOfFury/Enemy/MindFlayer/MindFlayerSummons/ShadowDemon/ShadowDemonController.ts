import EnemyController from "../../../EnemyController";
import COFAnimatedSprite from "../../../../Nodes/COFAnimatedSprite";
import Idle from "./ShadowDemonStates/Idle";
import Walk from "./ShadowDemonStates/Walk";
import CastFireballs from "./ShadowDemonStates/CastFireballs";
import Damaged from "./ShadowDemonStates/Damaged";
import Dead from "./ShadowDemonStates/Dead";
import Attack from "./ShadowDemonStates/Attack";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../../../COFEvents";

export const ShadowDemonStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    ATTACK: "ATTACK",
	DAMAGED: "DAMAGED",
    CAST_FIREBALLS: "CAST_FIREBALLS",
    DEAD: "DEAD"
} as const

export const ShadowDemonAnimation = {
    IDLE: "IDLE",
    CAST_LEFT_FIREBALLS: "ATTACKING_LEFT",
    CAST_RIGHT_FIREBALLS: "ATTACKING_RIGHT",
    DAMAGED_RIGHT: "DAMAGED_RIGHT",
    DAMAGED_LEFT: "DAMAGED_LEFT",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    ATTACK_LEFT: "ATTACKING_LEFT",
    ATTACK_RIGHT: "ATTACKING_RIGHT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class ShadowDemonController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.receiver.subscribe(COFEvents.MINION_DYING);

        this.addState(ShadowDemonStates.IDLE, new Idle(this, this.owner));
        this.addState(ShadowDemonStates.WALK, new Walk(this, this.owner));
        this.addState(ShadowDemonStates.ATTACK, new Attack(this, this.owner));
        this.addState(ShadowDemonStates.CAST_FIREBALLS, new CastFireballs(this, this.owner));
        this.addState(ShadowDemonStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(ShadowDemonStates.DEAD, new Dead(this, this.owner));

        this.initialize(ShadowDemonStates.IDLE);

        this.maxHealth = 100;
        this.health = this.maxHealth;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
	}
    
    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
            case COFEvents.SWING_HIT: {
                this.handleSwingHit(event.data.get("id"));
				break;
			}
            case COFEvents.MINION_DYING: {
                this.handleMinionDying(event.data.get("id"));
                break;
            }
		}
	}

    protected handleSwingHit(id: number) {
        if (this.owner.id === id && !this.isDead) {
            this.changeState(ShadowDemonStates.DAMAGED);
        }
    }

    protected handleMinionDying(id: number) {
        if (this.owner.id === id && !this.isDead) {
            this.changeState(ShadowDemonStates.DEAD);
            this.isDead = true;
        }
    }
}