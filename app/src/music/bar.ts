/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Represents a single bar.
 * 
 * @class Bar
 */
class Bar {
    private notes:Note[];
    private music:Music;

    constructor(barDef:string,music:Music) {
        this.notes = [];
        this.music = music;
        var qbTime:number = 0;
        for (var nDef of barDef.split(";")) {
            if (nDef != "") {
                var note:Note = new Note(nDef,qbTime,this);
                qbTime = qbTime + note.getQBLength();
                this.notes.push(note);
            }
        }
    }
    /**
     * Get owning music object
     * 
     * @returns {Music} 
     * @memberof Bar
     */
    getMusic():Music {
        return this.music;
    }
    /**
     * Get the number of notes in this bar.
     * 
     * @returns {number} 
     * @memberof Bar
     */
    getNoteCount():number {
        return this.notes.length;
    }
    /**
     * Get a specific note in the bar.
     * 
     * @param {number} n 
     * @returns {Note} 
     * @memberof Bar
     */
    getNote(n:number):Note {
        return this.notes[n];
    }
}