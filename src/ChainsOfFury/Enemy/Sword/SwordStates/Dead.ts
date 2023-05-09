import { SwordAnimations } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends SwordState {

	protected isDead: boolean;

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(SwordAnimations.DYING, false, null);
        this.owner.animation.queue(SwordAnimations.DEAD);
		this.isDead = false
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		if (!this.owner.animation.isPlaying(SwordAnimations.DYING) && 
        !this.owner.animation.isPlaying(SwordAnimations.DEAD)
		&& !this.isDead) {
			this.owner.alpha = 0
			this.isDead = true;
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}