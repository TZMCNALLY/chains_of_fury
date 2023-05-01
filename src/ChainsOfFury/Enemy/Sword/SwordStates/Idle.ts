import { SwordAnimations } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class Idle extends SwordState {

	protected idleTimer: Timer

	public onEnter(options: Record<string, any>): void {
		this.idleTimer = new Timer(RandUtils.randInt(3000,5000))
		this.idleTimer.start()
        this.owner.animation.play(SwordAnimations.IDLE, true, null);
	}

	public update(deltaT: number): void {
		if(this.idleTimer.hasRun()) {

			let distance = this.parent.getDistanceFromPlayer()
			console.log(distance)

			if(distance < 16)
				this.finished(SwordStates.TORNADO);

			else
				this.finished(SwordStates.BASIC_ATTACK);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}