import { MoonDogAnimation } from "../MoonDogController";
import { MoonDogStates }from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { COFEvents } from "../../../COFEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Idle extends MoonDogState {

	protected lastActionTime: number;

	private repositioningSpeed: Vec2;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.IDLE);

		this.lastActionTime = 5; // How many seconds it takes until it goes into new state.

		this.repositioningSpeed = new Vec2(50,50);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this.lastActionTime < deltaT) {
			let rnd = RandUtils.randInt(1, 101);

			if (this.parent.health > 300) {
				// Stage 1

				// Make it more like to dash if player is close and boss is backed up in the corner. (up to 60%)
				let increasedChance = 0;
				if (this.owner.position.x > 800 || this.owner.position.x < 350) {
					if (this.owner.position.distanceTo(this.parent.player.position) < 200) {
						increasedChance = (this.owner.position.distanceTo(this.parent.player.position) / 200) * 40;
					}
				}

				if (rnd < 20 + increasedChance) {
					// 20% chance to charge.
					this.finished(MoonDogStates.HORIZONTAL_CHARGE);
					return;
				}

				let summonChance = 0; // 0% chance to summon even if all are still alive.

				if (this.parent.minionCount < 3) {
					summonChance += 10; // 10% chance to summon if have 2 left.
				}
				if (this.parent.minionCount < 2) {
					summonChance += 20; // 30% chance to summon if have 1 left.
				}
				if (this.parent.minionCount < 1) {
					summonChance += 40; // 70% chance to summon if no minions left. 
				}

				// Magic chance is higher when boss is not in danger and has more minions.
				if (rnd < 20 + summonChance) {
					this.finished(MoonDogStates.SUMMON);
				} else {
					// Perform magic here!
					this.finished(MoonDogStates.MAGIC);
				}
			} else {
				// Stage 2
				
				if (rnd < 50) {
					// 50% chance to charge. (with faster repositioning and chargespeed)
					// Charge will also end with a pound instead of going back to IDLE.
					this.finished(MoonDogStates.HORIZONTAL_CHARGE);
					return;
				}

				// Max minion counts are raised to 5 here, so chances change as well.
				let summonChance = 10 + 10*(5-this.parent.minionCount-1);

				if (rnd < 50 + summonChance) {
					this.finished(MoonDogStates.SUMMON);
				} else {
					// Perform magic here!
					this.finished(MoonDogStates.MAGIC);
				}
			}
		} else {
			// Reduce time until next action.
			this.lastActionTime -= deltaT;

			// A simple walking algorithm
			if (this.owner.position.distanceTo(this.parent.player.position) < 400) {
				this.owner.move(
					// Move the other way from the player.
					new Vec2(
						Math.sign(this.parent.player.position.clone().sub(this.owner.position).x) * -this.repositioningSpeed.x,
						this.parent.player.position.clone().sub(this.owner.position).normalize().scale(-1).mult(this.repositioningSpeed).y
					).scaled(deltaT)
				);
				
				this.owner.animation.playIfNotAlready(MoonDogAnimation.WALKING);
				this.owner.invertX = Math.sign(this.owner.position.x - this.parent.player.position.x) < 0;
			}
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}