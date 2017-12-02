/// <reference path="../../../lib/phaser.comments.d.ts"/>

class ZoomRenderManager extends BaseRenderManager implements IRenderManager {

    private harmonica:Harmonica;
    private bgrGroup:Phaser.Group;

    createBackground(): void {
        this.bgrGroup = new Phaser.Group(this.game);
    }

    createForeground(): void {
       this.harmonica = new Harmonica(this.game,this.music);
       this.harmonica.moveTo(this.game.width / 2,this.game.height * 0.9);

       // We put the lines in here because we need the harmonica.
       for (var h = 1;h <= 10;h++) {
           /*
           for (var y = 0;y < 1000;y += 20) {
                var img:Phaser.Image = this.game.add.image(this.xc(h,y),this.yc(y),"sprites","rectangle");
                img.width = img.height = 5;                
                img.anchor.x = img.anchor.y = 0.5;img.tint = 0xFF8000;
           }
           */
           var line:Phaser.Image = this.game.add.image(this.xc(h,0),this.yc(0),"sprites","rail",this.bgrGroup);
           var dy:number = this.yc(0)-this.yc(1000);
           var dx:number = this.xc(h,0)-this.xc(h,1000)
           line.width = 5;
           line.height = Math.sqrt(dx*dx+dy*dy);
           line.anchor.x = 0.5;line.anchor.y = 1;
           var angle:number = Math.atan2(dy,dx);
           line.rotation = angle - Math.PI/2;
       }
    }

    updateBackground(): void {
        this.game.world.sendToBack(this.bgrGroup);
    }
    updateForeground(): void {      
        this.game.world.bringToTop(this.harmonica);
    }

    moveTo(barPosition: number): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        super.destroy();
        // TODO: Delete FGR,BGR        
        this.bgrGroup.destroy();
        this.harmonica.destroy();
        this.bgrGroup = this.harmonica = null;
    }
    
    xc(hole:number,y:number) {
        var x:number = this.harmonica.getHoleCentreX(hole) - this.game.width / 2;
        var s:number = 1 - y / 1150;
        return s * x + this.game.width / 2 ;
    }
    yc(y:number) {
        return this.harmonica.getHoleCentreY()-y/1000*this.game.height*0.8;
    }
}