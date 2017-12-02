/// <reference path="../../lib/phaser.comments.d.ts"/>

abstract class BaseRenderManager implements IRenderManager {

    protected game:Phaser.Game;
    protected music:Music;

    constructor(game:Phaser.Game,music:Music) {
        this.game = game;this.music = music;
        this.createBackground();
        this.createForeground();
        this.updateBackground();
        this.updateForeground();
    }

    destroy(): void {
        this.music = null;
    }

    abstract createBackground();
    abstract createForeground();
    abstract updateBackground();
    abstract updateForeground();
    abstract moveTo(barPosition: number);

}