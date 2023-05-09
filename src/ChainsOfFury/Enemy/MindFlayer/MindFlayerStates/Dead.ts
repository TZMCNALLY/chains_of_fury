import { MindFlayerAnimation } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends MindFlayerState {

	protected isDead: boolean;

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(MindFlayerAnimation.DYING, false, "");
        this.owner.animation.queue(MindFlayerAnimation.DEAD);
		this.isDead = false;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.DYING) && 
        !this.owner.animation.isPlaying(MindFlayerAnimation.DEAD)
		&& !this.isDead) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
			this.isDead = true;
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}