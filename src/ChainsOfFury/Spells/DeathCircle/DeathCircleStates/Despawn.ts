import DeathCircleState from "./DeathCircleState";
import { DeathCircleAnimation } from "../DeathCircleBehavior";
import { DeathCircleEvents } from "../DeathCircleEvents";
import { DeathCircleStates } from "../DeathCircleBehavior";

export default class Despawn extends DeathCircleState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DeathCircleAnimation.DESPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (!this.owner.animation.isPlaying(DeathCircleAnimation.DESPAWN)) {
            this.emitter.fireEvent(DeathCircleEvents.DESPAWN_CIRCLE, {id: this.owner.id});
			this.finished(DeathCircleStates.INACTIVE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}