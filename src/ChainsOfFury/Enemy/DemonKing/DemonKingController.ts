import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import Idle from "./DemonKingStates/Idle"
import Timer from "../../../Wolfie2D/Timing/Timer";
import Walk from "./DemonKingStates/Walk";
import Swipe from "./DemonKingStates/Swipe";
import LightningStrike from "./DemonKingStates/LightningStrike";
import CreateDeathCircles from "./DemonKingStates/CreateDeathCircles";
import ThrowSkulls from './DemonKingStates/SpawnSkulls';
import ExpandSkullShield from "./DemonKingStates/ExpandSkullShield";
import { DemonKingEvents } from './DemonKingEvents';
import Damaged from "./DemonKingStates/Damaged";
import Dead from "./DemonKingStates/Dead";

export const DemonKingStates = {
    IDLE: "IDLE",
    SWIPE: "SWIPE",
    WALK: "WALK",
    LIGHTNING_STRIKE: "LIGHTNING_STRIKE",
    SPAWN_DEATH_CIRCLES: "SPAWN_DEATH_CIRCLES",
    SPAWN_SKULLS: "SPAWN_SKULLS",
    EXPAND_SKULL_SHIELD: "EXPAND_SKULL_SHIELD",
    DAMAGED: "DAMAGED",
    DEAD: "DEAD"
} as const

export const DemonKingAnimations = {
    IDLE_LEFT: "IDLE_LEFT",
    IDLE_RIGHT: "IDLE_RIGHT",
    WALKING_LEFT: "WALKING_LEFT",
    WALKING_RIGHT: "WALKING_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    DYING_LEFT: "DYING_LEFT",
    DYING_RIGHT: "DYING_RIGHT",
    DEAD_LEFT: "DEAD_LEFT",
    DEAD_RIGHT: "DEAD_RIGHT",
    DANCING: "DANCING",
    DAMAGED_LEFT: "DAMAGED_LEFT",
    DAMAGED_RIGHT: "DAMAGED_RIGHT"
} as const

export default class DemonKingController extends EnemyController {

    public walkTime: Date;
    public numSkulls: number;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.receiver.subscribe(DemonKingEvents.SKULLS_SPAWN)
        this.receiver.subscribe(COFEvents.FIREBALL_HIT_ENEMY_PROJECTILE)

        this.addState(DemonKingStates.IDLE, new Idle(this, this.owner));
        this.addState(DemonKingStates.WALK, new Walk(this, this.owner))
        this.addState(DemonKingStates.SWIPE, new Swipe(this, this.owner))
        this.addState(DemonKingStates.LIGHTNING_STRIKE, new LightningStrike(this, this.owner))
        this.addState(DemonKingStates.SPAWN_DEATH_CIRCLES, new CreateDeathCircles(this, this.owner))
        this.addState(DemonKingStates.SPAWN_SKULLS, new ThrowSkulls(this, this.owner))
        this.addState(DemonKingStates.EXPAND_SKULL_SHIELD, new ExpandSkullShield(this, this.owner))
        this.addState(DemonKingStates.SWIPE, new Swipe(this, this.owner))
        this.addState(DemonKingStates.DAMAGED, new Damaged(this, this.owner))
        this.addState(DemonKingStates.DEAD, new Dead(this, this.owner))
        
        this.lastFace = -1;
        this.initialize(DemonKingStates.WALK);

        this.walkTime = new Date()
        this.maxHealth = 2000;
        this.health = this.maxHealth;
        this.numSkulls = 0;
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		switch(event.type) {
			case DemonKingEvents.SKULLS_SPAWN: {
                this.numSkulls = 6
				break;
			}
            case COFEvents.BOSS_DEFEATED: {
                this.changeState(DemonKingStates.DEAD);
                break;
            }
            case COFEvents.SWING_HIT: {
                if(this.health <= 0 && this.currentState != this.stateMap.get(DemonKingStates.DEAD)) {
                    this.changeState(DemonKingStates.DEAD);
                }

                else if(this.currentState == this.stateMap.get(DemonKingStates.WALK))
                    this.changeState(DemonKingStates.DAMAGED);

                break;
            }
            case COFEvents.FIREBALL_HIT_ENEMY_PROJECTILE: {
                this.numSkulls--;
            }
		}
	}

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}