import { SwordAnimation, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { AzazelTweens } from "../../../Player/AzazelController";
import { SwordStates }from "../SwordController";

export default class BasicAttack extends SwordState {

	protected numSlashes = 0;

	public onEnter(options: Record<string, any>): void { this.numSlashes = 0; }

	public update(deltaT: number): void {
		super.update(deltaT);

		if(this.numSlashes == 5)
			this.finished(SwordStates.WALK)

		// Check if the sword can slash again
		else if(!this.owner.animation.isPlaying(SwordAnimation.ATTACK_LEFT) 
			&& !this.owner.animation.isPlaying(SwordAnimation.ATTACK_RIGHT)) {
			
			// Slash toward the position of the player
			this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
			this.parent.velocity.x *= 400;
			this.parent.velocity.y *= 400;

			if(this.parent.getXDistanceFromPlayer() < 0)
				this.owner.animation.play(SwordAnimation.ATTACK_RIGHT)
			
			else
				this.owner.animation.play(SwordAnimation.ATTACK_LEFT)
			
			this.numSlashes++;
		}

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}