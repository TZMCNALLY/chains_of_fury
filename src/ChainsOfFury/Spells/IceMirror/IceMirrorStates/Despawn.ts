import { IceMirrorAnimation, IceMirrorStates } from "../IceMirrorBehavior";
import { IceMirrorEvents } from "../IceMirrorEvents";
import IceMirrorState from "./IceMirrorState";


export default class Despawn extends IceMirrorState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(IceMirrorAnimation.DESPAWN);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (!this.owner.animation.isPlaying(IceMirrorAnimation.DESPAWN)) {
            this.emitter.fireEvent(IceMirrorEvents.DESPAWN_MIRROR, {id: this.owner.id});
			this.finished(IceMirrorStates.INACTIVE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}