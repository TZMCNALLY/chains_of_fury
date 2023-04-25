import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { COFEvents } from "../../COFEvents";
import Idle from "./DemonKingStates/Idle"

export const DemonKingStates = {
    IDLE: "IDLE",
} as const

export const DemonKingAnimation = {
    IDLE_LEFT: "IDLE_LEFT"
} as const

export default class DemonKingController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(DemonKingStates.IDLE, new Idle(this, this.owner));
        this.initialize(DemonKingStates.IDLE);

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