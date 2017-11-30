/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * Represents a single bar.
 * 
 * @class Bar
 */
class Bar {
    private notes:Note[];

    constructor(barDef:string) {
        this.notes = [];
        var qbTime:number = 0;
        for (var nDef of barDef.split(";")) {
            if (nDef != "") {
                var note:Note = new Note(nDef,qbTime);
                qbTime = qbTime + note.getQBLength();
                this.notes.push(note);
            }
        }
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