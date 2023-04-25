import { ShadowDemonAnimation, ShadowDemonStates } from "../ShadowDemonController";
import ShadowDemonState from "./ShadowDemonState";

export default class Idle extends ShadowDemonState {

	protected lastActionTime : Date;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ShadowDemonAnimation.IDLE, true);
		this.lastActionTime = new Date();
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		const currentTime = new Date();
		let timeSinceLastAction = currentTime.getTime() - this.lastActionTime.getTime();

		// Walk closer to target, if too far
		if (this.parent.getDistanceFromPlayer() < 200) {
			this.finished(ShadowDemonStates.WALK);
		}

		if (timeSinceLastAction > 5000) {
			this.finished(ShadowDemonStates.CAST_FIREBALLS);
			this.lastActionTime = new Date();
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}