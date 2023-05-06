import { MoonDogAnimation } from "../MoonDogController";
import { MoonDogStates }from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import MoonDogController from "../MoonDogController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { COFEvents } from "../../../COFEvents";

export default class Idle extends MoonDogState {

	protected lastActionTime: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.IDLE);

		this.lastActionTime = 2; // How many seconds it takes until it goes into new state.
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		if (this.lastActionTime < deltaT) {
			let rnd = RandUtils.randInt(1, 101);

			if (this.parent.health > 300) {
				// Stage 1

				if (rnd < 20) {
					// 20% chance to charge.
					this.finished(MoonDogStates.HORIZONTAL_CHARGE);
				}

				let summonChance = 5; // 5% chance to re-summon even if all are still alive.

				if (this.parent.minionCount < 3) {
					summonChance += 10; // 15% chance to re-summon if have 2 left.
				}
				if (this.parent.minionCount < 2) {
					summonChance += 20; // 35% chance to re-summon if have 1 left.
				}
				if (this.parent.minionCount < 1) {
					summonChance += 40; // 75% chance to summon if no minions left. 
				}

				if (rnd < 20 + this.parent.minionCount) {
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
				}

				// Max minion counts are raised to 5 here, so chances change as well.

				let summonChance = 10; // 10% chance to re-summon even if all are still alive.

				if (this.parent.minionCount < 4) {
					summonChance += 10; // 20% chance to re-summon if have 3 left.
				}
				if (this.parent.minionCount < 3) {
					summonChance += 10; // 30% chance to re-summon if have 2 left.
				}
				if (this.parent.minionCount < 2) {
					summonChance += 10; // 40% chance to re-summon if 1 minions left. 
				}
				if (this.parent.minionCount < 1) {
					summonChance += 10; // 50% chance to re-summon if no minions are left.
				}

				// What am i writing up there.. I'll change above to equation later TODO

				if (rnd < 50 + this.parent.minionCount) {
					this.finished(MoonDogStates.SUMMON);
				} else {
					// Perform magic here!
					this.finished(MoonDogStates.MAGIC);
				}
			}
		} else {
			// Reduce time until next action.
			this.lastActionTime -= deltaT;
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}