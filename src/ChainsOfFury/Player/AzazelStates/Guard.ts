import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";

export default class Guard extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(AzazelAnimations.IDLE_RIGHT);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        console.log('Guard trigger');

        this.finished(AzazelStates.IDLE);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}