import { SwordAnimation, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { AzazelTweens } from "../../../Player/AzazelController";
import { SwordEvents } from '../SwordEvents';
import { SwordStates }from "../SwordController";

export default class BasicAttack extends SwordState {

	protected numSlashes: number;
	protected numFramesSlashed: number;

	public onEnter(options: Record<string, any>): void { this.numSlashes = 0; this.numFramesSlashed = 0; }

	public update(deltaT: number): void {
		super.update(deltaT);

		if(this.numSlashes == 5)
			this.finished(SwordStates.WALK);

		// Check if the sword can slash again
		else if(!this.owner.animation.isPlaying(SwordAnimation.ATTACK_LEFT) 
			&& !this.owner.animation.isPlaying(SwordAnimation.ATTACK_RIGHT)) {
			
			// Slash toward the position of the player
			this.parent.velocity = this.owner.position.dirTo(this.parent.player.position);
			this.parent.velocity.x *= 300;
			this.parent.velocity.y *= 300;

			if(this.parent.getXDistanceFromPlayer() < 0) {
				this.owner.animation.play(SwordAnimation.ATTACK_RIGHT);
				this.parent.lastFace = 1
			}
			
			else {
				this.owner.animation.play(SwordAnimation.ATTACK_LEFT);
				this.parent.lastFace = -1;
			}
			
			this.numSlashes++;
		}

		this.emitter.fireEvent(SwordEvents.BASIC_ATTACK, {lastFace: this.parent.lastFace})
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}