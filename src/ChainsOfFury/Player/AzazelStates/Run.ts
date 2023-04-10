import { AzazelStates, AzazelAnimations } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";

export default class Run extends PlayerState {

	onEnter(options: Record<string, any>): void {
		this.parent.speed = 150;
        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT);
        else
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT);
	}

	update(deltaT: number): void {
        // Fires running event so HUD knows to decrease stamina.
        this.parent.emitter.fireEvent(COFEvents.PLAYER_RUN);

        // Call getter to update last face.
        this.parent.lastFace;

        // Switch state.
        if(this.parent.inputDir.isZero() || this.parent.stamina == 0) {
            // No movement
            this.finished(AzazelStates.IDLE);
        } 

        else if(Input.isPressed(AzazelControls.HURL)) {
            // Hurl key
            if (this.parent.mana >= 10)
                this.finished(AzazelStates.HURL);
        }

        else if (Input.isMouseJustPressed(2)) {
            // Right click
            if (this.parent.mana > 0)
                this.finished(AzazelStates.GUARD);
        }

        else if(Input.isMouseJustPressed(0)) {
            // Left click
            if (this.parent.stamina >= 10)
                this.finished(AzazelStates.SWING);
        }

        else if(this.parent.lastFace == -1) {
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT);
        }
        
        else {
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT);
        }

        // Move player
        this.owner.move(
            this.parent.inputDir.scale(this.parent.speed).scale(deltaT)
        );
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}