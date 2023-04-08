import { AzazelStates, AzazelAnimations } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class Run extends PlayerState {

	onEnter(options: Record<string, any>): void {
		this.parent.speed = 150;

        if(Input.isPressed(AzazelControls.MOVE_LEFT))
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT)

        else
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)
	}

	update(deltaT: number): void {

        // Get the player's input direction 
		let forwardAxis = (Input.isPressed(AzazelControls.MOVE_UP) ? 1 : 0) + (Input.isPressed(AzazelControls.MOVE_DOWN) ? -1 : 0);
		let horizontalAxis = (Input.isPressed(AzazelControls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(AzazelControls.MOVE_RIGHT) ? 1 : 0);
        
        // Updates animation based on which key, if any, was pressed
        if(forwardAxis == 0 && horizontalAxis == 0)
            this.finished(AzazelStates.IDLE)

        else if(Input.isJustPressed(AzazelControls.HURL))
            this.finished(AzazelStates.HURL)

        else if(Input.isMouseJustPressed(0))
            this.finished(AzazelStates.SWING)

        else if(horizontalAxis == -1)
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT)

        else
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)

        // Updates player position accordingly
        let movement = Vec2.UP.scaled(forwardAxis * this.parent.speed).add(new Vec2(horizontalAxis * this.parent.speed, 0)); 
        this.owner.move(movement.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}