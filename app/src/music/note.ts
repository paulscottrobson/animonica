/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Represents a single note.
 * 
 * @class Note
 */
class Note {

    private noteID:number;
    private qbStart:number;
    private qbLength:number;

    constructor(nDef:string,qbTime:number) {
        this.qbStart = qbTime;
        this.qbLength = nDef.charCodeAt(nDef.length-1)-96;
        this.noteID = parseInt(nDef.substr(0,nDef.length-1),10);
        //console.log(nDef,this.noteID,this.qbStart,this.qbLength);
    }

    /**
     * Get note ID, C0 = 0 = Reset
     * 
     * @returns {number} 
     * @memberof Note
     */
    public getNoteID():number {
        return this.noteID;
    }
    /**
     * Get start time in quarterbeats
     * 
     * @returns {number} 
     * @memberof Note
     */
    public getQBStart():number {
        return this.qbStart;
    }
    /**
     * Get end time in quarterbeats
     * 
     * @returns {number} 
     * @memberof Note
     */
    public getQBEnd():number {
        return this.qbStart+this.qbLength;
    }
    /**
     * Get length in quarterbeats
     * 
     * @returns {number} 
     * @memberof Note
     */
    public getQBLength():number {
        return this.qbLength;
    }
    /**
     * Check if the note is a rest.
     * 
     * @returns {boolean} 
     * @memberof Note
     */
    public isRest():boolean {
        return this.noteID == 0;
    }
}