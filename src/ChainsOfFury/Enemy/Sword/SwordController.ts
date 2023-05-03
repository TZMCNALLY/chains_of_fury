import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";

import Idle from "./SwordStates/Idle";
import BasicAttack from "./SwordStates/BasicAttack";
import Walk from "./SwordStates/Walk"
import Tornado from "./SwordStates/Tornado";
import Damaged from './SwordStates/Damaged';
import Dead from './SwordStates/Dead';
import Summon from './SwordStates/Summon'
import Frenzy from './SwordStates/Frenzy'
import Timer from '../../../Wolfie2D/Timing/Timer';
import { COFEntities } from "../../Scenes/COFLevel";
import { SwordEvents } from './SwordEvents';

export const SwordStates = {
    IDLE: "IDLE",
    WALK: "WALK",
    BASIC_ATTACK: "BASIC_ATTACK",
    TORNADO: "TORNADO",
    SUMMON: "SUMMON",
    FRENZY: "FRENZY",
    DAMAGED: "DAMAGED",
    DEAD: "DEAD"
} as const

export const SwordAnimations = {
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

export const SwordTweens = {
    SPIN: "SPIN",
    TWIRL: "TWIRL",
    FADE_OUT: "FADE_OUT",
    FADE_IN: "FADE_IN"
} as const

export default class SwordController extends EnemyController {

    public walkTime: Date; // tracks when the sword started walking

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.receiver.subscribe(COFEvents.BOSS_RECEIVE_HEAL);

        this.addState(SwordStates.IDLE, new Idle(this, this.owner));
        this.addState(SwordStates.BASIC_ATTACK, new BasicAttack(this, this.owner));
        this.addState(SwordStates.WALK, new Walk(this, this.owner));
        this.addState(SwordStates.TORNADO, new Tornado(this, this.owner));
        this.addState(SwordStates.FRENZY, new Frenzy(this, this.owner));
        this.addState(SwordStates.SUMMON, new Summon(this, this.owner));
        this.addState(SwordStates.DAMAGED, new Damaged(this, this.owner));
        this.addState(SwordStates.DEAD, new Dead(this, this.owner));

        this.walkTime = new Date();
        this.initialize(SwordStates.WALK);

        this.maxHealth = 2000;
        this.health = this.maxHealth;
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
			case COFEvents.SWING_HIT: {
                if(this.health <= 0 && this.currentState != this.stateMap.get(SwordStates.DEAD)) {
                    this.owner.tweens.stop(SwordTweens.SPIN);
                    //this.owner.tweens.play(SwordTweens.TWIRL) // readjust to standing upright
                    this.changeState(SwordStates.DEAD);
                    this.emitter.fireEvent(SwordEvents.SWORD_DEAD)
                }

                else if(this.currentState == this.stateMap.get(SwordStates.WALK) || this.currentState == this.stateMap.get(SwordStates.IDLE))
                    this.changeState(SwordStates.DAMAGED);

                break;
            }

            case COFEvents.BOSS_RECEIVE_HEAL: {
                this.handleEnemyHeal(event.data.get("heal"));
                break;
            }
		}
	}

    public handleEnemyHeal(heal: number): void {
        this.health += heal;
        this.emitter.fireEvent(COFEvents.BOSS_HEALED, {currHealth: this.health, maxHealth: this.maxHealth});
    }

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}