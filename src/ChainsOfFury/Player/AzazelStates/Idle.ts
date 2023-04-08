import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        if (this.parent.lastFace == -1) {
            this.owner.animation.play(AzazelAnimations.IDLE_LEFT);
        } else {
            this.owner.animation.play(AzazelAnimations.IDLE_RIGHT);
        }
	}

	public update(deltaT: number): void {

        if (Input.isPressed(AzazelControls.MOVE_RIGHT) || Input.isPressed(AzazelControls.MOVE_LEFT) 
            || Input.isPressed(AzazelControls.MOVE_UP) || Input.isPressed(AzazelControls.MOVE_DOWN))
            this.finished(AzazelStates.RUN);
        else if(Input.isPressed(AzazelControls.HURL))
            this.finished(AzazelStates.HURL)
        else if(Input.isMouseJustPressed(2))
            this.finished(AzazelStates.GUARD)
        else if (Input.isMouseJustPressed(0))
            this.finished(AzazelStates.SWING)
        else {
            if (this.parent.lastFace == -1) {
                this.owner.animation.play(AzazelAnimations.IDLE_LEFT);
            } else {
                this.owner.animation.play(AzazelAnimations.IDLE_RIGHT);
            }
        }	
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}