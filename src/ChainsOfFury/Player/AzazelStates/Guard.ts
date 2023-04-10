import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import { COFEvents } from "../../COFEvents";

export default class Guard extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT, true);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

		this.parent.emitter.fireEvent(COFEvents.PLAYER_GUARD);

		if(!Input.isMousePressed(2))
			this.finished(AzazelStates.IDLE);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}