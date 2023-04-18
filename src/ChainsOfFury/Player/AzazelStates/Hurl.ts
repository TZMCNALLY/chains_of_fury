import { AzazelStates, AzazelAnimations } from "../AzazelController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";

export default class Attack extends PlayerState {

    public onEnter(options: Record<string, any>): void {
		if (this.parent.lastFace == -1) {
			this.owner.animation.playIfNotAlready(AzazelAnimations.CHARGE_LEFT, false, COFEvents.PLAYER_HURL, {lastFace : this.parent.lastFace, faceDir : this.parent.faceDir});
			this.owner.animation.queue(AzazelAnimations.ATTACK_LEFT);
		}
		else {
			this.owner.animation.playIfNotAlready(AzazelAnimations.CHARGE_RIGHT, false, COFEvents.PLAYER_HURL, {lastFace : this.parent.lastFace, faceDir : this.parent.faceDir});
			this.owner.animation.queue(AzazelAnimations.ATTACK_RIGHT);
		}
	}

	public update(deltaT: number): void {
		if (
			(!this.owner.animation.isPlaying(AzazelAnimations.CHARGE_RIGHT) 
			&& !this.owner.animation.isPlaying(AzazelAnimations.ATTACK_RIGHT))
			&&
			(!this.owner.animation.isPlaying(AzazelAnimations.CHARGE_LEFT) 
			&& !this.owner.animation.isPlaying(AzazelAnimations.ATTACK_LEFT))
		) 
		{
			this.finished(AzazelStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}