import DemonSummoningCircleState from "./DemonSummoningCircleState";
import { DemonSummoningCircleAnimation, DemonSummoningCircleStates } from "../DemonSummoningCircleBehavior";
import { DemonSummoningCircleEvents } from "../DemonSummoningCircleEvents";

export default class Despawn extends DemonSummoningCircleState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DemonSummoningCircleAnimation.DESPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (!this.owner.animation.isPlaying(DemonSummoningCircleAnimation.DESPAWN)) {
            this.emitter.fireEvent(DemonSummoningCircleEvents.DESPAWN_CIRCLE, {id: this.owner.id});
			this.finished(DemonSummoningCircleStates.INACTIVE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}