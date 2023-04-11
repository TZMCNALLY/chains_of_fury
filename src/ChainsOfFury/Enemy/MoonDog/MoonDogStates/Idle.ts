import { MoonDogAnimation } from "../MoonDogController";
import { MoonDogStates }from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Idle extends MoonDogState {

	protected lastActionTime: number = -1;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.IDLE);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this.lastActionTime == -1) {
			this.lastActionTime = new Date().getTime() / 1000;
		}

		if (new Date().getTime() / 1000 - this.lastActionTime > 1) {
			this.lastActionTime = new Date().getTime() / 1000;

			if (RandUtils.randInt(1, 101) < 51) {
				// 50% chance to start charging.
				this.finished(MoonDogStates.CHARGE);
			}
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}