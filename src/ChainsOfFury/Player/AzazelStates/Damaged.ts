import { AzazelStates, AzazelAnimations } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import COFLevel from "../../Scenes/COFLevel";

export default class Damaged extends PlayerState {

	onEnter(options: Record<string, any>): void {
        if(this.parent.lastFace == -1)
            this.owner.animation.play(AzazelAnimations.TAKEDAMAGE_LEFT, false, null);
        else
            this.owner.animation.play(AzazelAnimations.TAKEDAMAGE_RIGHT, false, null);

		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.PLAYER_DAMAGED_KEY});
	}

	update(deltaT: number): void {
        if (!this.owner.animation.isPlaying(AzazelAnimations.TAKEDAMAGE_LEFT) && 
        !this.owner.animation.isPlaying(AzazelAnimations.TAKEDAMAGE_RIGHT)) {
            this.finished(AzazelStates.IDLE);
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}