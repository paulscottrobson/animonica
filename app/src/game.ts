/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Main game state
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    private music:Music;
    private rManager:IRenderManager;

    create() : void {
        // Set up configuration
        Config.setup(this.game);
        // Get music
        this.music = new Music(this.cache.getJSON("music"));
        // Create render manager
        this.rManager = new ZoomRenderManager(this.game,this.music);
    }

    destroy() : void {
        this.music = null;
    }

    update() : void {
    }

}    
