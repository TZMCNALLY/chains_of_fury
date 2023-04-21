import { MindFlayerAnimation } from "../MindFlayerController";
import { MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Idle from "./Idle";

export default class Walk extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.parent.speed = 10;
		if (this.parent.getXDistanceFromPlayer() > 0)
        	this.owner.animation.play(MindFlayerAnimation.WALK_LEFT);
		else
        	this.owner.animation.play(MindFlayerAnimation.WALK_RIGHT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		// Set appropriate player direction
		if (this.parent.getXDistanceFromPlayer() < 0) {
			this.faceXDir = 1
			this.owner.animation.playIfNotAlready(MindFlayerAnimation.WALK_RIGHT);
		} else {
			this.faceXDir = -1
			this.owner.animation.playIfNotAlready(MindFlayerAnimation.WALK_LEFT);
		}
		if (this.parent.getYDistanceFromPlayer() < 0) {
        	this.faceYDir = 1
		} else {
			this.faceYDir = -1
		}

		// Move mind flayer towards player
        this.owner.move(new Vec2(this.faceXDir, this.faceYDir).scale(this.parent.speed).scale(deltaT));
		
		// Check to see whether distance is too close
		if (this.parent.getDistanceFromPlayer() < 500) {
			this.finished(MindFlayerStates.IDLE)
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}