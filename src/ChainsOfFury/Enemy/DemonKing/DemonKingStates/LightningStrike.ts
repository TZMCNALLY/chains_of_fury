import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DemonKingEvents } from "./DemonKingEvents";

export default class Idle extends DemonKingState {

    protected numStrikes: number;

	public onEnter(options: Record<string, any>): void {
        
        this.numStrikes = 0;
	}

	public update(deltaT: number): void {

        if(!this.owner.animation.isPlaying(DemonKingAnimations.DANCING)) {

            if(this.numStrikes == 4) {

                this.finished(DemonKingStates.WALK)
            }

            else {

                this.owner.animation.play(DemonKingAnimations.DANCING);
                this.emitter.fireEvent(DemonKingEvents.STRUCK_LIGHTNING);
            }
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}