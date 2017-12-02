# *************************************************************************
#
#							Classic Diatonic Harmonica
#
# *************************************************************************

from harmonica import Harmonica,HarmonicaException

class DiatonicHarmonica(Harmonica):
	#
	#	Initialise.
	#
	def __init__(self,tuning = "C4"):
		self.bendLimits = [ None,  1,2,3,1,0,1,0,0,0,0 ]
		self.instrumentName = "diatonic"+tuning.lower()
		self.createNoteMaps(tuning)
		self.createDirectory()
	#
	#	Get name
	#
	def getName(self):
		return self.instrumentName
	#
	#	Get number of displayed holes.
	#
	def getHoleCount(self):
		return 10
	#
	#	Has slide which raises a semitone
	#
	def hasSlide(self):
		return False
	#
	#	Get note number on scale for given hole, no sound => None 
	#
	def getNote(self,hole,isBlow,bendCount = 0,slide = False):
		# if blow, return the top hole.
		if isBlow:
			if bendCount > 0:
				raise HarmonicaException("Blow Bend not supported")
			return self.topRow[hole]
		# if draw, check the bend is in range.
		if bendCount > self.canBend(hole):
			return None
		# return bottom hole bent appropriately.
		return self.bottomRow[hole] - bendCount
	#
	#	Can bend a hole ? Return 0,1,2,3 according to how much.
	#		
	def canBend(self,holeNumber):
		return self.bendLimits[holeNumber]
	#
	#	Note mapping.
	#		
	def createNoteMaps(self,baseNote):
		self.topRow = [ None ] * 11
		self.bottomRow = [ None, 2,7,11,14,17,21,23,26,29,33 ]
		baseNote = self.nameToNoteID(baseNote)
		#	print(baseNote)
		for i in range(1,11):
			self.topRow[i] = ([0,4,7][(i-1)%3])+12*int((i-1)/3)+baseNote
			self.bottomRow[i] = self.bottomRow[i]+baseNote
		#self.dump()
	#
	#	Dump Harmonica Layout
	#
	def dump(self):
		top = ""
		bottom = ""
		for i in range(1,11):
			top = top + "{0:3} ".format(Harmonica.noteIDToName(self.topRow[i]))
			bottom = bottom + "{0:3} ".format(Harmonica.noteIDToName(self.bottomRow[i]))

if __name__ == '__main__':
	dh = DiatonicHarmonica()
	for i in range(34,73):
		print(i,Harmonica.noteIDToName(i),dh.findByNoteID(i))
