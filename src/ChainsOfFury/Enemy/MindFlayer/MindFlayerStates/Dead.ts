import { MindFlayerAnimation } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(MindFlayerAnimation.DYING, false, "");
        this.owner.animation.queue(MindFlayerAnimation.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.DYING) && 
        !this.owner.animation.isPlaying(MindFlayerAnimation.DEAD)) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}