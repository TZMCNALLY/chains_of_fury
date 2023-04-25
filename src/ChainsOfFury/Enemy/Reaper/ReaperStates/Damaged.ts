import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";

export default class Damaged extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ReaperAnimation.TAKING_DAMAGE_LEFT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.TAKING_DAMAGE_LEFT)) {
			this.finished(ReaperStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}