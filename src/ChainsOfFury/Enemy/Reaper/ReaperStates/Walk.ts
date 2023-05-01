import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Idle from "./Idle";
import ReaperState from "./ReaperState";
import { ReaperAnimation, ReaperStates } from "../ReaperController";

export default class Walk extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        this.parent.speed = 120;
		if (this.parent.getXDistanceFromPlayer() > 0)
        	this.owner.animation.play(ReaperAnimation.WALK_LEFT);
		else
        	this.owner.animation.play(ReaperAnimation.WALK_RIGHT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		// Set appropriate player direction
		if (this.parent.getXDistanceFromPlayer() < 0) {
			this.faceXDir = 1;
			this.owner.animation.playIfNotAlready(ReaperAnimation.WALK_RIGHT);
		} else {
			this.faceXDir = -1;
			this.owner.animation.playIfNotAlready(ReaperAnimation.WALK_LEFT);
		}
		if (this.parent.getYDistanceFromPlayer() < 0) {
        	this.faceYDir = 1;
		} else {
			this.faceYDir = -1;
		}

		// Move reaper towards player
        this.owner.move(new Vec2(this.faceXDir, this.faceYDir).scale(this.parent.speed).scale(deltaT));

		if (this.parent.getDistanceFromPlayer() < 50) {
			this.finished(ReaperStates.ATTACK);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}