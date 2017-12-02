/// <reference path="../../../lib/phaser.comments.d.ts"/>

class ZoomRenderManager extends BaseRenderManager implements IRenderManager {
    createBackground(): void {
        throw new Error("Method not implemented.");
    }
    createForeground(): void {
        throw new Error("Method not implemented.");
    }
    updateBackground(): void {
        throw new Error("Method not implemented.");
    }
    updateForeground(): void {
        throw new Error("Method not implemented.");
    }
    moveTo(barPosition: number): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        super.destroy();
        // TODO: Delete FGR,BGR
        throw new Error("Method not implemented.");
    }
    
}