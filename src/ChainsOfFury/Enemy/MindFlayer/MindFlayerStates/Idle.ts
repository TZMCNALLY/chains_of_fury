import { MindFlayerAnimation } from "../MindFlayerController";
import { MindFlayerStates }from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Idle extends MindFlayerState {

	protected lastActionTime: number = -1;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.IDLE);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}