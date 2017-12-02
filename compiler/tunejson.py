# *************************************************************************
#
#								Tune Storage
#
# *************************************************************************

from diatonic import DiatonicHarmonica
from harmonica import Harmonica,HarmonicaException 

class TuneJSON:
	def __init__(self):
		self.settings = { "title":"","beats":"4","tempo":"100","harmonica":"diatonic(c4)" }
		self.bars = []
	#
	#	Access/Updaters
	#
	def getSetting(self,key):
		key = key.lower().strip()
		if key not in self.settings:
			raise HarmonicaException("Key unknown "+key)
		return self.settings[key]
	def setSetting(self,key,value):
		key = key.lower().strip()
		if key not in self.settings:
			raise HarmonicaException("Key unknown "+key)
		self.settings[key] = value.lower().strip()
	def getBeats(self):
		return int(self.settings["beats"],10)		
	#
	#	Add a new bar
	#
	def addBar(self):
		self.bars.append([])
		self.qbLength = 0
	#
	#	Add a new note event
	#
	def addNoteEvent(self,noteID,qbLength):
		note = { "id":noteID,"start":self.qbLength,"length":qbLength,"name":Harmonica.noteIDToName(noteID) }
		self.bars[-1].append(note)
		self.qbLength += qbLength
		if self.qbLength > self.getBeats() * 4:
			raise HarmonicaException("Bar overflow")
	#
	#	Add a rest. This is C0, code 0.
	#
	def addRest(self,qbLength):
		self.addNoteEvent(0,qbLength)
	#
	#	Render in JSON
	#	
	def render(self,defaultTitle = "no title"):
		if self.getSetting("title") == "":
			self.setSetting("title",defaultTitle)
		render = "{\n"		
		for k in self.settings.keys():
			render = render + '"{0}":"{1}",\n'.format(k,self.settings[k])
		render = render + '"bars":[\n'
		if len(self.bars) == 0:
			raise HarmonicaException("No bars in music")
		render = render +",\n".join(['    "'+self.renderBar(x)+'"' for x in self.bars])
		return render+"\n]\n}\n"
	#
	#	Render a single bar ; notes seperate by &
	#
	def renderBar(self,barInfo):		
		return ";".join([self.noteRender(x) for x in barInfo])
	#
	#	Render a single note, rendered as NoteID(digits)QBLength(letter, a = 1)
	#
	def noteRender(self,note):
		return str(note["id"])+chr(note["length"]+96)

if __name__ == '__main__':
	dh = DiatonicHarmonica()
	js = TuneJSON()
	js.addBar()
	for i in range(0,4):
		js.addNoteEvent(48+i*2,4)
	js.addBar()
	for i in range(0,8):
		js.addNoteEvent(62-i,2)
	print(js.render())
	h = open("../app/music.json","w").write(js.render())
	