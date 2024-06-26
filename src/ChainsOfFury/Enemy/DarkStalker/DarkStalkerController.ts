import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import StageA from "./DarkStalkerStates/StageA";
import Walk from "./DarkStalkerStates/Walk";
import Cast from "./DarkStalkerStates/Cast"
import Teleport from "./DarkStalkerStates/Teleport";
import Death from "./DarkStalkerStates/Death";
import { COFEvents } from "../../COFEvents";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { DarkStalkerEvents } from "./DarkStalkerEvents";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import COFLevel from "../../Scenes/COFLevel";

export const DarkStalkerStates = {
    IDLE: "IDLE",
    STAGEA: "STAGEA",
    WALK: "WALK",
    CAST: "CAST",
    TELEPORT: "TELEPORT",
    DEATH: "DEATH",
} as const

export const DarkStalkerAnimations = {
    IDLE: "IDLE",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKINGDAMAGE_RIGHT: "DAMAGE_RIGHT",
    TAKINGDAMAGE_LEFT: "DAMAGE_LEFT",
    RUN_RIGHT: "WALKING_RIGHT",
    RUN_LEFT: "WALKING_LEFT",
    DYING: "DYING",
    DEAD: "DEAD",

    /** Simplify so I can just use flip later. */
    RUN: "WALKING_LEFT",
    TAKING_DAMAGE: "DAMAGE_LEFT",
    TELEPORT: "DYING", // TODO: Using this animation, rename this later.
    MAGIC: "MAGIC"
} as const

export default class DarkStalkerController extends EnemyController {

    protected _chargeSpeed: number;
    protected _walkVelocity: Vec2;
    protected _currMagic: number;

    protected _activeMines: number;
    protected _activeEyes: number;

    protected _lastTPHitCount: number;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(DarkStalkerStates.STAGEA, new StageA(this, this.owner));
        this.addState(DarkStalkerStates.WALK, new Walk(this, this.owner));
        this.addState(DarkStalkerStates.CAST, new Cast(this, this.owner));
        this.addState(DarkStalkerStates.TELEPORT, new Teleport(this, this.owner));
        this.addState(DarkStalkerStates.DEATH, new Death(this, this.owner));

        this.receiver.subscribe(DarkStalkerEvents.TELEPORT);

        this.maxHealth = 2200;
        this.health = this.maxHealth;

        this._walkVelocity = new Vec2(75, 75);

        this._activeEyes = 0;
        this._activeMines = 0;

        this._lastTPHitCount = 0;

        this._currMagic = 1;
        this.initialize(DarkStalkerStates.CAST);
    }

    public handleEnemySwingHit(id: number, entity: string): void {
        if (id !== this.owner.id) {
            this.emitter.fireEvent(DarkStalkerEvents.MINION_HIT, {node: id});
            return;
        }

        this.health -= this.damageFromPhysical;
        this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});

        if (this.health == 0) {
            if (this.currentState != this.stateMap.get(DarkStalkerStates.DEATH))
                this.changeState(DarkStalkerStates.DEATH);
        }

        this._walkVelocity = new Vec2(0, 0);
        let returnWalkspeedTimer = new Timer(300, () => {
            this._walkVelocity = new Vec2(75, 75);
        });
        returnWalkspeedTimer.start();

        if (this.currentState == this.stateMap.get(DarkStalkerStates.WALK) || this.currentState == this.stateMap.get(DarkStalkerStates.STAGEA)) {
            this.owner.animation.play(DarkStalkerAnimations.TAKING_DAMAGE);

            this._lastTPHitCount += 1;
        }
        // if (entity !== COFEntities.MINION) {
        //     this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});
        // }
        // else {
        //     if (this.health === 0) {
        //         this.emitter.fireEvent(COFEvents.MINION_DYING, {id: id});
        //     }
        // }
    }

    public handleEnemyFireballHit(id: number, entity: string): void {
        if (id !== this.owner.id) {
            // Two event to kill minion with fireball.
            this.emitter.fireEvent(DarkStalkerEvents.MINION_HIT, {node: id});
            this.emitter.fireEvent(DarkStalkerEvents.MINION_HIT, {node: id});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.ENEMY_HIT_KEY});
            return;
        }


        this.health -= this.damageFromProjectile;
        this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});

        if (this.health == 0) {
            if (this.currentState != this.stateMap.get(DarkStalkerStates.DEATH))
                this.changeState(DarkStalkerStates.DEATH);
        }
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);

        switch(event.type) {
			case DarkStalkerEvents.TELEPORT: {
				this.changeState(DarkStalkerStates.STAGEA);
				break;
			}
		}
    }

    public get walkVelocity(): Vec2 {
        return this._walkVelocity;
    }

    public get currMagic(): number { 
        return this._currMagic;
    }

    public set currMagic(currMagic: number) {
        this._currMagic = currMagic;
    }

    public get activeMines(): number {
        return this._activeMines;
    }

    public set activeMines(activeMines: number) {
        this._activeMines = activeMines;
    }

    public get activeEyes(): number {
        return this._activeEyes;
    }

    public set activeEyes(v : number) {
        this._activeEyes = v;
    }

    public get lastTPHitCount(): number {
        return this._lastTPHitCount;
    }

    public set lastTPHitCount(v: number) {
        this._lastTPHitCount = v;
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}