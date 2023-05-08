import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import ReaperState from "./ReaperState";
import { ReaperAnimation, ReaperStates } from "../ReaperController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Idle extends ReaperState {

	public onEnter(options: Record<string, any>): void {
		if (this.parent.health < 500) {
			this.parent.berserkState = true;
		}
        this.owner.animation.play(ReaperAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		const currentTime = new Date();
		let timeSinceLastAction = currentTime.getTime() - this.parent.lastActionTime.getTime();

		if (this.parent.getDistanceFromPlayer() < 50) {
			this.finished(ReaperStates.ATTACK);
		}
		else if (timeSinceLastAction > 5000) {
			if (this.parent.player.position.x > 460 &&
				this.parent.player.position.x < 800) {
				if (this.parent.player.position.x < 630) {
					this.owner.position.copy(new Vec2(940, 485));
					this.parent.lastFace = -1;
				}
				else {
					this.owner.position.copy(new Vec2(320, 485));
					this.parent.lastFace = 1;
				}
				this.finished(ReaperStates.THROW_SLASHES);
			}
			else {
				this.finished(ReaperStates.SPAWN_DEATH_CIRCLES);
			}
		}
		else if (this.parent.getDistanceFromPlayer() > 10) {
			this.finished(ReaperStates.WALK);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}