import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { COFEvents } from "../../../COFEvents";
import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import DarkStalkerState from "./DarkStalkerState";

export default class StageA extends DarkStalkerState {

	/**
	 * The first stage of the dark stalker, cycles between attacks and just walks around.
	 */

	private actionWaitTime: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.IDLE);

		this.actionWaitTime = 2;
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		/**
		 * To be implemented:
		 * This boss will just spam magic attack over and over again (emit event)
		 * Walk away from player
		 * Have a chance to teleport when the boss have been hit. (Scale by damage taken since last teleport)
		 * Minions will be of higher as the bosses health decrease.
		 * 
		 * -- Scaped idea that might be implemented if there is still time.
		 * Transition to rapid melee sword attack + teleportation instead when low on health.
		 */

		if (this.actionWaitTime > 0) {
			this.actionWaitTime -= deltaT;
		} else {

			let eyeBallChance = 0;

			// If there is 1 or less eyeball
			if (this.parent.activeEyes < 2) {
				eyeBallChance += 20;
			}
			if (this.parent.activeEyes < 1) {
				eyeBallChance += 30;
			}
			// 50% chance to summon more eyeballs.

			let mineChance = 10;
			if (this.parent.activeMines < 6) {
				mineChance += 30;
			}
			// 10% for mines if there are more than 6 mines, otherwise, 40%

			let rnd = RandUtils.randInt(0, 100);
			if (rnd < eyeBallChance) {
				this.parent.currMagic = 1;
			} else if (rnd < eyeBallChance + mineChance) {
				this.parent.currMagic = 2;
			} else {
				// Rest of the time shoot missle
				// This could range from 70% to 10%
				this.parent.currMagic = 0;
			}

			this.finished(DarkStalkerStates.CAST);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}