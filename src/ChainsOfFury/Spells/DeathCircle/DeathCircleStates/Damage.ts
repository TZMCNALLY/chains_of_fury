import DeathCircleState from "./DeathCircleState";
import { DeathCircleAnimation } from "../DeathCircleBehavior";
import { DeathCircleStates } from "../DeathCircleBehavior";
import { DeathCircleEvents } from "../DeathCircleEvents";

export default class Damage extends DeathCircleState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DeathCircleAnimation.DAMAGE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.owner.animation.isPlaying(DeathCircleAnimation.DAMAGE)) {
			this.emitter.fireEvent(DeathCircleEvents.CIRCLE_ACTIVE, {shape: this.owner.collisionShape});
		}
        else {
            this.finished(DeathCircleStates.DESPAWN);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}