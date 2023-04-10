import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import { COFEvents } from "../../COFEvents";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        console.log("entered idle")
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

        /** 
         * For a while, I tried to make the Idle animation carry over to the Guard state after a transition, but 
         * the Idle animation in the Guard state freezes unless either an attack is done or 
         * the player runs. For the sake of time, this implementation is working. However, later on in development, 
         * the code inside of the mana check should be in Guard.ts instead to preserve states.
         * 
         * - Torin
         */

        else if(Input.isMousePressed(2)) {
            
            if (this.parent.mana > 0) {

                this.parent.emitter.fireEvent(COFEvents.PLAYER_GUARD)

		        if (this.parent.lastFace == -1) {
                    this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_LEFT);
                } else {
                    this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT);
                }
            }
            
            //this.finished(AzazelStates.GUARD)
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
        console.log("updating idle")
        console.log(this.owner.animation.isPlaying(AzazelAnimations.IDLE_RIGHT))
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}