import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Charge extends MoonDogState {

	protected _target_location: Vec2;

	public onEnter(options: Record<string, any>): void {

		this._target_location = this.parent.player.position.clone();
		if (this._target_location.x < this.owner.position.x)
			this.owner.animation.play(MoonDogAnimation.CHARGE_LEFT);
		else
			this.owner.animation.play(MoonDogAnimation.CHARGE_RIGHT);
		
		this.parent.speed = 10;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		// console.log("curr dist");
		// console.log(this.owner.position.distanceTo(this._target_location));

		if (this.owner.position.distanceTo(this._target_location) < 10) {
			this.finished(MoonDogStates.IDLE);
		}

		let dir: Vec2 = (this._target_location.clone().sub(this.owner.position)).normalized();

		this.owner.move(dir.scale(this.parent.speed));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}