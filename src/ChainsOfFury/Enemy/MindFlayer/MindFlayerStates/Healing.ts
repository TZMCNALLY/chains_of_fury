import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { COFEvents } from "../../../COFEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { HealMarkEvents } from "../../../Spells/HealMarks/HealMarkEvents";

export default class Healing extends MindFlayerState {

    protected timesToHeal: number;

	public onEnter(options: Record<string, any>): void {
        this.timesToHeal = 5;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.HEALING)) {
            if (this.parent.health < 1500 && this.timesToHeal > 0) {
                this.timesToHeal--;
                this.emitter.fireEvent(COFEvents.BOSS_RECEIVE_HEAL, {id: this.owner.id, heal: 50});
                this.emitter.fireEvent(HealMarkEvents.DISPLAY_HEAL_MARKS, {location: new Vec2(this.owner.position.x+5, this.owner.position.y), scale: 1.5});
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