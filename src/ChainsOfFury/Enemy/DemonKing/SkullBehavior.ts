import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import { COFEvents } from "../../COFEvents";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AzazelController from "../../Player/AzazelController";
import Input from "../../../Wolfie2D/Input/Input"
import { DemonKingEvents } from "./DemonKingEvents";
import ExpandSkullShield from './DemonKingStates/ExpandSkullShield';

export default class SkullBehavior implements AI {
    // The GameNode that owns this behavior
    private _owner: AnimatedSprite;
    private _velocity: Vec2;
    private receiver: Receiver;
    
    private center: Vec2;
    private radius: number;
    private theta: number;

    private skullExpanding: boolean;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.velocity = new Vec2(0, 0)
        this.receiver = new Receiver();
        this.radius = 75;

        this.receiver.subscribe(DemonKingEvents.SKULLS_EXPANDED)

        this.activate(options);
    }

    public destroy(): void {}

    public activate(options: Record<string, any>): void { 
        this.center = options.location 
        this.theta = options.theta
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {

            case DemonKingEvents.SKULLS_EXPANDED: {
                this.skullExpanding = true;
                break;
            }

            default: {
                throw new Error("Unhandled event caught in SkullBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {   

        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.owner.visible) {

            if(this.skullExpanding == true) {

                if(this.radius < 200)
                    this.radius += 2

                else
                    this.skullExpanding = false;
            }

            else {

                if(this.radius > 75)
                    this.radius -= 2
            }

            this.owner.position.x = this.center.x + this.radius * Math.cos(this.theta)
            this.owner.position.y = this.center.y + this.radius * Math.sin(this.theta)
            this.theta += .1

            this.owner.move(this.velocity.scaled(deltaT));
        }
    }

    public get owner() { return this._owner }
    public set owner(owner : AnimatedSprite) { this._owner = owner as AnimatedSprite; }
    public get velocity() { return this._velocity }
    public set velocity(velocity : Vec2) { this._velocity = velocity as Vec2; }
}