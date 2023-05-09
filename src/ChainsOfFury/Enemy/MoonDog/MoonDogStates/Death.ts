import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { MoonDogEvents } from "../MoonDogEvents";
import { COFEvents } from "../../../COFEvents";

export default class Death extends MoonDogState {

	protected isDead: boolean;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.DEATH);
		this.isDead = false;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if(!this.owner.animation.isPlaying(MoonDogAnimation.DEATH) &&  !this.isDead) {

			this.owner.alpha = 0;
			this.isDead = true;
			this.emitter.fireEvent(COFEvents.BOSS_DEFEATED)
		}

        // Literally do nothing except decrement time.
	}


	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}