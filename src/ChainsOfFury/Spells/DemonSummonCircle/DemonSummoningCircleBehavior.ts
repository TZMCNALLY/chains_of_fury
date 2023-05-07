import Receiver from "../../../Wolfie2D/Events/Receiver";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

import Spawn from "./DemonSummoningCircleStates/Spawn";
import Despawn from "./DemonSummoningCircleStates/Despawn";
import Inactive from "./DemonSummoningCircleStates/Inactive";

export const DemonSummoningCircleStates = {
    SPAWN: "SPAWN",
    DESPAWN: "DESPAWN",
    INACTIVE: "INACTIVE"
} as const

export const DemonSummoningCircleAnimation = {
    SPAWN: "SPAWN",
    DESPAWN: "DESPAWN"
} as const

export default class DemonSummoningCircleBehavior extends StateMachineAI {
    // The GameNode that owns this behavior
    protected owner: COFAnimatedSprite;
    protected _location: Vec2;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

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

        this.addState(DemonSummoningCircleStates.SPAWN, new Spawn(this, this.owner));
        this.addState(DemonSummoningCircleStates.DESPAWN, new Despawn(this, this.owner));
        this.addState(DemonSummoningCircleStates.INACTIVE, new Inactive(this, this.owner));
        this.initialize(DemonSummoningCircleStates.SPAWN);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error("Unhandled event caught in DemonSummoningCircleBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {   
        super.update(deltaT);
    }
}