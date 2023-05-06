import { DarkStalkerAnimations, DarkStalkerStates } from "../DarkStalkerController";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import DarkStalkerState from "./DarkStalkerState";
import { DarkStalkerEvents } from "../DarkStalkerEvents";

export default class Teleport extends DarkStalkerState {

	public onEnter(options: Record<string, any>): void {
        let possibleLocations = [new Vec2(270, 230), new Vec2(270, 740), new Vec2(990, 220), new Vec2(990, 740)];
        let locations = possibleLocations.filter(location => location.distanceTo(this.parent.player.position) > 100);

        let locationToTeleportTo = locations[Math.trunc(Math.random()*locations.length)];

        this.owner.animation.play(DarkStalkerAnimations.TELEPORT, false, DarkStalkerEvents.TELEPORT, {location: locationToTeleportTo})
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}