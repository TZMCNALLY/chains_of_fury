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

		this.lastActionTime = 5; // How many seconds it takes until it goes into new state.
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
					return;
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

			// TODO: Add an circling algorithm so that this boss tries to keep a distance from the player.
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}