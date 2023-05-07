import { MindFlayerAnimation } from "../MindFlayerController";
import { MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";

export default class Idle extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
		if (this.parent.health < 500 && !this.parent.berserk) {
			this.parent.berserk = true;
		}
        this.owner.animation.play(MindFlayerAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		const currentTime = new Date();
		let timeSinceLastAction = currentTime.getTime() - this.parent.lastActionTime.getTime();

		// Walk closer to target, if too far
		if (this.parent.getDistanceFromPlayer() > 500) {
			this.finished(MindFlayerStates.WALK);
		}
		// If target is too close, teleport away to a safe distance
		else if (this.parent.getDistanceFromPlayer() < 200 && timeSinceLastAction > this.parent.actionDelay) {
			this.finished(MindFlayerStates.TELEPORT);
		}
		// otherwise, spawn shadow demons or shoot fireballs
		else if (timeSinceLastAction > this.parent.actionDelay) {
			if (this.parent.shadowDemonCount < this.parent.maxShadowDemonCount-2) {
				this.finished(MindFlayerStates.SPAWN_SHADOW_DEMONS);
			}
			else if (this.parent.health < 1500 && this.parent.health > 500 && Math.random() > 0.5) {
				this.finished(MindFlayerStates.HEALING);
			}
			else {
				this.finished(MindFlayerStates.CAST_FIREBALLS);
			}
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}