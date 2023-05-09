import { AssistAnimations } from "../AssistController";
import AssistState from "./AssistState";
import AssistController from "../AssistController";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends AssistState {

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(AssistAnimations.DYING, false, null);
        this.owner.animation.queue(AssistAnimations.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		if (!this.owner.animation.isPlaying(AssistAnimations.DYING) && 
        !this.owner.animation.isPlaying(AssistAnimations.DEAD)) {
			this.owner.alpha = 0;
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}