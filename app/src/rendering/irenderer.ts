/// <reference path="../../lib/phaser.comments.d.ts"/>

interface IRenderer {
    /**
     * Move the display so the given bar position is highlighted..
     * 
     * @param {number} barPosition Fractional bar position in music.
     * @memberof IRenderManager
     */
    moveTo(barPosition:number):void;
    /**
     * Create renderer graphics
     * 
     * @memberof IRenderer
     */
    createRenderGraphics():void;
    /**
     * Destroy renderer graphics
     * 
     * @memberof IRenderer
     */
    destroyRenderGraphics():void;
    /**
     * True if this rendered graphic is visible at its current position.
     * 
     * @returns {boolean} 
     * @memberof IRenderer
     */
    isVisible():boolean;
}