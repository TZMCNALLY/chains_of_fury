import { SwordAnimation, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { AzazelTweens } from "../../../Player/AzazelController";
import { SwordEvents } from '../SwordEvents';
import { SwordStates }from "../SwordController";
import { COFEvents } from "../../../COFEvents";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";

export default class BasicAttack extends SwordState {

	protected numSlashes: number;
	protected slashTimer: Timer;
	protected timerChecked: boolean;

	public onEnter(options: Record<string, any>): void { 
		this.numSlashes = 0; 
		this.slashTimer = new Timer(400);
		this.timerChecked = false;
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		// If animation is not playing, go back to normal group.
		if (!this.owner.animation.isPlaying(SwordAnimation.ATTACK_RIGHT) && !this.owner.animation.isPlaying(SwordAnimation.ATTACKED_LEFT)) {
			this.owner.setGroup(COFPhysicsGroups.ENEMY);
		}

		if(this.numSlashes == 5) {
			this.owner.setGroup(COFPhysicsGroups.ENEMY);
			this.finished(SwordStates.WALK)
		}
		
		// Check if the sword can slash again
		else if(!this.owner.animation.isPlaying(SwordAnimation.ATTACK_LEFT) 
			&& !this.owner.animation.isPlaying(SwordAnimation.ATTACK_RIGHT)) {
			
			// Slash toward the position of the player
			this.parent.velocity = this.owner.position.dirTo(this.parent.player.position);
			this.parent.velocity.x *= 450;
			this.parent.velocity.y *= 450;

			if(this.parent.getXDistanceFromPlayer() < 0)
				this.owner.animation.play(SwordAnimation.ATTACK_RIGHT)
			else
				this.owner.animation.play(SwordAnimation.ATTACK_LEFT)

			// Set contact damage group.
			this.owner.setGroup(COFPhysicsGroups.ENEMY_CONTACT_DMG);
			
			this.timerChecked = false;
			this.slashTimer.start();
			this.numSlashes++;
		}

		else if(this.slashTimer.isStopped() && this.timerChecked == false) {
			this.timerChecked = true;
			this.emitter.fireEvent(SwordEvents.BASIC_ATTACK, {lastFace: this.parent.lastFace})
		}

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.parent.walkTimer.start(3000);
		this.owner.animation.stop();

		// Set back to normal enemy group.
		this.owner.setGroup(COFPhysicsGroups.ENEMY);

		return {};
	}
}