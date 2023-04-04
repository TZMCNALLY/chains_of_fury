import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";
import { PlayerAnimations } from "../PlayerController";

let damage_timer = false;
export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        // If we're falling, the vertical velocity should be >= 0
        this.parent.velocity.y = 0;
    }

    update(deltaT: number): void {
        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            let prevHealth = this.parent.health;
            this.parent.health -= Math.floor(this.parent.velocity.y / 200);
            let currHealth = this.parent.health;

            if (!damage_timer) {
                if (this.parent.health <= 0) {
                    this.finished(PlayerStates.DEAD);
                }
                else if (prevHealth > currHealth) {
                    this.parent.velocity.y = 0;
                    
                    this.owner.animation.play(PlayerAnimations.TAKING_DAMAGE);
                    damage_timer = true;
                    setTimeout(() => {damage_timer = false;}, 200);
                }
                else {
                    this.finished(PlayerStates.IDLE);
                }
            }
        } 
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

    }

    onExit(): Record<string, any> {
        return {};
    }
}