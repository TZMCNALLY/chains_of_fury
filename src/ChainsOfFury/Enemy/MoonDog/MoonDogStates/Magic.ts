import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { MoonDogEvents } from "../MoonDogEvents";

export default class Magic extends MoonDogState {

    protected _stateTime: number; // How long does this take.

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.PREPARING_MAGIC, false, MoonDogEvents.MAGIC);
		this.owner.tweens.play("invul");
        this.owner.animation.queue(MoonDogAnimation.MAGIC, true);

        this._stateTime = 10; // 10 seconds in this state?
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this._stateTime > 0) {
			this._stateTime -= deltaT;
		} else {
			this.owner.alpha = 1;
			this.finished(MoonDogStates.IDLE);
		}

        // Literally do nothing except decrement time.
	}


	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}