import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";

export default class Walk extends DemonKingState {

    

	public onEnter(options: Record<string, any>): void {

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_LEFT)

        else
            this.owner.animation.playIfNotAlready(DemonKingAnimations.WALKING_RIGHT)
        
	}

	public update(deltaT: number): void {


	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}