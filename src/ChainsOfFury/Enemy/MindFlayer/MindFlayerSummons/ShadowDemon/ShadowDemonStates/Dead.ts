import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonAnimation } from "../ShadowDemonController";
import { COFEvents } from "../../../../../COFEvents";

export default class Dead extends ShadowDemonState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ShadowDemonAnimation.DYING, false, null);
        this.owner.animation.queue(ShadowDemonAnimation.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ShadowDemonAnimation.DYING) && 
        !this.owner.animation.isPlaying(ShadowDemonAnimation.DEAD)) {
            this.emitter.fireEvent(COFEvents.MINION_DEAD, {id: this.owner.id});
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}