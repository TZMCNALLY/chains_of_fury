import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { MoonDogEvents } from "../MoonDogEvents";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Summon extends MoonDogState {

    private stateTime: number;
    private animationPlayed: boolean;

	public onEnter(options: Record<string, any>): void {
        this.stateTime = 4;
        this.animationPlayed = false;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        if (this.stateTime > 0) {
            this.stateTime -= deltaT;

            if (!this.animationPlayed) {
                this.owner.animation.play(MoonDogAnimation.SUMMON, false, MoonDogEvents.SUMMON);
                this.owner.animation.queue(MoonDogAnimation.IDLE);
                this.animationPlayed = true;
            }
        } else {
            this.finished(MoonDogStates.IDLE);
        }

        // Nothing to update.
	}


	public onExit(): Record<string, any> {
        this.owner.animation.stop();

		return {};
	}
}