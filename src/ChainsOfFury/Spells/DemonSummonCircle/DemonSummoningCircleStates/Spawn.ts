import DemonSummoningCircleState from "./DemonSummoningCircleState";
import { DemonSummoningCircleAnimation } from "../DemonSummoningCircleBehavior";
import { DemonSummoningCircleEvents } from "../DemonSummoningCircleEvents";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import COFLevel3 from "../../../Scenes/COFLevel3";

export default class Spawn extends DemonSummoningCircleState {

	public onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel3.SUMMON_DEMON_KEY});
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