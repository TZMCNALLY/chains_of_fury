import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import { ReaperEvents } from "./ReaperEvents";

import Idle from "./ReaperStates/Idle";
import Walk from "./ReaperStates/Walk";
import Damaged from "./ReaperStates/Damaged";
import Dead from "./ReaperStates/Dead";
import Attack from "./ReaperStates/Attack";
import CreateDeathCircles from "./ReaperStates/CreateDeathCircles";
import ThrowSlashes from "./ReaperStates/ThrowSlashes";

export const ReaperStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    ATTACK: "ATTACK",
    SPAWN_DEATH_CIRCLES: "SPAWN_DEATH_CIRCLES",
    THROW_SLASHES: "THROW_SLASHES",
	DAMAGED: "DAMAGED",
    DEAD: "DEAD"
} as const

export const ReaperAnimation = {
    IDLE: "IDLE",
    WALK_RIGHT: "WALKING_RIGHT",
    WALK_LEFT: "WALKING_LEFT",
    ATTACKING_RIGHT: "ATTACKING_RIGHT",
    ATTACKING_LEFT: "ATTACKING_LEFT",
    SPAWN_DEATH_CIRCLES: "DANCING",
    THROW_SLASHES_LEFT: "THROW_SLASHES_LEFT",
    THROW_SLASHES_RIGHT: "THROW_SLASHES_RIGHT",
    TAKING_DAMAGE_RIGHT: "TAKING_DAMAGE_RIGHT",
    TAKING_DAMAGE_LEFT: "TAKING_DAMAGE_LEFT",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

export default class ReaperController extends EnemyController {

    protected _lastActionTime : Date;
    protected _berserkState: boolean;
    protected _hitCounter: number;

    public get lastActionTime() : Date {
        return this._lastActionTime;
    }
    public set lastActionTime(time: Date) {
        this._lastActionTime = time;
    }

    public get berserkState() : boolean {
        return this._berserkState;
    }
    public set berserkState(isActive: boolean) {
        this._berserkState = isActive;
    }

    public get hitCounter() : number {
        return this._hitCounter;
    }
    public set hitCounter(hitCount: number) {
        this._hitCounter = hitCount;
    }

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.receiver.subscribe(ReaperEvents.REAPER_DEAD);

        this.addState(ReaperStates.IDLE, new Idle(this, this.owner));
        this.addState(ReaperStates.WALK, new Walk(this, this.owner));
        this.addState(ReaperStates.ATTACK, new Attack(this, this.owner));
        this.addState(ReaperStates.SPAWN_DEATH_CIRCLES, new CreateDeathCircles(this, this.owner));
        this.addState(ReaperStates.THROW_SLASHES, new ThrowSlashes(this, this.owner));
        this.addState(ReaperStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(ReaperStates.DEAD, new Dead(this, this.owner));

        this.initialize(ReaperStates.IDLE);
        this.lastActionTime = new Date();
        this.berserkState = false;
        this.hitCounter = 0;

        this.maxHealth = 2500;
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
            case COFEvents.FIREBALL_HIT_ENEMY: {
                this.handleFireballHit(event.data.get("other"));
                break;
            }
            case ReaperEvents.REAPER_DEAD: {
                this.handleReaperDead();
                break;
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