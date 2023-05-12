import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { COFEvents } from "../../../COFEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { HealMarkEvents } from "../../../Spells/HealMarks/HealMarkEvents";
import COFLevel from "../../../Scenes/COFLevel";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class Healing extends MindFlayerState {

    protected timesToHeal: number;

	public onEnter(options: Record<string, any>): void {
        this.timesToHeal = 5;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(MindFlayerAnimation.HEALING)) {
            if (this.parent.health < 1000 && this.timesToHeal > 0) {
                this.timesToHeal--;
                this.emitter.fireEvent(COFEvents.BOSS_RECEIVE_HEAL, {id: this.owner.id, heal: 30});
                this.owner.animation.play(MindFlayerAnimation.HEALING);

                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.HEAL_KEY});
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