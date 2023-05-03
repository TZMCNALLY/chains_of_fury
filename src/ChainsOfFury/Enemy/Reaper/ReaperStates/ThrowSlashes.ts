import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";
import { ReaperEvents } from "../ReaperEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class ThrowSlashes extends ReaperState {

	protected slashesToThrow : number;
	protected locationOfSlashes : Vec2[];

	public onEnter(options: Record<string, any>): void {
        this.slashesToThrow = 5;
	
		if (this.parent.lastFace < 0) {
			// if (Math.random() > 0.5)
			// 	this.locationOfSlashes = [new Vec2(940, 400), new Vec2(940, 440), new Vec2(940, 480), new Vec2(940, 520), new Vec2(940, 560)]
			// else
			// 	this.locationOfSlashes = [new Vec2(940, 400), new Vec2(940, 440), new Vec2(940, 480), new Vec2(940, 520), new Vec2(940, 560)]
			this.locationOfSlashes = [new Vec2(940, 400), new Vec2(940, 440), new Vec2(940, 480), new Vec2(940, 520), new Vec2(940, 560)]
		}
		else {
			this.locationOfSlashes = [new Vec2(320, 400), new Vec2(320, 440), new Vec2(320, 480), new Vec2(320, 520), new Vec2(320, 560)]
		}
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.THROW_SLASHES_LEFT) &&
		!this.owner.animation.isPlaying(ReaperAnimation.THROW_SLASHES_RIGHT)) {
			if (this.slashesToThrow === 0) {
				this.finished(ReaperStates.IDLE);
			}
			this.slashesToThrow--;
			if (this.parent.lastFace < 0) {
				this.owner.animation.play(ReaperAnimation.THROW_SLASHES_LEFT);
			} else {
				this.owner.animation.play(ReaperAnimation.THROW_SLASHES_RIGHT);
			}
			this.reaperThrowSlash(this.locationOfSlashes[this.slashesToThrow], this.parent.lastFace, 70);
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