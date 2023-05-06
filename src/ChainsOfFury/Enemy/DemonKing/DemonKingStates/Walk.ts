import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Walk extends DemonKingState {

	public onEnter(options: Record<string, any>): void {

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT, true)

        else
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT, true)
        
	}

	public update(deltaT: number): void {

        // this.checkToFinish();

		// Walk to where the player is
        this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
        this.parent.velocity.x *= 20;
        this.parent.velocity.y *= 20;

        // Adjust animation to which way its walking towards the player
        if(this.owner.position.x < this.parent.player.position.x) {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT)
            this.parent.lastFace = 1
        }

        else {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT)
            this.parent.lastFace = -1
        }

        this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

    // Checks if the sword is done walking and should do different action
    // private checkToFinish() {
    //     const currentTime = new Date();
    //     if(currentTime.getTime() - this.parent.walkTime.getTime() > 2000){

    //         let distance = this.parent.getDistanceFromPlayer()

    //         if(this.parent.health <= this.parent.maxHealth/2 && (this.owner.getScene() as COFLevel5).assistExists == false)
    //             this.finished(SwordStates.SUMMON)

	// 		else if(distance < 120)
	// 			this.finished(SwordStates.TORNADO);

	// 		else {
    //             if(RandUtils.randInt(1,4) == 1)
    //                 this.finished(SwordStates.FRENZY);

    //             else
    //                 this.finished(SwordStates.BASIC_ATTACK);
    //         }
    //     }
    // }
}