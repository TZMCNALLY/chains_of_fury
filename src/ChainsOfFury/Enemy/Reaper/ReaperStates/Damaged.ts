import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Damaged extends ReaperState {

	public onEnter(options: Record<string, any>): void {
		this.parent.hitCounter++;
        if (this.parent.getXDistanceFromPlayer() < 0) {
            this.owner.animation.play(ReaperAnimation.TAKING_DAMAGE_RIGHT);
        }
        else {
            this.owner.animation.play(ReaperAnimation.TAKING_DAMAGE_LEFT);
        }

		if (this.parent.hitCounter > 4) {
			this.parent.hitCounter = 0;
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
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ReaperAnimation.TAKING_DAMAGE_LEFT) &&
		!this.owner.animation.isPlaying(ReaperAnimation.TAKING_DAMAGE_RIGHT)) {
			this.finished(ReaperStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}