/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Main game state
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    private music:Music;

    create() : void {
        // Set up configuration
        Config.setup(this.game);
        // Get music
        this.music = new Music(this.cache.getJSON("music"));
        //
        var h:Harmonica = new Harmonica(this.game,this.music);
        for (var n = 1;n <= 10;n++) {
            var i:Phaser.Image = this.game.add.image(h.getHoleCentreX(n),h.getHoleCentreY(),"sprites","rectangle");
            i.width = 2;i.height = 100;
        }
    }

    destroy() : void {
        this.music = null;
    }

    update() : void {
    }

}    
