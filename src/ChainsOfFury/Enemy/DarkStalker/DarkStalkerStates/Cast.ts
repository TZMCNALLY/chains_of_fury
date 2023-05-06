import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { COFEvents } from "../../../COFEvents";
import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import DarkStalkerState from "./DarkStalkerState";

export default class Cast extends DarkStalkerState {

	/**
	 * The first stage of the dark stalker, cycles between attacks and just walks around.
	 */

	private castingTime: number;
    private updateThis: boolean;

	public onEnter(options: Record<string, any>): void {
        // this.owner.animation.play(DarkStalkerAnimations.RUN_LEFT);

		this.castingTime = 2;
        this.updateThis = true;
	}

	public update(deltaT: number): void {
		super.update(deltaT);


		/**
		 * Simply walks for a few seconds before going back a decision making state.
		 */
        if (!this.updateThis) {
            return;
        }

		if (this.castingTime > 0) {
			this.castingTime -= deltaT;

            // TODO: Play casting animation
            this.owner.animation.playIfNotAlready(DarkStalkerAnimations.IDLE);
		} else {
            this.emitter.fireEvent(DarkStalkerEvents.CAST);
            let switchStateTimer = new Timer(1000, () => {
			    this.finished(DarkStalkerStates.WALK);
            });
            switchStateTimer.start();
            this.updateThis = false;
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}