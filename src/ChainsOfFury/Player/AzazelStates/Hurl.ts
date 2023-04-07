import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class Attack extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        // Checks if the left-mouse click has been pressed
        this.owner.animation.playIfNotAlready(AzazelAnimations.CHARGE_RIGHT)
        this.owner.animation.queue(AzazelAnimations.ATTACK_RIGHT)
	}

	public update(deltaT: number): void {

        //CHARGE NOT PLAYING
        if(!this.owner.animation.isPlaying(AzazelAnimations.CHARGE_RIGHT) && 
            !this.owner.animation.isPlaying(AzazelAnimations.ATTACK_RIGHT))
                //TODO: FIRE EVENT FOR FIREBALL HERE
                this.finished(AzazelStates.IDLE)
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}