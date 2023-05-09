import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./MoonDogStates/Idle";
// import Run from "./MoonDogStates/Run";
// import Attack from "./OldStates - to be deleted/Attack";
// import Charge from "./MoonDogStates/Charge";
// import Damaged from "./MoonDogStates/Damaged";
// import Dead from "./MoonDogStates/Dead";
// import Stunned from "./MoonDogStates/Stunned";
import HorizontalCharge from "./MoonDogStates/HorizontalCharge";
import Magic from "./MoonDogStates/Magic";
import Summon from "./MoonDogStates/Summon";
import Pound from "./MoonDogStates/Pound";
import Death from "./MoonDogStates/Death";
import { MoonDogEvents } from "./MoonDogEvents";
import COFLevel from "../../Scenes/COFLevel";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export const MoonDogStates = {
    // RUN: "RUN",
	// DAMAGED: "DAMAGED",
    // ATTACK: "ATTACK",
    // CHARGE: "CHARGE",
    // DEAD: "DEAD",
    // STUNNED: "STUNNED",

    IDLE: "IDLE",
    HORIZONTAL_CHARGE: "HORIZONTAL_CHARGE",
    MAGIC: "MAGIC",
    SUMMON: "SUMMON",
    POUND: "POUND",
    DEATH: "DEATH"
} as const

export const MoonDogAnimation = {
    IDLE: "IDLE",
    CHARGE: "CHARGE",
    PREPARING_MAGIC: "PREPARING_MAGIC",
    MAGIC: "MAGIC",
    SUMMON: "DAMAGE_LEFT",
    POUND: "POUND",
    WALKING: "WALKING_LEFT",
    DEATH: "DEATH"
} as const

export default class MoonDogController extends EnemyController {

    protected _chargeSpeed: number;
    protected _walkSpeed: number;

    public minionCount: number;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        // Current plan:
        // Two phase:
        // Phase 1:
        // Boss spawns 3 minions that attack as well.
        // Boss occasionally charges
        // Boss goes in a magic state where meteor(moons) falls on player, there will need to be an indicatior on the ground for this
        // Phase 2:
        // Boss stop magic attack, and gains a gound pound attack.
        // -> Ground pound attack.
        // Charges as much as possible
        // Summons minions to 5 max

        this.addState(MoonDogStates.HORIZONTAL_CHARGE, new HorizontalCharge(this, this.owner));
        this.addState(MoonDogStates.MAGIC, new Magic(this, this.owner));
        this.addState(MoonDogStates.SUMMON, new Summon(this, this.owner));
        this.addState(MoonDogStates.POUND, new Pound(this, this.owner));
        this.addState(MoonDogStates.IDLE, new Idle(this, this.owner));
        this.addState(MoonDogStates.DEATH, new Death(this, this.owner));

        this.initialize(MoonDogStates.SUMMON);

        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.walkSpeed = 4;
        this.chargeSpeed = 18;

        this.minionCount = 0;
    }    

    public update(deltaT: number): void {
		super.update(deltaT);
	}

    public get chargeSpeed(): number { return this._chargeSpeed; }
    public set chargeSpeed(chargeSpeed: number) {
        this._chargeSpeed = chargeSpeed;
    }

    public get walkSpeed(): number { return this._walkSpeed; }
    public set walkSpeed(walkSpeed: number) {
        this._walkSpeed = walkSpeed;
    }


    public handleEnemySwingHit(id: number, entity: string): void {
        if (id !== this.owner.id) {
            this.emitter.fireEvent(MoonDogEvents.MINION_HIT, {node: id});
            return;
        }

        if (this.currentState == this.stateMap.get(MoonDogStates.MAGIC)) {
            return; // Invul when casting magic.
        }

        this.health -= this.damageFromPhysical;
        this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});

        if (this.health == 0) {
            if (this.currentState != this.stateMap.get(MoonDogStates.DEATH)) {
                this.changeState(MoonDogStates.DEATH);
            }
        }
    }

    public handleEnemyFireballHit(id: number, entity: string): void {
        if (id !== this.owner.id) {
            // Double emit to simulate 100 damage.
            this.emitter.fireEvent(MoonDogEvents.MINION_HIT, {node: id});
            this.emitter.fireEvent(MoonDogEvents.MINION_HIT, {node: id});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.ENEMY_HIT_KEY});
            return;
        }

        if (this.currentState == this.stateMap.get(MoonDogStates.MAGIC)) {
            return; // Invul when casting magic.
        }

        if (this.health == 0) {

            if (this.currentState != this.stateMap.get(MoonDogStates.DEATH)) {
                this.changeState(MoonDogStates.DEATH);
            }
        }

        this.health -= this.damageFromProjectile;
        this.emitter.fireEvent(COFEvents.BOSS_TOOK_DAMAGE, {currHealth: this.health, maxHealth: this.maxHealth});
    }
}