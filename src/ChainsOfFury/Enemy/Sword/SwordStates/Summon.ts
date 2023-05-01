import { SwordAnimations } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { SwordEvents } from "../SwordEvents";

export default class Summon extends SwordState {

    protected numDances: number

	public onEnter(options: Record<string, any>): void {

        this.numDances = 1;
        this.owner.animation.playIfNotAlready(SwordAnimations.DANCE);
	}

	public update(deltaT: number): void {

        if(this.numDances == 3) {
            this.emitter.fireEvent(SwordEvents.MINION_SUMMONED);
            this.finished(SwordStates.WALK)
        }

        else if(!this.owner.animation.isPlaying(SwordAnimations.DANCE)) {
            this.numDances++;
            this.owner.animation.playIfNotAlready(SwordAnimations.DANCE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}