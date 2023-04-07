import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class Attack extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        // Checks if the left-mouse click has been pressed
        this.owner.animation.playIfNotAlready(AzazelAnimations.ATTACK_RIGHT)
	}

	public update(deltaT: number): void {
        
        // Wait for the attack animation to end before entering another animation
        if(!this.owner.animation.isPlaying(AzazelAnimations.ATTACK_RIGHT)) {
            this.finished(AzazelStates.IDLE)
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}