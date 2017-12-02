/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This is information regarding an instance of an instrument
 * Basic information and how to play specific notes.
 * 
 * @class Instrument
 */
class Instrument {

    private name:string
    private holes:number;
    private hasSlide:boolean;
    private noteInfo:any;

    /**
     * Get information string and expand it.
     * 
     * @param {string} name 
     * @memberof Instrument
     */
    constructor(name:string) {
        // get the information string
        var def:string = InstrumentFactory.getInstrumentData(name);
        var defs:string[] = def.split("/")
        // get basic information
        this.name = defs[0];
        this.holes = parseInt(defs[1],10);
        this.hasSlide = defs[2] == "Y";
        // Get note information
        this.noteInfo = {};
        for (var n = 3;n < defs.length;n++) {
            this.makeInfo(defs[n]);
        }
        //console.log(this.noteInfo);
    }

    /**
     * Create a single record regarding how to produce a given note.
     * 
     * @private
     * @param {string} def 
     * @memberof Instrument
     */
    private makeInfo(def:string): void {
        var items:string[] = def.split(":")
        var entry:any = {}
        entry["noteid"] = parseInt(items[0],10);
        entry["action"] = items[1].toLowerCase()
        entry["hole"] = parseInt(items[2],10);
        entry["slide"] = items[3] == "S";
        entry["bend"] = parseInt(items[4],10);
        this.noteInfo[entry["noteid"]] = entry
    }

    /**
     * Get the note production information for a given note.
     * 
     * @param {number} noteID 
     * @returns {*} structure containing noteid/action/hole/slide/bend
     * @memberof Instrument
     */
    public getNotePlayInfo(noteID:number):any {
        return this.noteInfo[noteID];
    }

    /**
     * Check if a given note can be played by the instrument.
     * 
     * @param {number} noteID 
     * @returns {boolean} 
     * @memberof Instrument
     */
    public canPlay(noteID:number):boolean {
        return (this.noteInfo[noteID] != undefined);
    }

    /**
     * Return the instrument's internal name
     * 
     * @returns {string} 
     * @memberof Instrument
     */
    public getName():string {
        return this.name;
    }
    /**
     * Get the number of holes to display.
     * 
     * @returns {number} 
     * @memberof Instrument
     */
    public getHoleCount():number {
        return this.holes;
    }
    /**
     * Does this instrument have a semitone slide.
     * 
     * @returns {boolean} 
     * @memberof Instrument
     */
    public isSlidePresent():boolean {
        return this.hasSlide;
    }
}