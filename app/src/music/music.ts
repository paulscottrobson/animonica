/// <reference path="../../lib/phaser.comments.d.ts"/>

/**
 * This class represents a single piece of music.
 * 
 * @class Music
 */
class Music {

    private json:any;
    private bars:Bar[];
    private instrument:Instrument;
    constructor(json:any) {
        this.json = json;
        // Empty bar
        this.bars = [];
        // Get the instrument information.
        this.instrument = new Instrument(this.getInstrumentName());
                
        // Add bars
        for (var bDef of json.bars) {
            this.bars.push(new Bar(bDef,this));
        }
    }
    /**
     * Get name
     * 
     * @returns {string} 
     * @memberof Music
     */
    getTitle(): string {
        return this.json.title;
    }
    /**
     * Get the instrument descriptor.
     * 
     * @returns {Instrument} 
     * @memberof Music
     */
    getInstrument():Instrument {
        return this.instrument;
    }
    /**
     * Get internal instrument name
     * 
     * @returns {string} 
     * @memberof Music
     */
    getInstrumentName(): string {
        return this.json.harmonica;
    }
    /**
     * Get beats in each bar.
     * 
     * @returns {number} 
     * @memberof Music
     */
    getBeats(): number {
        return parseInt(this.json.beats,10);
    }
    /**
     * Get standard tempo in beats/minute
     * 
     * @returns {number} 
     * @memberof Music
     */
    getDefaultTempo(): number {
        return parseInt(this.json.tempo,10);
    }
    /**
     * Get the number of bars
     * 
     * @returns {number} 
     * @memberof Music
     */
    getBarCount():number {
        return this.bars.length;
    }
    /**
     * Get a specific bar.
     * 
     * @param {number} n 
     * @returns {Bar} 
     * @memberof Music
     */
    getBar(n:number):Bar {
        return this.bars[n];
    }
}