import { DarkStalkerAnimations } from "../DarkStalkerController";
import DarkStalkerState from "./DarkStalkerState";

export default class Idle extends DarkStalkerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.IDLE);
	}

	public update(deltaT: number): void {
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}