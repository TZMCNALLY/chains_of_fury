import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import { MindFlayerEvents } from "../MindFlayerEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { DemonSummoningCircleEvents } from "../../../Spells/DemonSummonCircle/DemonSummoningCircleEvents";

export default class SpawnShadowDemons extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
		if (this.parent.shadowDemonCount < this.parent.maxShadowDemonCount) {
            this.owner.animation.play(MindFlayerAnimation.SPAWN_SHADOW_DEMONS);
            this.spawnShadowDemons(this.parent.maxShadowDemonCount - this.parent.shadowDemonCount);
            this.parent.shadowDemonCount = this.parent.maxShadowDemonCount;
        }
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        
        if (!this.owner.animation.isPlaying(MindFlayerAnimation.SPAWN_SHADOW_DEMONS)) {
            this.finished(MindFlayerStates.IDLE);
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

	public spawnShadowDemons(spawns : number) {
		let spawnPoints = [new Vec2(640, 480), new Vec2(640, 220), new Vec2(640, 740), new Vec2(260, 480), new Vec2(1000, 480)];
		for (let i = 0; i < spawns; i++) {
			this.emitter.fireEvent(DemonSummoningCircleEvents.SPAWN_CIRCLE, {location: spawnPoints[i]});
		}
	}
}