import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { MindFlayerEvents } from "../MindFlayerEvents";
import COFLevel from "../../../Scenes/COFLevel";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class CastFireballs extends MindFlayerState {

	// number of fireballs to fire
	protected fireballsToFire : number;
	protected playFireballSound: boolean;

	public onEnter(options: Record<string, any>): void {
		this.fireballsToFire = 5;
		this.playFireballSound = false;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.IDLE);
		}
		else if (!this.owner.animation.isPlaying(MindFlayerAnimation.CAST_FIREBALLS) && this.fireballsToFire > 0) {
			if (this.playFireballSound) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.FIREBALL_THROWN_KEY});
				this.playFireballSound = false;
			}

			let direction = this.owner.position.dirTo(this.parent.player.position)
			if (direction.x > 0)
				this.owner.invertX = true;
			else
				this.owner.invertX = false;
			this.owner.animation.play(MindFlayerAnimation.CAST_FIREBALLS, false, MindFlayerEvents.MIND_FLAYER_FIRE_FIREBALL, {faceDir: direction})
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.FIREBALL_THROWN_KEY});
			this
			this.fireballsToFire--;
		}
		else if (!this.owner.animation.isPlaying(MindFlayerAnimation.CAST_FIREBALLS) && this.fireballsToFire === 0) {
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.FIREBALL_THROWN_KEY});
			this.parent.lastActionTime = new Date();
			this.finished(MindFlayerStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}