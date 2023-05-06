import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { COFEvents } from "../../../COFEvents";
import { DemonKingEvents } from "../DemonKingEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Swipe extends DemonKingState {

	protected numSwipes: number
	protected swipeTimer: Timer; // cooldown between swipes
	protected playerTargetPos: Vec2; //the location to slash at

	public onEnter(options: Record<string, any>): void {

		this.numSwipes = 0;
		this.swipeTimer = new Timer(500);
		this.playerTargetPos = this.parent.player.position
	}

	public update(deltaT: number): void {

		if(this.swipeTimer.timeLeft < 250 && this.swipeTimer.timeLeft > 200)
			this.playerTargetPos.copy(this.parent.player.position)

		if(!this.owner.animation.isPlaying(DemonKingAnimations.ATTACK_LEFT)
			&& !this.owner.animation.isPlaying(DemonKingAnimations.ATTACK_RIGHT)) {

				if(this.numSwipes == 4) {
					this.parent.walkTime = new Date();
					this.finished(DemonKingStates.WALK)
				}

				else if(this.swipeTimer.isStopped())
					this.swipe()
		}

		this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

	private swipe() {
		if(this.parent.getXDistanceFromPlayer() < 0) {
			this.parent.lastFace = 1;
			this.owner.animation.play(DemonKingAnimations.ATTACK_RIGHT);
		}
		else {
			this.parent.lastFace = -1;
			this.owner.animation.play(DemonKingAnimations.ATTACK_LEFT);
		}

		this.parent.velocity = this.owner.position.dirTo(this.playerTargetPos)
        this.parent.velocity.x *= 250;
        this.parent.velocity.y *= 250;

		this.emitter.fireEvent(DemonKingEvents.SWIPED, {lastFace: this.parent.lastFace})
		this.swipeTimer.start();
		this.numSwipes++;
	}
}