import { SwordAnimation } from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends SwordState {

	public onEnter(options: Record<string, any>): void {
		this.owner.animation.play(SwordAnimation.DYING, false, null);
        this.owner.animation.queue(SwordAnimation.DEAD);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        console.log(this.owner.animation.isPlaying(SwordAnimation.DYING))
        console.log(this.owner.animation.isPlaying(SwordAnimation.DEAD))
		if (!this.owner.animation.isPlaying(SwordAnimation.DYING) && 
        !this.owner.animation.isPlaying(SwordAnimation.DEAD)) {
            console.log("jkdfls")
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}