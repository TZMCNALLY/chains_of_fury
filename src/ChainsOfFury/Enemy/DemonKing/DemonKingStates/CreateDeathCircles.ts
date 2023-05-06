import { DemonKingAnimations } from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import { DemonKingStates } from "../DemonKingController";
//import { DemonKingEvents } from "../DemonKingEvents";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Timer from '../../../../Wolfie2D/Timing/Timer';
import { DemonKingEvents } from "../DemonKingEvents";

export default class CreateDeathCircles extends DemonKingState {

    // number of death circles to create
	protected deathCirclesToSpawn : number;
    protected timeBetweenSpawns: Timer;

	public onEnter(options: Record<string, any>): void {
        this.deathCirclesToSpawn = 5;
        this.timeBetweenSpawns = new Timer(500);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
        if (this.timeBetweenSpawns.isStopped()) {
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
                this.owner.animation.play(DemonKingAnimations.DANCING);
                this.emitter.fireEvent(DemonKingEvents.SPAWN_DEATH_CIRCLE, {location: spawn});
                this.timeBetweenSpawns.start();
            }
            else {

                this.finished(DemonKingStates.SWIPE);
            }
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}