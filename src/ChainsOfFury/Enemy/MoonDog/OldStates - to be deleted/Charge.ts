import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import { COFEvents } from "../../../COFEvents";

export default class Charge extends MoonDogState {

	protected _target_location: Vec2;

	public onEnter(options: Record<string, any>): void {

		this._target_location = this.parent.player.position.clone();
		if (this._target_location.x < this.owner.position.x)
			this.owner.animation.play(MoonDogAnimation.CHARGE_LEFT);
		else
			this.owner.animation.play(MoonDogAnimation.CHARGE_RIGHT);
		
		this.parent.speed = 10;

		this.owner.setGroup(COFPhysicsGroups.ENEMY_CONTACT_DMG);
		// this.owner.setTrigger(COFPhysicsGroups.WALL, COFEvents.ENEMY_STUNNED, null);
		
		this.parent.velocity = new Vec2(1,1);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this.parent.stunned) {
			this.finished(MoonDogStates.STUNNED);
			return;
		}

		if (this.owner.position.distanceTo(this._target_location) < 10) {
			this.finished(MoonDogStates.IDLE);
			return;
		}

		let dir: Vec2 = (this._target_location.clone().sub(this.owner.position)).normalized();
		this.parent.velocity = dir.scale(this.parent.speed).clone();

		this.owner.move(this.parent.velocity.clone());
	}


	public onExit(): Record<string, any> {
		this.owner.animation.stop();

		this.owner.setGroup(COFPhysicsGroups.ENEMY);
		return {};
	}
}