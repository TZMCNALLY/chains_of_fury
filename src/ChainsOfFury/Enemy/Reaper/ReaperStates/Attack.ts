import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";

export default class Attack extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        if (this.parent.getXDistanceFromPlayer() < 0) {
            this.owner.animation.play(ReaperAnimation.ATTACKING_RIGHT);
        }
        else {
            this.owner.animation.play(ReaperAnimation.ATTACKING_LEFT);
        }
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 50) {
			this.finished(ReaperStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}