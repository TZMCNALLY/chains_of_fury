import { ShadowDemonAnimation } from "../ShadowDemonController";
import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonStates } from "../ShadowDemonController";
import { ShadowDemonEvents } from "../ShadowDemonEvents";

export default class Attack extends ShadowDemonState {

	public onEnter(options: Record<string, any>): void {
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 40) {
			this.finished(ShadowDemonStates.IDLE);
		}
		else if (!this.owner.animation.isPlaying(ShadowDemonAnimation.ATTACK_LEFT) && 
        !this.owner.animation.isPlaying(ShadowDemonAnimation.ATTACK_RIGHT)) {
            if (this.parent.getXDistanceFromPlayer() < 0)
                this.owner.animation.playIfNotAlready(ShadowDemonAnimation.ATTACK_RIGHT, true);
            else
                this.owner.animation.playIfNotAlready(ShadowDemonAnimation.ATTACK_LEFT, true);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}