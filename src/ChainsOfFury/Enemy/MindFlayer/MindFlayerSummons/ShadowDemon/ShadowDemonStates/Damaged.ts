import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonAnimation } from "../ShadowDemonController";
import { ShadowDemonStates } from "../ShadowDemonController";

export default class Damaged extends ShadowDemonState {

	public onEnter(options: Record<string, any>): void {
		let direction = this.owner.position.dirTo(this.parent.player.position);
		if (direction.x < 0)
        	this.owner.animation.play(ShadowDemonAnimation.DAMAGED_RIGHT);
		else
			this.owner.animation.play(ShadowDemonAnimation.DAMAGED_LEFT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ShadowDemonAnimation.DAMAGED_RIGHT) &&
		!this.owner.animation.isPlaying(ShadowDemonAnimation.DAMAGED_LEFT))
			this.finished(ShadowDemonStates.IDLE);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}