import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import COFAnimatedSprite from "../../../Nodes/COFAnimatedSprite";
import DarkStalkerController from "../DarkStalkerController";
import { COFEvents } from "../../../COFEvents";

/**
 * An abstract state for the Dark Stalker 
 */
export default abstract class DarkStalkerState extends State {

    protected parent: DarkStalkerController;
	protected owner: COFAnimatedSprite;

	public constructor(parent: DarkStalkerController, owner: COFAnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {
        if (this.parent.health === 0) {
			this.emitter.fireEvent(COFEvents.BOSS_DEFEATED);
		}
    }

    public abstract onExit(): Record<string, any>;
}