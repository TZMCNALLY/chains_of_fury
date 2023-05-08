import IceMirrorState from "./IceMirrorState";

export default class Inactive extends IceMirrorState {

	public onEnter(options: Record<string, any>): void {
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}