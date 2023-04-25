import Timer from "../../../../Wolfie2D/Timing/Timer";
import SwordState from "./SwordState";
import { SwordAnimation, SwordStates, SwordTweens } from '../SwordController';
import Vec2 from '../../../../Wolfie2D/DataTypes/Vec2';
import AzazelController, { AzazelAnimations, AzazelStates } from "../../../Player/AzazelController";
import Input from '../../../../Wolfie2D/Input/Input';
import { AzazelControls } from '../../../Player/AzazelControls';
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import { SwordEvents } from '../SwordEvents';
import COFLevel5 from '../../../Scenes/COFLevel5';
import { GameEventType } from '../../../../Wolfie2D/Events/GameEventType';
import Game from "../../../../Wolfie2D/Loop/Game";

export default class SpinAttack extends SwordState {

    protected timer: Timer; // tracks how long the sword has been spinning for
    protected isCentered: boolean // tracks if the sword is creating a pull

    public onEnter(options: Record<string, any>): void {
        this.isCentered = false;
        
        this.timer = new Timer(2000);
        this.timer.start();
        
        this.owner.animation.playIfNotAlready(SwordAnimation.ATTACK_RIGHT, true, null)
        this.owner.tweens.play(SwordTweens.SPIN, true);
        
        let spinAudio = (this.owner.getScene() as COFLevel5).getSpinAudio()
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: spinAudio})
    }

    public update(deltaT: number): void{

        if(this.isCentered == false) {
            
            if(this.owner.position.x > 390 && this.owner.position.x < 410
                && this.owner.position.y > 390 && this.owner.position.y < 410)
                this.isCentered = true;

            else {
                this.parent.velocity = this.owner.position.dirTo(new Vec2(400, 400))
                this.parent.velocity.x *= 800;
                this.parent.velocity.y *= 800;
                this.owner.move(this.parent.velocity.scaled(deltaT));
            }
        }
        
        else {

            if(this.timer.isStopped())
                this.finished(SwordStates.BASIC_ATTACK)

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
            if(!Input.isPressed(AzazelControls.MOVE_RIGHT)
                && !Input.isPressed(AzazelControls.MOVE_LEFT)
                && !Input.isPressed(AzazelControls.MOVE_UP)
                && !Input.isPressed(AzazelControls.MOVE_DOWN)) {
                
                this.parent.player.move(
                    this.parent.player.position.dirTo(this.owner.position).scale(500).scale(deltaT)
                );
            }

            this.emitter.fireEvent(SwordEvents.SPIN_ATTACK)
        }
    }

    public onExit(): Record<string, any> {
        this.parent.speed = 150;
        this.owner.tweens.stop(SwordTweens.SPIN);
        let spinAudio = (this.owner.getScene() as COFLevel5).getSpinAudio()
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: spinAudio})
		return {};
	}
}