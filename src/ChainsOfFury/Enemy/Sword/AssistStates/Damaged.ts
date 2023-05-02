import { AssistAnimations } from "../AssistController";
import { AssistStates }from "../AssistController";
import AssistState from "./AssistState";
import AssistController from "../AssistController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Damaged extends AssistState {

	public onEnter(options: Record<string, any>): void {
		if(this.parent.player.position.x < this.owner.position.x)
        	this.owner.animation.play(AssistAnimations.ATTACKED_LEFT);
		else
			this.owner.animation.play(AssistAnimations.ATTACKED_RIGHT);
	}

	public update(deltaT: number): void {
	
		if(!this.owner.animation.isPlaying(AssistAnimations.ATTACKED_RIGHT)
			&& !this.owner.animation.isPlaying(AssistAnimations.ATTACKED_LEFT))
			this.finished(AssistStates.WALK);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}