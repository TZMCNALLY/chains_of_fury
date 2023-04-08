import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";

export default class Swing extends PlayerState {

	public onEnter(options: Record<string, any>): void {
		// Plays animationd
		if (this.parent.lastFace == -1) {
			this.owner.animation.playIfNotAlready(AzazelAnimations.ATTACK_LEFT);
		} else {
			this.owner.animation.playIfNotAlready(AzazelAnimations.ATTACK_RIGHT);
		}

		this.parent.fireEvent(COFEvents.PLAYER_SWING, {faceDir: this.parent.lastFace});
	}

	public update(deltaT: number): void {
        
        // Wait for the attack animation to end before entering another animation
        if(!this.owner.animation.isPlaying(AzazelAnimations.ATTACK_RIGHT) && !this.owner.animation.isPlaying(AzazelAnimations.ATTACK_LEFT)) {
            this.finished(AzazelStates.IDLE)
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}