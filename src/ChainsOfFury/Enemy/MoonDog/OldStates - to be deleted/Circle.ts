import { MoonDogAnimation } from "../MoonDogController";
import { MoonDogStates }from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Circle extends MoonDogState {

	protected lastActionTime: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.IDLE); // TODO: Change this.

		this.lastActionTime = 2; // How many seconds it takes until it goes into new state.
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        // Calculate new point for enemy to move to

        // If distrance is large. Go faster

        // Determien next action.
		if (this.lastActionTime < deltaT) {
			let rnd = RandUtils.randInt(1, 101);

			if (this.parent.health > 100) {
				// Stage 2

				if (rnd < 21) {
					// 20% chance to try to use magic attack.
				}
			} else {
				// Final stage
				
				// Enter the circled state.
				// Rest of boss behavior defined there.
				// this.finished(MoonDogStates.CIRCLE);

			}
		} else {
			// Reduce time until next action.
			this.lastActionTime -= deltaT;
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}