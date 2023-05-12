import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import { COFEvents } from "../../../COFEvents";
import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import DarkStalkerState from "./DarkStalkerState";

export default class Walk extends DarkStalkerState {

	/**
	 * The first stage of the dark stalker, cycles between attacks and just walks around.
	 */

	private walkTime: number;

	public onEnter(options: Record<string, any>): void {
		this.walkTime = 2;
	}

	public update(deltaT: number): void {

		/**
		 * Simply walks for a few seconds before going back a decision making state.
		 */

        if (!this.owner.animation.isPlaying(DarkStalkerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(DarkStalkerAnimations.RUN)) {
            this.owner.animation.play(DarkStalkerAnimations.RUN, true);
        }

		if (this.walkTime > 0) {
			this.walkTime -= deltaT;

            let movementVector = new Vec2(
                -(this.parent.player.position.x - this.owner.position.x),
                -(this.parent.player.position.y - this.owner.position.y)
            );
    
            movementVector = movementVector.normalized().mult(this.parent.walkVelocity);
    
            if (this.parent.player.position.distanceTo(this.owner.position) < 150)
                this.owner.move(movementVector.scaled(deltaT)); 
		} else {
            // Decides whether the boss should teleport.

            // Scale chance with how much hits the boss have taken.
            let teleportChance = (this.parent.lastTPHitCount * 15) + 30;
            let rnd = RandUtils.randInt(0, 100);
            
            // Double teleportation chance if backed up against a wall.
            if (this.owner.position.x - 270 < 100 || 990 - this.owner.position.x < 100 ||
                990 - this.owner.position.y < 100 || this.owner.position.y - 230 < 100) {
                    teleportChance *= 2;
                }

            if (rnd < teleportChance) {
                this.finished(DarkStalkerStates.TELEPORT);
                this.parent.lastTPHitCount = 0;
            } else {
                this.finished(DarkStalkerStates.STAGEA);
            }
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}