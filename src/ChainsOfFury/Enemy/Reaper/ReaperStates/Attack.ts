import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";
import { ReaperEvents } from "../ReaperEvents";

export default class Attack extends ReaperState {

	public onEnter(options: Record<string, any>): void {
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 50) {
			this.finished(ReaperStates.IDLE);
		}
		else if (!this.owner.animation.isPlaying(ReaperAnimation.ATTACKING_LEFT) && 
        !this.owner.animation.isPlaying(ReaperAnimation.ATTACKING_RIGHT)) {
            if (this.parent.getXDistanceFromPlayer() < 0) {
                this.emitter.fireEvent(ReaperEvents.REAPER_SWIPE, {direction: 1});
                this.owner.animation.play(ReaperAnimation.ATTACKING_RIGHT, false);
            }
            else {
                this.emitter.fireEvent(ReaperEvents.REAPER_SWIPE, {direction: -1});
                this.owner.animation.play(ReaperAnimation.ATTACKING_LEFT, false);
            }
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}