import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";
import { ReaperEvents } from "../ReaperEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import COFLevel4 from "../../../Scenes/COFLevel4";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class ThrowSlashes extends ReaperState {

	protected slashesToThrow : number;
	protected locationOfSlashes : Vec2[];
	protected playSlashSound : boolean;

	public onEnter(options: Record<string, any>): void {
        this.slashesToThrow = 5;
		this.playSlashSound = false;

		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel4.DEATH_CIRCLE_KEY});
		if (this.parent.lastFace < 0) {
			if (this.parent.berserkState) {
				this.emitter.fireEvent(ReaperEvents.SPAWN_DEATH_CIRCLE, {location: new Vec2(270, 500), radius: 400})
			}
			else {
				this.emitter.fireEvent(ReaperEvents.SPAWN_DEATH_CIRCLE, {location: new Vec2(270, 500), radius: 330})
			}
			this.locationOfSlashes = [new Vec2(940, 280), new Vec2(940, 390), new Vec2(940, 500), new Vec2(940, 610), new Vec2(940, 720)]
		}
		else {
			if (this.parent.berserkState) {
				this.emitter.fireEvent(ReaperEvents.SPAWN_DEATH_CIRCLE, {location: new Vec2(990, 500), radius: 400})
			}
			else {
				this.emitter.fireEvent(ReaperEvents.SPAWN_DEATH_CIRCLE, {location: new Vec2(990, 500), radius: 330})
			}
			this.locationOfSlashes = [new Vec2(320, 280), new Vec2(320, 390), new Vec2(320, 500), new Vec2(320, 610), new Vec2(320, 720)]
		}
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.THROW_SLASHES_LEFT) &&
		!this.owner.animation.isPlaying(ReaperAnimation.THROW_SLASHES_RIGHT)) {
			if (this.playSlashSound) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel4.FIRE_SLASH_KEY});
				this.playSlashSound = false;
			}
			this.playSlashSound = true;

			if (this.parent.lastFace < 0) {
				this.owner.animation.play(ReaperAnimation.THROW_SLASHES_LEFT);
			} else {
				this.owner.animation.play(ReaperAnimation.THROW_SLASHES_RIGHT);
			}
			let index = Math.floor(Math.random() * this.locationOfSlashes.length);
			if (!this.parent.berserkState) {
				this.reaperThrowSlash(this.locationOfSlashes[index], this.parent.lastFace, 500);
			}
			else {
				this.reaperThrowSlash(this.locationOfSlashes[index], this.parent.lastFace, 700);
			}
			this.locationOfSlashes.splice(index, 1);
			this.slashesToThrow--;

			if (this.slashesToThrow === 0) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel4.FIRE_SLASH_KEY});
				this.parent.lastActionTime = new Date();
				this.finished(ReaperStates.IDLE);
			}
		}

		if (this.parent.getDistanceFromPlayer() > 450) {
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel4.FIRE_SLASH_KEY});
			this.parent.lastActionTime = new Date();
			this.finished(ReaperStates.IDLE);
		}
	}

	public reaperThrowSlash(spawn: Vec2, direction: number, speed: number) {
		this.emitter.fireEvent(ReaperEvents.THROW_SLASH, {spawn: spawn, direction: direction, speed: speed})
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}