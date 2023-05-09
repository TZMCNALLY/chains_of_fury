import Timer from "../../../../Wolfie2D/Timing/Timer";
import SwordState from "./SwordState";
import { SwordAnimations, SwordStates, SwordTweens } from '../SwordController';
import Vec2 from '../../../../Wolfie2D/DataTypes/Vec2';
import AzazelController, { AzazelAnimations, AzazelStates } from "../../../Player/AzazelController";
import Input from '../../../../Wolfie2D/Input/Input';
import { AzazelControls } from '../../../Player/AzazelControls';
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import { SwordEvents } from '../SwordEvents';
import COFLevel5 from '../../../Scenes/COFLevel5';
import { GameEventType } from '../../../../Wolfie2D/Events/GameEventType';
import Game from "../../../../Wolfie2D/Loop/Game";

export default class Tornado extends SwordState {

    protected timer: Timer; // tracks how long the sword has been spinning in place for

    public onEnter(options: Record<string, any>): void {
        this.timer = new Timer(3000);
        this.timer.start();
        
        // Start spinning
        this.owner.tweens.play(SwordTweens.SPIN, true);
        this.owner.animation.play(SwordAnimations.IDLE, true, null)
        this.owner.tweens.play(SwordTweens.FADE_OUT)
        
        // Spawn tornado
        this.emitter.fireEvent(SwordEvents.SPIN_BEGAN)
        
        // Play tornado sound effect
        let spinAudio = COFLevel5.spinAttackAudioKey
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: spinAudio})
    }

    public update(deltaT: number): void{

        if(this.timer.isStopped()) {

            (this.parent.player.ai as AzazelController).speed = 150;
            this.owner.tweens.stop(SwordTweens.SPIN);
            this.owner.tweens.play(SwordTweens.SPIN, false); //readjust to standing upright
            this.emitter.fireEvent(SwordEvents.SPIN_ENDED)
            this.finished(SwordStates.BASIC_ATTACK)
        }

        else {

            let xDistance = this.parent.getXDistanceFromPlayer();
            let yDistance = this.parent.getYDistanceFromPlayer();

            // Player in front
            if(xDistance < 0) {

                // Player below
                if(yDistance < 0) {

                    if(!Input.isPressed(AzazelControls.MOVE_UP) && !Input.isPressed(AzazelControls.MOVE_LEFT))
                        (this.parent.player.ai as AzazelController).speed = 50
                }

                // Player above
                else {
                    if(!Input.isPressed(AzazelControls.MOVE_DOWN) && !Input.isPressed(AzazelControls.MOVE_LEFT))
                        (this.parent.player.ai as AzazelController).speed = 50
                }
            }

            // Player behind
            else {

                // Player below
                if(yDistance < 0) {

                    if(!Input.isPressed(AzazelControls.MOVE_UP) && !Input.isPressed(AzazelControls.MOVE_RIGHT))
                        (this.parent.player.ai as AzazelController).speed = 50
                }

                // Player above
                else {
                    if(!Input.isPressed(AzazelControls.MOVE_DOWN) && !Input.isPressed(AzazelControls.MOVE_RIGHT))
                        (this.parent.player.ai as AzazelController).speed = 50
                }
            }

            // If the player isn't moving, pull him towards the sword
            if((!Input.isPressed(AzazelControls.MOVE_RIGHT)
                && !Input.isPressed(AzazelControls.MOVE_LEFT)
                && !Input.isPressed(AzazelControls.MOVE_UP)
                && !Input.isPressed(AzazelControls.MOVE_DOWN))
                || this.parent.player.animation.isPlaying(AzazelAnimations.CHARGE_LEFT)
                || this.parent.player.animation.isPlaying(AzazelAnimations.CHARGE_RIGHT)
                || this.parent.player.animation.isPlaying(AzazelAnimations.ATTACK_LEFT)
                || this.parent.player.animation.isPlaying(AzazelAnimations.ATTACK_RIGHT)) {
                
                this.parent.player.move(
                    this.parent.player.position.dirTo(this.owner.position).scale(500).scale(deltaT)
                );
            }

            this.emitter.fireEvent(SwordEvents.SPIN_ATTACK)
        }
    }

    public onExit(): Record<string, any> {
		return {};
	}
}