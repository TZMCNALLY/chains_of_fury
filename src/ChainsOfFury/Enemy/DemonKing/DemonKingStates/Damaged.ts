import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Damaged extends DemonKingState {

	public onEnter(options: Record<string, any>): void {
		if(this.parent.player.position.x < this.owner.position.x)
        	this.owner.animation.play(DemonKingAnimations.DAMAGED_LEFT);
		else
			this.owner.animation.play(DemonKingAnimations.DAMAGED_RIGHT);
	}

	public update(deltaT: number): void {
	
		if(!this.owner.animation.isPlaying(DemonKingAnimations.DAMAGED_RIGHT)
			&& !this.owner.animation.isPlaying(DemonKingAnimations.DAMAGED_LEFT))
			this.finished(DemonKingStates.WALK);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}