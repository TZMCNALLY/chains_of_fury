import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DemonKingEvents } from "../DemonKingEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class ThrowSkulls extends DemonKingState {

	public onEnter(options: Record<string, any>): void {
        
        this.owner.animation.playIfNotAlready(DemonKingAnimations.DANCING)

        this.emitter.fireEvent(DemonKingEvents.SKULLS_SPAWN, {location: this.owner.position});
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