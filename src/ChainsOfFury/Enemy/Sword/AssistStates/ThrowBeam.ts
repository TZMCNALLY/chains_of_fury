import { AssistAnimations } from "../AssistController";
import { AssistStates }from "../AssistController";
import AssistState from "./AssistState";
import AssistController from "../AssistController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { AssistEvents } from "../AssistEvents";
import COFLevel5 from "../../../Scenes/COFLevel5";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class ThrowBeam extends AssistState {

	protected throwTimer: Timer
    protected numThrows: number

	public onEnter(options: Record<string, any>): void {

        this.throwTimer = new Timer(700)
        this.throwTimer.start()
        this.numThrows = 0
	}

	public update(deltaT: number): void {

        if(this.throwTimer.isStopped()) {

            if(this.numThrows == 10)
                this.finished(AssistStates.WALK)

            else {
                if(this.parent.getXDistanceFromPlayer() < 0) {
					this.parent.lastFace = 1;
					this.owner.animation.play(AssistAnimations.ATTACK_RIGHT);
				}
				else {
					this.parent.lastFace = -1;
					this.owner.animation.play(AssistAnimations.ATTACK_LEFT);
				}
                this.numThrows++;
                this.emitter.fireEvent(AssistEvents.BEAM_THROWN)
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel5.BEAM_AUDIO_KEY})
                this.throwTimer.start()
            }
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}