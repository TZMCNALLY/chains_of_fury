import { MindFlayerAnimation } from "../MindFlayerController";
import { MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { MoonDogStates } from "../../MoonDog/MoonDogController";

export default class Idle extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		const currentTime = new Date();
		let timeSinceLastAction = currentTime.getTime() - this.parent.lastActionTime.getTime();

		// Walk closer to target, if too far
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.WALK);
		}
		// If target is too close, teleport away to a safe distance
		else if (this.parent.getDistanceFromPlayer() < 200 && timeSinceLastAction > 3000) {
			this.finished(MindFlayerStates.TELEPORT);
		}
		else if (this.parent.health < 1500 && this.parent.health > 500 && Math.random() > 0.5) {
			this.finished(MindFlayerStates.HEALING);
		}
		// otherwise, spawn shadow demons or shoot fireballs
		else if (timeSinceLastAction > 3000) {
			if (this.parent.shadowDemonCount < this.parent.maxShadowDemonCount-1) {
				this.finished(MindFlayerStates.SPAWN_SHADOW_DEMONS);
			}
			else {
				this.finished(MindFlayerStates.CAST_FIREBALLS);
			}
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}