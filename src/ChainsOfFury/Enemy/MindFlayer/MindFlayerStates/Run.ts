import { MindFlayerAnimation } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";

export default class Run extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.parent.speed = 10;
        this.owner.animation.play(MindFlayerAnimation.RUN_LEFT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}