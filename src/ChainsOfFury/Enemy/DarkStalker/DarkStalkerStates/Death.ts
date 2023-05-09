import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import DarkStalkerState from "./DarkStalkerState";
import { DarkStalkerEvents } from "../DarkStalkerEvents";
import { COFEvents } from "../../../COFEvents";

export default class Death extends DarkStalkerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.TELEPORT, false, COFEvents.BOSS_DEFEATED);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}