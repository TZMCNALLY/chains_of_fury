import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import { MindFlayerEvents } from "../MindFlayerEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class SpawnShadowDemons extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (this.parent.shadowDemonCount < 5) {
            this.owner.animation.play(MindFlayerAnimation.SPAWN_SHADOW_DEMONS);
            // spawn demon
            this.parent.shadowDemonCount = 5;
        }
        
        if (!this.owner.animation.isPlaying(MindFlayerAnimation.SPAWN_SHADOW_DEMONS)) {
            this.finished(MindFlayerStates.IDLE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}