import Receiver from "../../../Wolfie2D/Events/Receiver";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

import Spawn from "./SnowballStates/Spawn";
import Despawn from "./SnowballStates/Despawn";
import Inactive from "./SnowballStates/Inactive";
import { SnowballEvents } from "./SnowballEvents";

export const SnowballStates = {
    SPAWN: "SPAWN_SNOWBALL",
    DESPAWN: "DESPAWN_SNOWBALL",
    INACTIVE: "INACTIVE_SNOWBALL"
} as const

export const SnowballAnimation = {
    ROLLING: "ROLLING",
    EXPLODE: "EXPLODE"
} as const

export default class SnowballBehavior extends StateMachineAI {
    // The GameNode that owns this behavior
    protected owner: COFAnimatedSprite;
    protected _velocity: Vec2;
    protected _location: Vec2;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

    public get velocity(): Vec2 {
        return this._velocity;
    }
    public set velocity(v: Vec2) {
        this._velocity = v;
    }

    public get location(): Vec2 {
        return this._location;
    }
    public set location(loc: Vec2) {
        this._location = loc;
    }

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.addState(SnowballStates.SPAWN, new Spawn(this, this.owner));
        this.addState(SnowballStates.DESPAWN, new Despawn(this, this.owner));
        this.addState(SnowballStates.INACTIVE, new Inactive(this, this.owner));
        this.initialize(SnowballStates.SPAWN);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public handleEvent(event: GameEvent): void {
    }

    public update(deltaT: number): void {   
        super.update(deltaT);
        if (this.owner.visible) {
            this.owner.move(this.velocity.scaled(deltaT));
        }
    }
}