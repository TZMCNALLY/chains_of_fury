import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";

export default class Damaged extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.TAKING_DAMAGE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.TAKING_DAMAGE)) {
			this.finished(MindFlayerStates.TELEPORT);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}