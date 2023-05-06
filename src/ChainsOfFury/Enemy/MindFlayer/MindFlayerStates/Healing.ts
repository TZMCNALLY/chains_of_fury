import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import { MindFlayerEvents } from "../MindFlayerEvents";
import { COFEvents } from "../../../COFEvents";

export default class Healing extends MindFlayerState {

    protected timesToHeal: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MindFlayerAnimation.HEALING);
        this.timesToHeal = 5;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.HEALING)) {
            if (this.parent.health < 1500 && this.timesToHeal > 0) {
                this.timesToHeal--;
                this.emitter.fireEvent(COFEvents.BOSS_RECEIVE_HEAL, {id: this.owner.id, heal: 50});
                this.emitter.fireEvent(COFEvents.DISPLAY_HEAL_MARKS, {location: this.owner.position, scale: 3});
                this.owner.animation.play(MindFlayerAnimation.HEALING);
            }
            else {
                this.parent.lastActionTime = new Date();
                this.finished(MindFlayerStates.IDLE);
            }
		}
    }

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}