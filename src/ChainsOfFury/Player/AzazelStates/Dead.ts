import { AzazelStates, AzazelAnimations } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";

export default class Dead extends PlayerState {

	onEnter(options: Record<string, any>): void {
        if(this.parent.lastFace == -1) {
            this.owner.animation.play(AzazelAnimations.DYING_LEFT, false, null);
            this.owner.animation.queue(AzazelAnimations.DEAD_LEFT);
        }
        else {
            this.owner.animation.play(AzazelAnimations.DYING_RIGHT, false, null);
            this.owner.animation.queue(AzazelAnimations.DEAD_RIGHT);
        }
	}

	update(deltaT: number): void {
        if (!this.owner.animation.isPlaying(AzazelAnimations.DYING_LEFT) && 
        !this.owner.animation.isPlaying(AzazelAnimations.DYING_RIGHT) &&
        !this.owner.animation.isPlaying(AzazelAnimations.DEAD_LEFT) &&
        !this.owner.animation.isPlaying(AzazelAnimations.DEAD_RIGHT)) {
            this.emitter.fireEvent(COFEvents.PLAYER_DEAD);
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}