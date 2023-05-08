import { AzazelStates, AzazelAnimations, AzazelTweens } from "../AzazelController";
import Input from "../../../Wolfie2D/Input/Input";
import { AzazelControls } from "../AzazelControls";
import PlayerState from "./PlayerState";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../../COFEvents";

export default class Run extends PlayerState {

    protected dashDuration: number;

	onEnter(options: Record<string, any>): void {
        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_LEFT);
        else
            this.owner.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT);

        this.dashDuration = 0;
	}

	update(deltaT: number): void {
        // Fires running event so HUD knows to decrease stamina.
        this.parent.emitter.fireEvent(COFEvents.PLAYER_RUN);

        this.dashDuration -= deltaT;
        if (this.dashDuration < 0) {
            this.dashDuration = 0;
        }

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
                this.finished(AzazelStates.TELEPORT);
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

        if (Input.isPressed(AzazelControls.DASH) && this.parent.dashCooldown <= 0 && this.parent.stamina > 5) {

            this.dashDuration = .1;
            this.parent.dashCooldown = 1;

            // Can emit a dash event to lower stamina.
            this.emitter.fireEvent(COFEvents.PLAYER_DASH);

            // Doesn't seem enough to time to notice.
            this.parent.iFrames = .1;
            this.owner.tweens.play(AzazelTweens.IFRAME, true);
        }

        if (this.dashDuration == 0) {
            if(!this.parent.slowedTimer.isStopped()) {
                 // Move player
                this.owner.move(
                    this.parent.inputDir.scale(this.parent.speed/2).scale(deltaT)
                );
            }
            else {
                
                // Move player
                this.owner.move(
                    this.parent.inputDir.scale(this.parent.speed).scale(deltaT)
                );
            }
        } else {
            // Move player
            this.owner.move(
                this.parent.inputDir.scale(this.parent.speed*(5+(3*(this.dashDuration/2)))).scale(deltaT)
                // this.parent.faceDir.scale(this.parent.speed*(5+(3*(this.dashDuration/2)))).scale(deltaT)
            );
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}