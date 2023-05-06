import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import { MindFlayerEvents } from "../MindFlayerEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class CastFireballs extends MindFlayerState {

	// number of fireballs to fire
	protected fireballsToFire : number;

	public onEnter(options: Record<string, any>): void {
		this.fireballsToFire = 5;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.IDLE);
		}
		else if (!this.owner.animation.isPlaying(MindFlayerAnimation.CAST_FIREBALLS) && this.fireballsToFire > 0) {
			let direction = this.owner.position.dirTo(this.parent.player.position)
			if (direction.x > 0)
				this.owner.invertX = true;
			else
				this.owner.invertX = false;
			this.owner.animation.play(MindFlayerAnimation.CAST_FIREBALLS, false, MindFlayerEvents.MIND_FLAYER_FIRE_FIREBALL, {faceDir: direction})
			this.fireballsToFire--;
		}
		else if (!this.owner.animation.isPlaying(MindFlayerAnimation.CAST_FIREBALLS) && this.fireballsToFire === 0) {
			this.parent.lastActionTime = new Date();
			this.finished(MindFlayerStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}