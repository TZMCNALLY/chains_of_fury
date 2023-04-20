import { MoonDogAnimation } from "../MoonDogController";
import { MoonDogStates }from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Idle extends MoonDogState {

	protected lastActionTime: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.IDLE);

		this.lastActionTime = 2; // How many seconds it takes until it goes into new state.
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this.lastActionTime < deltaT) {
			if (RandUtils.randInt(1, 101) < 51) {
				// 50% chance to start charging.
				this.finished(MoonDogStates.CHARGE);
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