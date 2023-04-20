import { MindFlayerAnimation } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";

export default class Damaged extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.TAKINGDAMAGE_LEFT);
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