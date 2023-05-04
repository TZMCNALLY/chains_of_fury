import DeathCircleState from "./DeathCircleState";
import { DeathCircleAnimation } from "../DeathCircleBehavior";
import { DeathCircleEvents } from "../DeathCircleEvents";

export default class Inactive extends DeathCircleState {

	public onEnter(options: Record<string, any>): void {
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}