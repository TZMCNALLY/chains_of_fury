import { MindFlayerAnimation, MindFlayerStates } from "../MindFlayerController";
import MindFlayerState from "./MindFlayerState";
import MindFlayerController from "../MindFlayerController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { MindFlayerEvents } from "../MindFlayerEvents";

export default class Teleport extends MindFlayerState {

	public onEnter(options: Record<string, any>): void {
        let possibleLocations = [new Vec2(270, 230), new Vec2(270, 740), new Vec2(990, 220), new Vec2(990, 740)];
        let locations = possibleLocations.filter(location => location.distanceTo(this.parent.player.position) > 400);

        let locationToTeleportTo = locations[Math.trunc(Math.random()*locations.length)];
        this.emitter.fireEvent(MindFlayerEvents.MIND_FLAYER_TELEPORT, {location: locationToTeleportTo});

        this.finished(MindFlayerStates.IDLE);
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}