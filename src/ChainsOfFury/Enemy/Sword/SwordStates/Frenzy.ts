import { SwordAnimations, SwordTweens } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { SwordEvents } from '../SwordEvents';
import { SwordStates }from "../SwordController";
import { COFEvents } from "../../../COFEvents";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Vec2 from '../../../../Wolfie2D/DataTypes/Vec2';
import COFLevel5 from "../../../Scenes/COFLevel5";

export default class Frenzy extends SwordState {

    protected toPlayer: Vec2; // vector to original player direction
    protected attackStarted: boolean
    protected spinTimer: Timer; // when the spin tween ends

	public onEnter(options: Record<string, any>): void { 

        this.attackStarted = false;
        this.spinTimer = new Timer(1000)

        this.owner.animation.play(SwordAnimations.IDLE)
        this.owner.animation.stop();
        this.owner.tweens.play(SwordTweens.TWIRL)
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel5.FRENZY_AUDIO_KEY})
        this.spinTimer.start()
	}

	public update(deltaT: number): void {
		super.update(deltaT);

        if(this.spinTimer.isStopped()) {

            if(this.attackStarted == false) {

                this.parent.velocity = this.owner.position.dirTo(this.parent.player.position);
                this.parent.velocity.x *= 1000;
                this.parent.velocity.y *= 1000;
                this.attackStarted = true;
                this.owner.tweens.play(SwordTweens.SPIN, true);
            }

            else {

                if(this.owner.position.x < 250 || this.owner.position.x > 1010
                    || this.owner.position.y < 210 || this.owner.position.y > 745) {
                    this.parent.walkTime = new Date();
                    this.owner.tweens.stop(SwordTweens.SPIN)
                    this.owner.tweens.play(SwordTweens.SPIN, false)
                    this.finished(SwordStates.IDLE)
                }
                
                else {
                    
                    this.emitter.fireEvent(SwordEvents.SPIN_ATTACK)
                }
        
                this.owner.move(this.parent.velocity.scaled(deltaT));
            }   
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}