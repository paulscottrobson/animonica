/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Configuration information.
 * 
 * @class Config
 */
class Config {
    
    /**
     * Screen width
     * 
     * @static
     * @type {number}
     * @memberof Config
     */
    public static width:number;
    /**
     * Screen height.`
     * 
     * @static
     * @type {number}
     * @memberof Config
     */
    public static height:number
    /**
     * Set up configuration.
     * 
     * @param {Phaser.Game} game 
     * @memberof Config
     */
    public static setup(game:Phaser.Game) {
        Config.width = game.width;
        Config.height = game.height;
    }
}