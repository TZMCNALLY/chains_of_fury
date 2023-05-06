import { DemonKingAnimations } from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import { COFEvents } from "../../../COFEvents";

export default class Dead extends DemonKingState {

	public onEnter(options: Record<string, any>): void {
		if(this.parent.player.position.x < this.owner.position.x){
            this.owner.animation.play(DemonKingAnimations.DYING_LEFT);
            this.owner.animation.queue(DemonKingAnimations.DEAD_LEFT);
        }
		else {
            this.owner.animation.play(DemonKingAnimations.DYING_RIGHT);
            this.owner.animation.queue(DemonKingAnimations.DEAD_RIGHT);
        }
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		if (!this.owner.animation.isPlaying(DemonKingAnimations.DYING_LEFT) && 
        !this.owner.animation.isPlaying(DemonKingAnimations.DYING_RIGHT)) {
            this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}