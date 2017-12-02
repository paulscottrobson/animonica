/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IRenderManager {
    /**
     * Create the foreground graphics.
     * 
     * @memberof IRenderManager
     */
    createBackground():void;
    /**
     * Create the background graphics
     * 
     * @memberof IRenderManager
     */
    createForeground():void;
    /**
     * Update any background graphics
     * 
     * @memberof IRenderManager
     */
    updateBackground():void;
    /**
     * Update any foreground graphics
     * 
     * @memberof IRenderManager
     */
    updateForeground():void;
    /**
     * Move the display so the given bar position is highlighted..
     * 
     * @param {number} barPosition Fractional bar position in music.
     * @memberof IRenderManager
     */
    moveTo(barPosition:number):void;
    /**
     * Destroy the render manager background/foreground etc.
     * 
     * @memberof IRenderManager
     */
    destroy():void;
}