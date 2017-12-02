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
    private noteName:string;
    private bar:Bar;

    constructor(nDef:string,qbTime:number,bar:Bar) {
        this.qbStart = qbTime;
        this.qbLength = nDef.charCodeAt(nDef.length-1)-96;
        this.noteID = parseInt(nDef.substr(0,nDef.length-1),10);
        this.bar = bar;
        this.noteName = Note.getNoteName(this.noteID);
        var ins:Instrument = this.getBar().getMusic().getInstrument();
        // console.log(nDef,this.noteName,this.noteID,this.qbStart,this.qbLength);
        // console.log(ins.canPlay(this.noteID),ins.getNotePlayInfo(this.noteID));
        // check we can actually play this. 
        if (!this.isRest()) {
            if (!ins.canPlay(this.noteID)) {
                throw "Cannot play note "+(this.noteID.toString())+" ("+
                    Note.getNoteName(this.noteID)+") cannot be played by instrument"
            }
        }        
    }

    /**
     * Get owning bar.
     * 
     * @returns {Bar} 
     * @memberof Note
     */
    public getBar(): Bar {
        return this.bar;
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

    /**
     * Convert note ID to Name
     * 
     * @static
     * @param {number} noteID 
     * @returns {string} 
     * @memberof Note
     */
    public static getNoteName(noteID:number): string {
        if (noteID == 0) return "rest"
        return Note.NAMES[noteID%12] + Math.floor(noteID/12).toString();
    }

    private static NAMES:string[] = [
        "c","c#","d","d#","e","f","f#","g","g#","a","a#","b"
    ];
}