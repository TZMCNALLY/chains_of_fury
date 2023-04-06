import { AzazelStates, AzazelAnimations } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";

export default class Run extends PlayerState {

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;

        let dir = this.parent.inputDir;

        if(dir.x == -1)
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT)

        else
            console.log("HERE")
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)

        
	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);

        // Get the input direction from the player controller
		let dir = this.parent.inputDir;

        // If the player is not moving - transition to the Idle state
		// if(dir.isZero()){
		// 	this.finished(AzazelStates.IDLE);
		// } 
        // // Otherwise, move the player
        // else if(Input.isJustPressed(AzazelControls.MOVE_RIGHT)){
            // Update the vertical velocity of the player
            this.owner.position.x++
            //this.owner.move(this.parent.velocity.scaled(deltaT));
            //this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)
        //}

	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}