import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonAnimation, ShadowDemonStates } from "../ShadowDemonController";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

export default class Walk extends ShadowDemonState {

	public onEnter(options: Record<string, any>): void {
        this.parent.speed = 50;
		if (this.parent.getXDistanceFromPlayer() > 0)
        	this.owner.animation.play(ShadowDemonAnimation.WALK_LEFT);
		else
        	this.owner.animation.play(ShadowDemonAnimation.WALK_RIGHT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		// Set appropriate player direction
		if (this.parent.getXDistanceFromPlayer() < 0) {
			this.faceXDir = 1
			this.owner.animation.playIfNotAlready(ShadowDemonAnimation.WALK_RIGHT);
		} else {
			this.faceXDir = -1
			this.owner.animation.playIfNotAlready(ShadowDemonAnimation.WALK_LEFT);
		}
		if (this.parent.getYDistanceFromPlayer() < 0) {
        	this.faceYDir = 1
		} else {
			this.faceYDir = -1
		}

		// Move mind flayer towards player
        this.owner.move(new Vec2(this.faceXDir, this.faceYDir).scale(this.parent.speed).scale(deltaT));
		
		// Check to see whether distance is too close
		// Check to see whether distance is too close
		if (this.parent.getDistanceFromPlayer() > 200) {
			this.finished(ShadowDemonStates.IDLE)
		}
		else if (this.parent.getDistanceFromPlayer() < 40) {
			this.finished(ShadowDemonStates.ATTACK)
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}