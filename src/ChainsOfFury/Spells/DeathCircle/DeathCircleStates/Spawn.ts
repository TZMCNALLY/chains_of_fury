import DeathCircleState from "./DeathCircleState";
import { DeathCircleAnimation } from "../DeathCircleBehavior";
import { DeathCircleStates } from "../DeathCircleBehavior";

export default class Spawn extends DeathCircleState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DeathCircleAnimation.SPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(DeathCircleAnimation.SPAWN)) {
			this.finished(DeathCircleStates.DAMAGE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}