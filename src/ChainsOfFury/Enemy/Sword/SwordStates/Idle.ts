import { SwordAnimation } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Idle extends SwordState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(SwordAnimation.IDLE, true, null);
	}

	public update(deltaT: number): void {
        this.finished(SwordStates.SPIN_ATTACK)
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}