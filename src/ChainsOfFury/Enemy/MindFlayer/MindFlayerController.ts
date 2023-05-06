import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";

import Idle from "./MindFlayerStates/Idle";
import Walk from "./MindFlayerStates/Walk";
import Teleport from "./MindFlayerStates/Teleport";
import Damaged from "./MindFlayerStates/Damaged";
import Dead from "./MindFlayerStates/Dead";
import CastFireballs from "./MindFlayerStates/CastFireballs";
import SpawnShadowDemons from "./MindFlayerStates/SpawnShadowDemons";
import Healing from "./MindFlayerStates/Healing";
import { MindFlayerEvents } from "./MindFlayerEvents";

export const MindFlayerStates = {
    IDLE: "IDLE",
    WALK: "WALK",
	DAMAGED: "DAMAGED",
    CAST_FIREBALLS: "CAST_FIREBALLS",
    SPAWN_SHADOW_DEMONS: "SPAWN_SHADOW_DEMONS",
    TELEPORT: "TELEPORT",
    HEALING: "HEALING",
    DEAD: "DEAD"
} as const

export const MindFlayerAnimation = {
    IDLE: "IDLE",
    CAST_FIREBALLS: "CASTING_LEFT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    SPAWN_SHADOW_DEMONS: "DANCING",
    HEALING: "HEALING",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class MindFlayerController extends EnemyController {

    protected _shadowDemonCount : number = 0;
    protected _maxShadowDemonCount : number = 5;
    protected _lastActionTime : Date;
    protected _actionDelay: number;

    public get lastActionTime() : Date {
        return this._lastActionTime;
    }
    public set lastActionTime(time: Date) {
        this._lastActionTime = time;
    }

    public get actionDelay() : number {
        return this._actionDelay;
    }
    public set actionDelay(delay: number) {
        this._actionDelay = delay;
    }

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.receiver.subscribe(COFEvents.MINION_DEAD);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_DEAD);

        this.addState(MindFlayerStates.IDLE, new Idle(this, this.owner));
        this.addState(MindFlayerStates.WALK, new Walk(this, this.owner));
        this.addState(MindFlayerStates.CAST_FIREBALLS, new CastFireballs(this, this.owner));
        this.addState(MindFlayerStates.SPAWN_SHADOW_DEMONS, new SpawnShadowDemons(this, this.owner));
        this.addState(MindFlayerStates.TELEPORT, new Teleport(this, this.owner));
        this.addState(MindFlayerStates.HEALING, new Healing(this, this.owner));
        this.addState(MindFlayerStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(MindFlayerStates.DEAD, new Dead(this, this.owner));

        this.initialize(MindFlayerStates.IDLE);
        this.lastActionTime = new Date();
        this.actionDelay = 3000;

        this.maxHealth = 2000;
        this.health = this.maxHealth;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
        if (this.health <= 0 && !this.isDead) {
            this.emitter.fireEvent(MindFlayerEvents.MIND_FLAYER_DEAD);
            this.isDead = true;
        }
	}

    public get shadowDemonCount() : number {
        return this._shadowDemonCount;
    }

    public set shadowDemonCount(count: number) {
        this._shadowDemonCount = count;
    }
    
    public get maxShadowDemonCount() : number {
        return this._maxShadowDemonCount;
    }

    public set maxShadowDemonCount(count: number) {
        this._maxShadowDemonCount = count;
    }
    
    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
			case COFEvents.MINION_DEAD: {
				this.handleShadowDemonDead(event);
				break;
			}
            case COFEvents.SWING_HIT: {
                this.handleSwingHit(event.data.get("id"));
				break;
			}
            case MindFlayerEvents.MIND_FLAYER_DEAD: {
                this.handleMindFlayerDead();
                break;
            }
            case COFEvents.FIREBALL_HIT_ENEMY: {
                this.handleFireballHit(event.data.get("other"));
            }
		}
	}

    protected handleShadowDemonDead(event: GameEvent) {
        this.shadowDemonCount--;
    }

    protected handleFireballHit(id: number) {
        if (this.owner.id === id && !this.isDead) {
            this.changeState(MindFlayerStates.DAMAGED);
        }
    }

    protected handleSwingHit(id: number) {
        if (this.owner.id === id && !this.isDead)
            this.changeState(MindFlayerStates.DAMAGED);
    }

    protected handleMindFlayerDead() {
        this.changeState(MindFlayerStates.DEAD);
    }
}