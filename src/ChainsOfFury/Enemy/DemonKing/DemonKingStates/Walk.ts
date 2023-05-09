import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import CreateDeathCircles from './CreateDeathCircles';

export default class Walk extends DemonKingState {

	public onEnter(options: Record<string, any>): void {

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT, true)

        else
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT, true)
	}

	public update(deltaT: number): void {

        this.checkToFinish();

		// Walk to where the player is
        this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
        this.parent.velocity.x *= 100;
        this.parent.velocity.y *= 100;

        // Adjust animation to which way its walking towards the player
        if(this.owner.position.x < this.parent.player.position.x) {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT, true)
            this.parent.lastFace = 1
        }

        else {
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT, true)
            this.parent.lastFace = -1
        }

        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

    // Checks if the sword is done walking and should do different action
    private checkToFinish() {
        const currentTime = new Date();
        if(currentTime.getTime() - this.parent.walkTime.getTime() > 2000){

            let distance = this.parent.getDistanceFromPlayer()

			if(distance < 50)
				this.finished(DemonKingStates.SWIPE);

			else {

                let rand = RandUtils.randInt(1,5)

                if(rand == 1)
                    this.finished(DemonKingStates.LIGHTNING_STRIKE);

                else if(rand == 2  && this.parent.numSkulls == 0)
                    this.finished(DemonKingStates.SPAWN_SKULLS);

                else if(rand == 3 && this.parent.numSkulls > 0)
                    this.finished(DemonKingStates.EXPAND_SKULL_SHIELD);

                else if(rand == 4)
                    this.finished(DemonKingStates.SPAWN_DEATH_CIRCLES);
            }
        }
    }
}