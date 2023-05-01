import { SwordAnimations, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { AzazelAnimations, AzazelTweens } from "../../../Player/AzazelController";
import { SwordEvents } from '../SwordEvents';
import { SwordStates }from "../SwordController";
import { COFEvents } from "../../../COFEvents";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";

export default class BasicAttack extends SwordState {

	protected numSlashes: number; // how many times the sword has already slashed
	protected maxSlashes: number;
	protected hitboxTimer: Timer;

	public onEnter(options: Record<string, any>): void { 
		this.numSlashes = 0;
		this.maxSlashes =  RandUtils.randInt(2, 6);
		this.hitboxTimer = new Timer(250);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		
		// Check if the sword can slash again
		if(!this.owner.animation.isPlaying(SwordAnimations.ATTACK_LEFT) && !this.owner.animation.isPlaying(SwordAnimations.ATTACK_RIGHT)) {

			if(this.numSlashes == this.maxSlashes) {
				this.parent.walkTime = new Date();
				this.finished(SwordStates.WALK)
			}
			else {
				// Slash toward the position of the player
				this.parent.velocity = this.owner.position.dirTo(this.parent.player.position);
				//let rand = RandUtils.randInt(500, 800)
				this.parent.velocity.x *= 800;
				this.parent.velocity.y *= 800;

				if(this.parent.getXDistanceFromPlayer() < 0) {
					this.parent.lastFace = 1;
					this.owner.animation.play(SwordAnimations.ATTACK_RIGHT);
				}
				else {
					this.parent.lastFace = -1;
					this.owner.animation.play(SwordAnimations.ATTACK_LEFT);
				}

				this.hitboxTimer.start();
				this.numSlashes++;
			}
		}

		// If the hitbox is still active, check for overlap
		else if(this.hitboxTimer.timeLeft < 50 && this.hitboxTimer.timeLeft > 0) {
			this.emitter.fireEvent(SwordEvents.BASIC_ATTACK, {lastFace: this.parent.lastFace})
			this.parent.velocity.x = 0;
			this.parent.velocity.y = 0;
		}

		else {
			this.owner.move(this.parent.velocity.scaled(deltaT));
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}