import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "../../Wolfie2D/Rendering/Animations/ParticleSystem";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import ParticleSystemManager from "../../Wolfie2D/Rendering/Animations/ParticleSystemManager";
import PlayerState from "./PlayerStates/PlayerState";
import PlayerController from "./PlayerController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";

/**
 * // TODO get the particles to move towards the mouse when the player attacks
 * 
 * The particle system used for the player's attack. Particles in the particle system should
 * be spawned at the player's position and fired in the direction of the mouse's position.
 */

export default class PlayerWeapon extends ParticleSystem {
    protected playerController : PlayerController;

    public set setController(playerController : AI) {
        this.playerController = playerController as PlayerController;
    }

    public getPool(): Readonly<Array<Particle>> {
        return this.particlePool;
    }

    /**
     * @returns true if the particle system is running; false otherwise.
     */
    public isSystemRunning(): boolean { return this.systemRunning; }

    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    public setParticleAnimation(particle: Particle) {
        
        // Give the particle a random velocity.
        let vec = this.playerController.faceDir;
        vec.x *= 100;
        vec.y *= 100;
        particle.vel = RandUtils.randVec(vec.x-32,vec.x+32,vec.y-32,vec.y+32);

        particle.color = Color.RED;
        particle.setGroup(HW3PhysicsGroups.PLAYER_WEAPON);
        
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_SINE
                }
            ]
        });
    }

}