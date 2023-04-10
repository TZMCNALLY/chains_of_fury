import { MoonDogAnimation } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";

export default class Damaged extends MoonDogState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.TAKINGDAMAGE_LEFT);
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