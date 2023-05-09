import { SnowballAnimation, SnowballStates } from "../SnowballBehavior";
import { SnowballEvents } from "../SnowballEvents";
import SnowballState from "./SnowballState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class Despawn extends SnowballState {

	public onEnter(options: Record<string, any>): void {
		this.parent.velocity = Vec2.ZERO;
        this.owner.animation.play(SnowballAnimation.EXPLODE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (!this.owner.animation.isPlaying(SnowballAnimation.EXPLODE)) {
			this.owner.position.copy(Vec2.ZERO);
            this.owner.visible = false;
			this.finished(SnowballStates.INACTIVE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}