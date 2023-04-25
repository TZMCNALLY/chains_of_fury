import { SwordAnimation } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class Damaged extends SwordState {

	public onEnter(options: Record<string, any>): void {
		if(this.parent.player.position.x < this.owner.position.x)
        	this.owner.animation.play(SwordAnimation.ATTACKED_LEFT);
		else
			this.owner.animation.play(SwordAnimation.ATTACKED_RIGHT);
	}

	public update(deltaT: number): void {
	
		if(!this.owner.animation.isPlaying(SwordAnimation.ATTACKED_RIGHT)
			&& !this.owner.animation.isPlaying(SwordAnimation.ATTACKED_LEFT))
			this.finished(SwordStates.WALK);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}