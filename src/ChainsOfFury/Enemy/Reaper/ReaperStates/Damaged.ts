import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";

export default class Damaged extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        if (this.parent.getXDistanceFromPlayer() < 0) {
            this.owner.animation.play(ReaperAnimation.TAKING_DAMAGE_RIGHT);
        }
        else {
            this.owner.animation.play(ReaperAnimation.TAKING_DAMAGE_LEFT);
        }
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.TAKING_DAMAGE_LEFT) &&
		!this.owner.animation.isPlaying(ReaperAnimation.TAKING_DAMAGE_RIGHT)) {
			this.finished(ReaperStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}