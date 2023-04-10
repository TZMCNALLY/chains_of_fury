import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import { COFEvents } from "../../COFEvents";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        if (this.parent.lastFace == -1) {
            this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_LEFT);
        } else {
            this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT);
        }
	}

	public update(deltaT: number): void {

        this.parent.emitter.fireEvent(COFEvents.REGENERATE_STAMINA);

        if (Input.isPressed(AzazelControls.MOVE_RIGHT) || Input.isPressed(AzazelControls.MOVE_LEFT) 
            || Input.isPressed(AzazelControls.MOVE_UP) || Input.isPressed(AzazelControls.MOVE_DOWN)) {
            if (this.parent.stamina > 0)
                this.finished(AzazelStates.RUN);
        }

        else if(Input.isPressed(AzazelControls.HURL)) {
            if (this.parent.mana >= 10)
                this.finished(AzazelStates.HURL)
        }

        else if(Input.isMouseJustPressed(2)) {
            if (this.parent.mana > 0)
                this.finished(AzazelStates.GUARD)
        }

        else if (Input.isMouseJustPressed(0)) {
            if (this.parent.stamina >= 10)
                this.finished(AzazelStates.SWING)
        }

        else {
            if (this.parent.lastFace == -1) {
                this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_LEFT);
            } else {
                this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT);
            }
        }	
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}