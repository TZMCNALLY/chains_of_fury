import { DemonKingAnimation } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Idle extends DemonKingState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DemonKingAnimation.IDLE_LEFT, true, null);
	}

	public update(deltaT: number): void {
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}