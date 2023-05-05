import { SwordAnimations } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { SwordEvents } from "../SwordEvents";
import AssistState from './AssistState';
import { AssistAnimations } from "../AssistController";
import { COFEvents } from "../../../COFEvents";

export default class Heal extends AssistState {


	public onEnter(options: Record<string, any>): void {

        this.owner.animation.playIfNotAlready(AssistAnimations.DANCE)
	}

	public update(deltaT: number): void {

        if(!this.owner.animation.isPlaying(AssistAnimations.DANCE)){

            this.owner.animation.play(AssistAnimations.DANCE)
            this.emitter.fireEvent(COFEvents.BOSS_RECEIVE_HEAL, {heal: 50})
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}