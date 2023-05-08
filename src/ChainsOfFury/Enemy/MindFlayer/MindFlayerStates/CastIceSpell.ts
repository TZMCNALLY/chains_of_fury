import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { MindFlayerEvents } from "../MindFlayerEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class CastIceSpell extends MindFlayerState {
	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(MindFlayerAnimation.CAST_ICE_SPELL);
		let location = new Vec2(this.owner.position.x, this.owner.position.y)
		if (this.parent.getXDistanceFromPlayer() < 0) {
			location.x += 50;
		}
		else {
			location.x -= 50;
		}
		this.emitter.fireEvent(MindFlayerEvents.MIND_FLAYER_SPAWN_ICE_MIRROR, {location: location});
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.IDLE);
		}
		else if (!this.owner.animation.isPlaying(MindFlayerAnimation.CAST_ICE_SPELL)) {
			this.parent.lastActionTime = new Date();
			this.finished(MindFlayerStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}