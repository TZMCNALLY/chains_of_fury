import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Walk extends DemonKingState {

	public onEnter(options: Record<string, any>): void {

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT)

        else
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT)
        
	}

	public update(deltaT: number): void {

		// Walk to where the player is
        this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
        this.parent.velocity.x *= 20;
        this.parent.velocity.y *= 20;

        // Adjust animation to which way its walking towards the player
        if(this.owner.position.x < this.parent.player.position.x) {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT)
            this.parent.lastFace = 1
        }

        else {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT)
            this.parent.lastFace = -1
        }

        this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}