import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(AzazelAnimations.IDLE_RIGHT);
		this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        // Get the direction of the player's movement
		let dir = this.parent.inputDir;

        // If the player is moving along the x-axis, transition to the walking state
		if (!dir.isZero() && dir.y === 0){
			//this.finished(PlayerStates.WALK);
		} 
        // If the player is jumping, transition to the jumping state
        else if (Input.isJustPressed(AzazelControls.MOVE_RIGHT)) {
            this.finished(AzazelStates.RUN);
        }
        // If the player is not on the ground, transition to the falling state
        else if (!this.owner.onGround && this.parent.velocity.y > 0) {
            //this.finished(PlayerStates.FALL);
        }
        // Otherwise, do nothing (keep idling)
        else {
            // Update the vertical velocity of the player
            //this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            //this.owner.move(this.parent.velocity.scaled(deltaT));
        }
		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}