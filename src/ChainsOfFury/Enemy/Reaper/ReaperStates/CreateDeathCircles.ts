import { ReaperAnimation } from "../ReaperController";
import ReaperState from "./ReaperState";
import { ReaperStates } from "../ReaperController";
import { ReaperEvents } from "../ReaperEvents";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class CreateDeathCircles extends ReaperState {

    // number of death circles to create
	protected deathCirclesToSpawn : number;

	public onEnter(options: Record<string, any>): void {
        this.deathCirclesToSpawn = 1;
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (!this.owner.animation.isPlaying(ReaperAnimation.SPAWN_DEATH_CIRCLES)) {
            if (this.deathCirclesToSpawn > 0) {
                // let minX = 350;
                // let maxX = 950;
                // let minY = 230;
                // let maxY = 700;
                // let locationX = Math.floor(Math.random() * ((maxX-minX)) + minX);
                // let locationY = Math.floor(Math.random() * ((maxY-minY)) + minY);
                let locationX = MathUtils.clamp(this.parent.player.position.x, 350, 950);
                let locationY = MathUtils.clamp(this.parent.player.position.y, 230, 700);
                let spawn = new Vec2(locationX, locationY);

                this.deathCirclesToSpawn--;
                this.owner.animation.play(ReaperAnimation.SPAWN_DEATH_CIRCLES);
                this.emitter.fireEvent(ReaperEvents.SPAWN_DEATH_CIRCLE, {location: spawn});
            }
            else {
                this.parent.lastActionTime = new Date();
                this.finished(ReaperStates.IDLE);
            }
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}