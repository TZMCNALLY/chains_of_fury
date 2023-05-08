import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { ReaperEvents } from "../../Enemy/Reaper/ReaperEvents";
import { SlashEvents } from "./SlashEvents";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";

export default class SlashBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2
    private receiver: Receiver;
    private emitter: Emitter;
    private _player: AnimatedSprite;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0,0);
        this.receiver = new Receiver();
        this.emitter = new Emitter();
        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error("Unhandled event caught in SlashBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void { 
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.owner.visible) {
            // Update position of the slash
            this.owner.move(this.velocity.scaled(deltaT));

            // checks to see if slash is hitting the player
            if ((this.owner.collisionShape as AABB).touchesAABB(this.player.collisionShape as AABB)) {
                this.emitter.fireEvent(SlashEvents.SLASH_HIT_PLAYER);
                this.emitter.fireEvent(SlashEvents.DESPAWN_SLASH, {id: this.owner.id});
            }
            // check to see if the slash has gone out of bounds
            else if (this.owner.position.x < 260 || this.owner.position.x > 990 ||
                this.owner.position.y < 210 || this.owner.position.y > 770) {
                this.emitter.fireEvent(SlashEvents.DESPAWN_SLASH, {id: this.owner.id});
            }
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
    public get player() { return this._player }
    public set player(player : AnimatedSprite) { this._player = player as AnimatedSprite; }
}

