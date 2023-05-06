import Game from "./Wolfie2D/Loop/Game";
import { AzazelControls } from "./ChainsOfFury/Player/AzazelControls";
import SplashScreen from "./ChainsOfFury/Scenes/SplashScreen";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import { COFCheats } from "./ChainsOfFury/COFCheats";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 34, g: 32, b: 52},   // The color the game clears to
        inputs: [
            {name: AzazelControls.MOVE_LEFT, keys: ["a"]},
            {name: AzazelControls.MOVE_RIGHT, keys: ["d"]},
            {name: AzazelControls.MOVE_UP, keys: ["w"]},
            {name: AzazelControls.MOVE_DOWN, keys: ["s"]},
            {name: AzazelControls.HURL, keys: ["e"]},
            {name: AzazelControls.DASH, keys: ["shift"]},
            {name: COFCheats.ESCAPE, keys: ["escape"]},
            {name: COFCheats.INFINITE_DAMAGE, keys: ["o"]},
            {name: COFCheats.INFINITE_HEALTH, keys: ["p"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();