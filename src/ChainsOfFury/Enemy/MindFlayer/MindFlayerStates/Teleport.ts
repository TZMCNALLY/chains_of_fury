import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import { COFEvents } from "../../../COFEvents";

export default class Teleport extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(COFEvents.BOSS_TELEPORT)
	}

	public update(deltaT: number): void {
		super.update(deltaT);

        this.finished(MindFlayerStates.IDLE);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}