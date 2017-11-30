/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Main game state
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    private instrument:Instrument;
    private music:Music;

    create() : void {
        // Set up configuration
        Config.setup(this.game);
        // Get music
        this.music = new Music(this.cache.getJSON("music"));
        // Get the instrument information.
        this.instrument = new Instrument(this.music.getInstrument());
    }

    destroy() : void {
        this.instrument = this.music = null;
    }

    update() : void {
    }

}    
