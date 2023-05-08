import { SnowballAnimation } from "../SnowballBehavior";
import { SnowballEvents } from "../SnowballEvents";
import SnowballState from "./SnowballState";

export default class Spawn extends SnowballState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(SnowballAnimation.ROLLING, true);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}