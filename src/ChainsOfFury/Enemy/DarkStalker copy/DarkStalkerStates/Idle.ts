import { COFEvents } from "../../../COFEvents";
import { DarkStalkerAnimations } from "../DarkStalkerController";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import DarkStalkerState from "./DarkStalkerState";

export default class Idle extends DarkStalkerState {

	private testCooldown: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.IDLE);

		this.testCooldown = 2;
	}

	public update(deltaT: number): void {

		if (this.testCooldown > 0) {
			this.testCooldown -= deltaT;
		} else {
			// Perform test action
			this.emitter.fireEvent(DarkStalkerEvents.FIRE_MISSLE);

			this.testCooldown = 2;
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}