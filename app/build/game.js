var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Config = (function () {
    function Config() {
    }
    Config.setup = function (game) {
        Config.width = game.width;
        Config.height = game.height;
    };
    return Config;
}());
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.create = function () {
        Config.setup(this.game);
        this.music = new Music(this.cache.getJSON("music"));
        var h = new Harmonica(this.game, this.music);
        for (var n = 1; n <= 10; n++) {
            var i = this.game.add.image(h.getHoleCentreX(n), h.getHoleCentreY(), "sprites", "rectangle");
            i.width = 2;
            i.height = 100;
        }
    };
    MainState.prototype.destroy = function () {
        this.music = null;
    };
    MainState.prototype.update = function () {
    };
    return MainState;
}(Phaser.State));
var Instrument = (function () {
    function Instrument(name) {
        var def = InstrumentFactory.getInstrumentData(name);
        var defs = def.split("/");
        this.name = defs[0];
        this.holes = parseInt(defs[1], 10);
        this.hasSlide = defs[2] == "Y";
        this.noteInfo = {};
        for (var n = 3; n < defs.length; n++) {
            this.makeInfo(defs[n]);
        }
    }
    Instrument.prototype.makeInfo = function (def) {
        var items = def.split(":");
        var entry = {};
        entry["noteid"] = parseInt(items[0], 10);
        entry["action"] = items[1].toLowerCase();
        entry["hole"] = parseInt(items[2], 10);
        entry["slide"] = items[3] == "S";
        entry["bend"] = parseInt(items[4], 10);
        this.noteInfo[entry["noteid"]] = entry;
    };
    Instrument.prototype.getNotePlayInfo = function (noteID) {
        return this.noteInfo[noteID];
    };
    Instrument.prototype.canPlay = function (noteID) {
        return (this.noteInfo[noteID] != undefined);
    };
    Instrument.prototype.getName = function () {
        return this.name;
    };
    Instrument.prototype.getHoleCount = function () {
        return this.holes;
    };
    Instrument.prototype.isSlidePresent = function () {
        return this.hasSlide;
    };
    return Instrument;
}());
var InstrumentFactory = (function () {
    function InstrumentFactory() {
    }
    InstrumentFactory.getInstrumentData = function (name) {
        name = name.replace("(", "").replace(")", "").toLowerCase();
        return instrument_diatonicc4.information;
    };
    return InstrumentFactory;
}());
var instrument_diatonicc4 = (function () {
    function instrument_diatonicc4() {
    }
    instrument_diatonicc4.information = "diatonicc4/10/N/53:D:2:X:2/65:D:5:X:0/77:D:9:X:0/59:D:3:X:0/71:D:7:X:0/74:D:8:X:0/50:D:1:X:0/62:D:4:X:0/68:D:6:X:1/56:D:3:X:3/79:B:9:X:0/67:B:6:X:0/55:B:3:X:0/54:D:2:X:1/69:D:6:X:0/57:D:3:X:2/81:D:10:X:0/64:B:5:X:0/52:B:2:X:0/76:B:8:X:0/84:B:10:X:0/72:B:7:X:0/60:B:4:X:0/48:B:1:X:0/61:D:4:X:1/49:D:1:X:1/58:D:3:X:1";
    return instrument_diatonicc4;
}());
var Bar = (function () {
    function Bar(barDef, music) {
        this.notes = [];
        this.music = music;
        var qbTime = 0;
        for (var _i = 0, _a = barDef.split(";"); _i < _a.length; _i++) {
            var nDef = _a[_i];
            if (nDef != "") {
                var note = new Note(nDef, qbTime, this);
                qbTime = qbTime + note.getQBLength();
                this.notes.push(note);
            }
        }
    }
    Bar.prototype.getMusic = function () {
        return this.music;
    };
    Bar.prototype.getNoteCount = function () {
        return this.notes.length;
    };
    Bar.prototype.getNote = function (n) {
        return this.notes[n];
    };
    return Bar;
}());
var Music = (function () {
    function Music(json) {
        this.json = json;
        this.bars = [];
        this.instrument = new Instrument(this.getInstrumentName());
        for (var _i = 0, _a = json.bars; _i < _a.length; _i++) {
            var bDef = _a[_i];
            this.bars.push(new Bar(bDef, this));
        }
    }
    Music.prototype.getTitle = function () {
        return this.json.title;
    };
    Music.prototype.getInstrument = function () {
        return this.instrument;
    };
    Music.prototype.getInstrumentName = function () {
        return this.json.harmonica;
    };
    Music.prototype.getBeats = function () {
        return parseInt(this.json.beats, 10);
    };
    Music.prototype.getDefaultTempo = function () {
        return parseInt(this.json.tempo, 10);
    };
    Music.prototype.getBarCount = function () {
        return this.bars.length;
    };
    Music.prototype.getBar = function (n) {
        return this.bars[n];
    };
    return Music;
}());
var Note = (function () {
    function Note(nDef, qbTime, bar) {
        this.qbStart = qbTime;
        this.qbLength = nDef.charCodeAt(nDef.length - 1) - 96;
        this.noteID = parseInt(nDef.substr(0, nDef.length - 1), 10);
        this.bar = bar;
        this.noteName = Note.getNoteName(this.noteID);
        var ins = this.getBar().getMusic().getInstrument();
        if (!this.isRest()) {
            if (!ins.canPlay(this.noteID)) {
                throw "Cannot play note " + (this.noteID.toString()) + " (" +
                    Note.getNoteName(this.noteID) + ") cannot be played by instrument";
            }
        }
    }
    Note.prototype.getBar = function () {
        return this.bar;
    };
    Note.prototype.getNoteID = function () {
        return this.noteID;
    };
    Note.prototype.getQBStart = function () {
        return this.qbStart;
    };
    Note.prototype.getQBEnd = function () {
        return this.qbStart + this.qbLength;
    };
    Note.prototype.getQBLength = function () {
        return this.qbLength;
    };
    Note.prototype.isRest = function () {
        return this.noteID == 0;
    };
    Note.getNoteName = function (noteID) {
        if (noteID == 0)
            return "rest";
        return Note.NAMES[noteID % 12] + Math.floor(noteID / 12).toString();
    };
    Note.NAMES = [
        "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"
    ];
    return Note;
}());
window.onload = function () {
    var game = new HarmonicaTabApplication();
};
var HarmonicaTabApplication = (function (_super) {
    __extends(HarmonicaTabApplication, _super);
    function HarmonicaTabApplication() {
        var _this = _super.call(this, 600, 800, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Boot", new BootState());
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new MainState());
        _this.state.start("Boot");
        return _this;
    }
    HarmonicaTabApplication.getURLName = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var name = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key.toLowerCase()).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return (name == "") ? defaultValue : name;
    };
    return HarmonicaTabApplication;
}(Phaser.Game));
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.preload = function () {
        var _this = this;
        this.game.load.image("loader", "assets/sprites/loader.png");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Preload", true, false, 1); }, this);
    };
    BootState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.stage.backgroundColor = "#000000";
        var loader = this.add.sprite(this.game.width / 2, this.game.height / 2, "loader");
        loader.width = this.game.width * 9 / 10;
        loader.height = this.game.height / 8;
        loader.anchor.setTo(0.5);
        this.game.load.setPreloadSprite(loader);
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        for (var _i = 0, _a = ["font"]; _i < _a.length; _i++) {
            var fontName = _a[_i];
            this.game.load.bitmapFont(fontName, "assets/fonts/" + fontName + ".png", "assets/fonts/" + fontName + ".fnt");
        }
        for (var i = 1; i <= PreloadState.NOTE_COUNT; i++) {
            var sound = i.toString();
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3",
                "assets/sounds/" + sound + ".ogg"]);
        }
        this.game.load.audio("metronome", ["assets/sounds/metronome.mp3",
            "assets/sounds/metronome.ogg"]);
        var src = HarmonicaTabApplication.getURLName("music", "music.json");
        this.game.load.json("music", HarmonicaTabApplication.getURLName("music", src));
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
    };
    PreloadState.NOTE_COUNT = 37;
    return PreloadState;
}(Phaser.State));
var BaseRenderer = (function () {
    function BaseRenderer() {
    }
    return BaseRenderer;
}());
var BaseRenderManager = (function () {
    function BaseRenderManager(game, music) {
        this.game = game;
        this.music = music;
    }
    BaseRenderManager.prototype.destroy = function () {
        this.music = null;
    };
    return BaseRenderManager;
}());
var Harmonica = (function (_super) {
    __extends(Harmonica, _super);
    function Harmonica(game, music) {
        var _this = _super.call(this, game) || this;
        _this.instrument = music.getInstrument();
        _this.holeSize = Math.floor((game.width - 64) / (_this.instrument.getHoleCount() + 2));
        for (var n = 0; n < _this.instrument.getHoleCount(); n++) {
            var img = game.add.image(_this.getXOffset(n), 0, "sprites", "hole", _this);
            img.width = img.height = _this.holeSize;
            img.anchor.x = img.anchor.y = 0.5;
        }
        var bodyColour = 0x004080;
        for (var m = -1; m <= 1; m = m + 2) {
            var img = game.add.image(0, m * _this.holeSize / 2, "sprites", "rectangle", _this);
            img.width = _this.instrument.getHoleCount() * _this.holeSize + _this.holeSize / 2;
            img.height = _this.holeSize / 5;
            img.anchor.x = 0.5;
            img.tint = bodyColour;
            img.anchor.y = (m < 0) ? 1 : 0;
            var x = _this.instrument.getHoleCount() * m * _this.holeSize / 2;
            var img = game.add.image(x, 0, "sprites", "rectangle", _this);
            img.width = _this.holeSize / 4;
            img.tint = bodyColour;
            img.height = _this.holeSize + _this.holeSize * 2 / 5;
            img.anchor.x = (m < 0) ? 1 : 0;
            img.anchor.y = 0.5;
            x = x + m * _this.holeSize / 4;
            var img = game.add.image(x, 0, "sprites", "rectangle", _this);
            img.width = _this.holeSize / 2;
            img.tint = bodyColour;
            img.height = _this.holeSize / 2;
            img.anchor.x = (m < 0) ? 1 : 0;
            img.anchor.y = 0.5;
        }
        var img = _this.game.add.image(0, 0, "sprites", "rectangle", _this);
        img.height = 400;
        img.width = 1;
        img.anchor.x = img.anchor.y = 0.5;
        _this.moveTo(game.width / 2, game.height / 2);
        return _this;
    }
    Harmonica.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.instrument = null;
    };
    Harmonica.prototype.moveTo = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Harmonica.prototype.getHoleCentreX = function (holeID) {
        return this.x + this.getXOffset(holeID - 1);
    };
    Harmonica.prototype.getHoleCentreY = function () {
        return this.y;
    };
    Harmonica.prototype.getXOffset = function (holeID) {
        return (holeID - this.instrument.getHoleCount() / 2 + 0.5) * this.holeSize;
    };
    return Harmonica;
}(Phaser.Group));
var ZoomRenderer = (function (_super) {
    __extends(ZoomRenderer, _super);
    function ZoomRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomRenderer.prototype.isVisible = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderer.prototype.moveTo = function (barPosition) {
        throw new Error("Method not implemented.");
    };
    ZoomRenderer.prototype.createRenderGraphics = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderer.prototype.destroyRenderGraphics = function () {
        throw new Error("Method not implemented.");
    };
    return ZoomRenderer;
}(BaseRenderer));
var ZoomRenderManager = (function (_super) {
    __extends(ZoomRenderManager, _super);
    function ZoomRenderManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomRenderManager.prototype.createBackground = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderManager.prototype.createForeground = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderManager.prototype.updateBackground = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderManager.prototype.updateForeground = function () {
        throw new Error("Method not implemented.");
    };
    ZoomRenderManager.prototype.moveTo = function (barPosition) {
        throw new Error("Method not implemented.");
    };
    ZoomRenderManager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        throw new Error("Method not implemented.");
    };
    return ZoomRenderManager;
}(BaseRenderManager));
