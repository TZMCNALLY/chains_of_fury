import { AssistAnimations } from "../AssistController";
import { AssistStates }from "../AssistController";
import AssistState from "./AssistState";
import AssistController from "../AssistController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class Spawn extends AssistState {

	protected idleTimer: Timer

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.playIfNotAlready(AssistAnimations.SPAWN)
	}

	public update(deltaT: number): void {
		if(!this.owner.animation.isPlaying(AssistAnimations.SPAWN))
			this.finished(AssistStates.WALK)
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}