import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import DarkStalkerState from "./DarkStalkerState";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import { COFEvents } from "../../../COFEvents";
import Teleport from '../../MindFlayer/MindFlayerStates/Teleport';

export default class Death extends DarkStalkerState {

	protected isDead: boolean;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.TELEPORT);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		if(!this.owner.animation.isPlaying(DarkStalkerAnimations.TELEPORT) &&  !this.isDead) {
			this.owner.alpha = 0;
			this.isDead = true;
			this.emitter.fireEvent(COFEvents.BOSS_DEFEATED)
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}