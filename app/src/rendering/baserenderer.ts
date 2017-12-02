/// <reference path="../../lib/phaser.comments.d.ts"/>

abstract class BaseRenderer implements IRenderer {

    abstract moveTo(barPosition: number);
    abstract createRenderGraphics();
    abstract destroyRenderGraphics();
    abstract isVisible();

}