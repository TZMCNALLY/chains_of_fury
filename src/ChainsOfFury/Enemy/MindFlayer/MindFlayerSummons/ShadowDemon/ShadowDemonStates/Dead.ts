import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonAnimation } from "../ShadowDemonController";

export default class Dead extends ShadowDemonState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(ShadowDemonAnimation.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}