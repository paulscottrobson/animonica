# *************************************************************************
#
#								Base Harmonic Class
#
# *************************************************************************

class Harmonica:
	#
	#	Create the directory of available notes this instrument can play.
	#
	def createDirectory(self):
		self.noteDirectory = {}
		# first do the blow notes
		for hole in range(1,self.getHoleCount()+1):
			# blows. Not supporting top end blow bends here.
			note = self.getNote(hole,True,0)
			entry = { "hole":hole, "blow":True, "bend":0, "noteid":note  }
			self.noteDirectory[self.noteIDToName(note)] = entry
		# then do the draws in increasing amount of bendiness.
		for bend in range(0,4):
			for hole in range(1,self.getHoleCount()+1):
				# check it's actually possible.
				if self.canBend(hole) >= bend:
					note = self.getNote(hole,False,bend)
					name = self.noteIDToName(note)
					if name not in self.noteDirectory:
						entry = { "hole":hole,"blow":False,"bend":bend,"noteid":note }
						self.noteDirectory[name] = entry
						#print(hole,bend,self.noteIDToName(note))
	#
	#	Get a setup to play a specific note by name
	#
	def findByName(self,name):
		name = name.lower()
		return self.noteDirectory[name] if name in self.noteDirectory else None
	#
	#	Get a setup to play a specific note by id
	#
	def findByNoteID(self,noteID):
		return self.findByName(self.noteIDToName(noteID))
	#
	#	Convert a given note ID to a name. C0 = 0
	#
	def noteIDToName(self,noteID):
		return Harmonica.noteNames[noteID % 12] + str(int(noteID/12))
	#
	#	Convert a name to a note ID. C0 = 0
	#
	def nameToNoteID(self,name):
		return int(name[-1],10) * 12 + Harmonica.noteIDs[name[:-1].lower()]

Harmonica.noteIDs = { "c":0,"c#":1,"d":2,"d#":3,"e":4,"f":5, \
		    	      "f#":6,"g":7,"g#":8,"a":9,"a#":10,"b":11 }

Harmonica.noteNames = [ "c","c#","d","d#","e","f","f#","g","g#","a","a#","b" ]

# *************************************************************************
#
#							Classic Diatonic Harmonica
#
# *************************************************************************

class DiatonicHarmonica(Harmonica):
	#
	#	Initialise.
	#
	def __init__(self,tuning = "C3"):
		self.bendLimits = [ None,  1,2,3,1,0,1,0,0,0,0 ]
		self.createNoteMaps(tuning)
		self.createDirectory()
	#
	#	Get number of displayed holes.
	#
	def getHoleCount(self):
		return 10
	#
	#	Get note number on scale for given hole, no sound => None 
	#
	def getNote(self,hole,isBlow,bendCount = 0):
		baseID = self.topRow[hole] if isBlow else self.bottomRow[hole]
		return baseID - bendCount
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
			top = top + "{0:3} ".format(self.noteIDToName(self.topRow[i]))
			bottom = bottom + "{0:3} ".format(self.noteIDToName(self.bottomRow[i]))

if __name__ == '__main__':
	dh = DiatonicHarmonica()
	for i in range(34,73):
		print(i,dh.noteIDToName(i),dh.findByNoteID(i))