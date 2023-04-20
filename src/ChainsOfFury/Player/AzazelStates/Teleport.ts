import { AzazelStates, AzazelAnimations, AzazelTweens } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import { COFEvents } from "../../COFEvents";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class Teleport extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(COFEvents.PLAYER_TELEPORT)
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);
		
		this.finished(AzazelStates.IDLE);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}