import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import ReaperState from "./ReaperState";
import { ReaperAnimation } from "../ReaperController";

export default class Idle extends ReaperState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ReaperAnimation.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}