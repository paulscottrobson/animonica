/// <reference path="../../lib/phaser.comments.d.ts"/>

class Harmonica extends Phaser.Group {

    private instrument:Instrument;
    private holeSize:number;

    constructor(game:Phaser.Game,music:Music) {
        super(game);
        this.instrument = music.getInstrument();
        this.holeSize = Math.floor((game.width - 64) / (this.instrument.getHoleCount()+2));
        for (var n = 0;n < this.instrument.getHoleCount();n++) {
            var img:Phaser.Image = game.add.image(this.getXOffset(n),0,"sprites","hole",this);
            img.width = img.height = this.holeSize;
            img.anchor.x = img.anchor.y = 0.5;
        }
        var bodyColour:number = 0x004080;
        for (var m:number = -1;m <= 1;m = m + 2) {
            var img:Phaser.Image = game.add.image(0,m*this.holeSize/2,"sprites","rectangle",this);
            img.width = this.instrument.getHoleCount()*this.holeSize+this.holeSize/2;
            img.height = this.holeSize / 5;img.anchor.x = 0.5;
            img.tint = bodyColour;img.anchor.y = (m < 0) ? 1 : 0;
            var x:number = this.instrument.getHoleCount()*m*this.holeSize/2;
            var img:Phaser.Image = game.add.image(x,0,"sprites","rectangle",this);
            img.width = this.holeSize / 4;img.tint = bodyColour;
            img.height = this.holeSize + this.holeSize * 2 / 5;
            img.anchor.x = (m < 0) ? 1 : 0;img.anchor.y = 0.5;
            x = x + m * this.holeSize / 4;
            var img:Phaser.Image = game.add.image(x,0,"sprites","rectangle",this);
            img.width = this.holeSize / 2;img.tint = bodyColour;
            img.height = this.holeSize / 2;
            img.anchor.x = (m < 0) ? 1 : 0;img.anchor.y = 0.5;
        }
        var img:Phaser.Image = this.game.add.image(0,0,"sprites","rectangle",this);
        img.height = 400;img.width = 1;        
        img.anchor.x = img.anchor.y = 0.5;
        this.moveTo(game.width/2,game.height/2);
    }

    destroy(): void {
        super.destroy();
        this.instrument = null;
    }

    /**
     * Reposition harmonica
     * 
     * @param {number} x 
     * @param {number} y 
     * @memberof Harmonica
     */
    moveTo(x:number,y:number): void {
        this.x = x;this.y = y;
    }

    /**
     * Get position of centre hole.
     * 
     * @param {number} holeID from 1..10 for example
     * @returns {number} 
     * @memberof Harmonica
     */
    getHoleCentreX(holeID:number):number {
        return this.x + this.getXOffset(holeID-1);
    }

    /**
     * Get Y position of centre hole
     * 
     * @returns {number} 
     * @memberof Harmonica
     */
    getHoleCentreY():number {
        return this.y;
    }

    private getXOffset(holeID:number):number {
        return (holeID - this.instrument.getHoleCount()/2 + 0.5) * this.holeSize;
    }
}