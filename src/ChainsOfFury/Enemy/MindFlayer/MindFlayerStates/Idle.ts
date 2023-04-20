import { MindFlayerAnimation } from "../MindFlayerController";
import { MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { MoonDogStates } from "../../MoonDog/MoonDogController";

export default class Idle extends MindFlayerState {

	protected lastActionTime: Date = new Date();

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		const currentTime = new Date();
		let timeSinceLastAction = currentTime.getTime() - this.lastActionTime.getTime();

		// Walk closer to target, if too far
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.WALK)
		}

		// // If target is too close, teleport away to a safe distance
		// if (this.parent.getDistanceFromPlayer() < 100 && timeSinceLastAction > 5000) {
		// 	this.finished(MindFlayerStates.TELEPORT)
		// }

		// if (timeSinceLastAction > 5000) {
		// 	this.lastActionTime = new Date()
		// }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}