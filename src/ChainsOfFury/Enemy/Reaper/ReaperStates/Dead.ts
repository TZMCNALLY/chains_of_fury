import { COFEvents } from "../../../COFEvents";
import ReaperState from "./ReaperState";
import { ReaperAnimation } from "../ReaperController";

export default class Dead extends ReaperState {

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(ReaperAnimation.DYING, false, "");
        this.owner.animation.queue(ReaperAnimation.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.DYING) && 
        !this.owner.animation.isPlaying(ReaperAnimation.DEAD)) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}