import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { SnowballAnimation, SnowballStates } from "../SnowballBehavior";
import { SnowballEvents } from "../SnowballEvents";
import SnowballState from "./SnowballState";

export default class Spawn extends SnowballState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(SnowballAnimation.ROLLING, true);
	}

	public update(deltaT: number): void {
		super.update(deltaT);

		if (this.owner.position.x > 1010 || this.owner.position.x < 250 ||
			this.owner.position.y > 765 || this.owner.position.y < 205)
			this.emitter.fireEvent(SnowballEvents.DESPAWN_SNOWBALL, {id: this.owner.id});
	}

	public handleInput(event: GameEvent): void {
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}