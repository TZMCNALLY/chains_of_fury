import { MoonDogAnimation } from "../MoonDogController";
import MoonDogState from "./MoonDogState";

export default class Run extends MoonDogState {

	public onEnter(options: Record<string, any>): void {
        this.parent.speed = 10;
        this.owner.animation.play(MoonDogAnimation.RUN_LEFT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}