import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import DarkStalkerState from "./DarkStalkerState";
import { DarkStalkerEvents } from "../DarkStalkerEvents";

export default class Damaged extends DarkStalkerState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(DarkStalkerAnimations.TAKINGDAMAGE_LEFT, false);

        // let 
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}