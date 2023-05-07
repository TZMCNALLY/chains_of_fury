import DemonSummoningCircleState from "./DemonSummoningCircleState";
import { DemonSummoningCircleAnimation } from "../DemonSummoningCircleBehavior";
import { DemonSummoningCircleEvents } from "../DemonSummoningCircleEvents";

export default class Spawn extends DemonSummoningCircleState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DemonSummoningCircleAnimation.SPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(DemonSummoningCircleAnimation.SPAWN)) {
			this.emitter.fireEvent(DemonSummoningCircleEvents.SUMMON_SHADOW_DEMON, {location: this.parent.location});
			this.finished(DemonSummoningCircleAnimation.DESPAWN);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}