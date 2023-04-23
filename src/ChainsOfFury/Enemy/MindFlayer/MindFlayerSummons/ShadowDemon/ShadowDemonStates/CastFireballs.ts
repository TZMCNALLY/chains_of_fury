import { ShadowDemonAnimation } from "../ShadowDemonController";
import ShadowDemonState from "./ShadowDemonState";
import { ShadowDemonStates } from "../ShadowDemonController";
import { ShadowDemonEvents } from "../ShadowDemonEvents";

export default class CastFireballs extends ShadowDemonState {

	// number of fireballs to fire
	protected fireballsToFire : number;

	public onEnter(options: Record<string, any>): void {
		this.fireballsToFire = 3;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
		if (!this.owner.animation.isPlaying(ShadowDemonAnimation.CAST_LEFT_FIREBALLS) &&
		 !this.owner.animation.isPlaying(ShadowDemonAnimation.CAST_RIGHT_FIREBALLS) &&
		 this.fireballsToFire > 0) {
			let direction = this.owner.position.dirTo(this.parent.player.position)
			this.owner.animation.play(ShadowDemonAnimation.CAST_LEFT_FIREBALLS, false, ShadowDemonEvents.SHADOW_DEMON_FIRE_FIREBALL, {faceDir: direction, id: this.owner.id})
			this.fireballsToFire--;
		}
		else if (!this.owner.animation.isPlaying(ShadowDemonAnimation.CAST_LEFT_FIREBALLS) &&
		 !this.owner.animation.isPlaying(ShadowDemonAnimation.CAST_RIGHT_FIREBALLS) && 
		 this.fireballsToFire === 0) {
			this.finished(ShadowDemonStates.IDLE);
		}
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}