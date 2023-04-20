import { SwordAnimation, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { AzazelTweens } from "../../../Player/AzazelController";
import { SwordStates }from "../SwordController";

export default class Attack extends SwordState {

	public onEnter(options: Record<string, any>): void {
        //this.owner.animation.playIfNotAlready(SwordAnimation.ATTACK_LEFT, true, null)
		console.log(this.owner.tweens)
		this.owner.animation.play(SwordAnimation.ATTACK_LEFT, true, null)
		//this.owner.tweens.play(SwordTweens.SPIN, true)
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		//this.owner.tweens.play(SwordTweens.SPIN, true)
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}