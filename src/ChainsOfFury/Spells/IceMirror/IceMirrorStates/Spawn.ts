import { IceMirrorAnimation } from "../IceMirrorBehavior";
import IceMirrorState from "./IceMirrorState";
import { IceMirrorEvents } from "../IceMirrorEvents";
import { IceMirrorStates } from "../IceMirrorBehavior";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import COFLevel3 from "../../../Scenes/COFLevel3";

export default class Spawn extends IceMirrorState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(IceMirrorAnimation.SPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(IceMirrorAnimation.SPAWN)) {
			this.emitter.fireEvent(IceMirrorEvents.SPAWN_SNOWBALL, {location: this.parent.location});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel3.FIRE_SNOWBALL_KEY});
			this.finished(IceMirrorStates.DESPAWN);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}