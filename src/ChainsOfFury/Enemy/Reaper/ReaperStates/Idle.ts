import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import ReaperState from "./ReaperState";
import { ReaperAnimation, ReaperStates } from "../ReaperController";

export default class Idle extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ReaperAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getDistanceFromPlayer() < 50) {
			this.finished(ReaperStates.ATTACK);
		}
		else if (this.parent.getDistanceFromPlayer() > 0) {
			this.finished(ReaperStates.WALK);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}