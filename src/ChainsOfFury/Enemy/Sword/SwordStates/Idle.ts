import { SwordAnimation } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Idle extends SwordState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(SwordAnimation.IDLE);
	}

	public update(deltaT: number): void {
        this.finished(SwordStates.ATTACK)
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}