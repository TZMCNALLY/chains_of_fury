import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import Idle from "./DemonKingStates/Idle"
import Timer from "../../../Wolfie2D/Timing/Timer";
import Walk from "./DemonKingStates/Walk";
import Swipe from "./DemonKingStates/Swipe";
import LightningStrike from "./DemonKingStates/LightningStrike";

export const DemonKingStates = {
    IDLE: "IDLE",
    SWIPE: "SWIPE",
    WALK: "WALK",
    LIGHTNING_STRIKE: "LIGHTNING_STRIKE"
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

    protected walkTime: Date;

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(DemonKingStates.IDLE, new Idle(this, this.owner));
        this.addState(DemonKingStates.WALK, new Walk(this, this.owner))
        this.addState(DemonKingStates.SWIPE, new Swipe(this, this.owner))
        this.addState(DemonKingStates.LIGHTNING_STRIKE, new LightningStrike(this, this.owner))
        
        this.initialize(DemonKingStates.WALK);

        this.walkTime = new Date()
        this.maxHealth = 2000;
        this.health = this.maxHealth;
    }

    public handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		// switch(event.type) {
		// 	case COFEvents.SWING_HIT: {
        //         if(this.health <= 0 && this.currentState != this.stateMap.get(SwordStates.DEAD)) {
        //             this.owner.tweens.stop(SwordTweens.SPIN);
        //             this.changeState(SwordStates.DEAD);
        //         }

        //         else if(this.currentState == this.stateMap.get(SwordStates.WALK))
        //             this.changeState(SwordStates.DAMAGED);
                
		// 		break;
		// 	}
        //     case SwordEvents.SWORD_DEAD: {
        //         this.changeState(SwordStates.DEAD);
        //         break;
        //     }
		// }
	}

    public update(deltaT: number): void {
		super.update(deltaT);
	}
}