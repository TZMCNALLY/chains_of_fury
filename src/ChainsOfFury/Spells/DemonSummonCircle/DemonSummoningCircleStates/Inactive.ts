import DemonSummoningCircleState from "./DemonSummoningCircleState";

export default class Inactive extends DemonSummoningCircleState {

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