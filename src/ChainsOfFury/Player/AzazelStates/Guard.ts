import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import { COFEvents } from "../../COFEvents";

export default class Guard extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        if (this.parent.lastFace == -1) {
            this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_LEFT);
        } else {
            this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT);
        }
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		this.parent.emitter.fireEvent(COFEvents.PLAYER_GUARD)

		if(!Input.isMousePressed(2)) {
			console.log("transitioned")
			this.finished(AzazelStates.IDLE);
		}

		if (this.parent.lastFace == -1) {
			this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_LEFT);
		} else {
			console.log("idleing")
			this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}