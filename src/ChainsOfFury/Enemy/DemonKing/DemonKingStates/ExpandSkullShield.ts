import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DemonKingEvents } from "../DemonKingEvents";

export default class ExpandSkullShield extends DemonKingState {

	public onEnter(options: Record<string, any>): void {

        this.owner.animation.playIfNotAlready(DemonKingAnimations.DANCING, true, null);
        this.emitter.fireEvent(DemonKingEvents.SKULLS_EXPANDED);
    }

	public update(deltaT: number): void {
        if(!this.owner.animation.isPlaying(DemonKingAnimations.DANCING))
            this.finished(DemonKingStates.WALK)
    }

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}