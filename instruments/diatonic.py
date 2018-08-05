# ***************************************************************************************************
# ***************************************************************************************************#
#
#		Name : 		diatonic.py
#		Purpose:	Diatonic Harmonica Classes
#		Date : 		5th August 2018
#		Author :	Paul Robson (paul@robsons.org.uk)
#
# ***************************************************************************************************
# ***************************************************************************************************#

class DiatonicHarmonica(object):
	#
	#		Initialise. The parameter is the semitonal offset so you can easily create 
	#		harmonicas in different keys.
	#
	def __init__(self,semitonalOffset = 0):
		self.semitonalOffset = semitonalOffset							# save offset
		self.keys = "C,C#,D,Eb,E,F,F#,G,G#,A,Bb,B".split(",")			# list of keys
		print(self.keys)
		self.blowNotes = "C4,E4,G4,C5,E5,G5,C6,E6,G6,C7".split(",")		# blow notes.
		self.drawNotes = "D4,G4,B4,D5,F5,A5,B5,D6,F6,A6".split(",")		# draw notes
		self.bends = "-1,-2,-3,-1,0,-1,0,1,1,2".split(",")				# bends (see image in instruments.docx)
	#
	#		Get the short name, this will operate as a unique key.
	#	
	def getShortName(self):
		return self.keys[self.semitonalOffset]+"DIAT"
	#
	#		Get the longer descriptive name
	#
	def getLongName(self):
		return "Diatonic Harmonica in "+self.keys[self.semitonalOffset]
	#
	#		Does not have chromatic button
	#
	def hasChromaticButton(self):
		return False
	#
	#		Get the number of holes
	#
	def getHoleCount(self):
		return 10
	#
	#		Get blow and draw notes as an offset. Note holes are 1-10 not 0-9
	#
	def getBlowNote(self,hole):
		return self.noteToOffset(self.blowNotes[hole-1]) + self.semitonalOffset
	#
	def getDrawNote(self,hole):
		return self.noteToOffset(self.drawNotes[hole-1]) + self.semitonalOffset
	#
	#		Get the highest bend on the given hole - the maximum semitone adjustment
	#
	def getHighestBend(self,hole):
		return int(self.bends[hole-1])
	#
	#		Utility methods, converts a note text description to an offset from C4 and vice versa
	#
	def noteToOffset(self,noteName):
		return DiatonicHarmonica.CONV[noteName[:-1]] + (int(noteName[-1]) - 4) * 12 + 1
	#
	def offsetToName(self,noteID):
		noteID = noteID - 1
		return self.keys[noteID % 12] + str((int(noteID/12)+4))


DiatonicHarmonica.CONV = { "C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11, \
						   "DB":1,"EB":3,"GB":6,"AB":8,"BB":10 }

if __name__ == "__main__":
	hm = DiatonicHarmonica(0)
	print(hm.getShortName())
	print(hm.getLongName())	
	print(hm.getHoleCount())
	print(hm.hasChromaticButton())
	for i in range(1,hm.getHoleCount()+1):
		blowNote = hm.getBlowNote(i)
		drawNote = hm.getDrawNote(i)
		bend = ["None"]
		highBend = hm.getHighestBend(i)
		if highBend != 0:
			currentBend = blowNote if highBend > 0 else drawNote
			bend = []
			for i in range(0,abs(highBend)):
				currentBend -= 1
				bend.append(hm.keys[(currentBend+11) % 12])

		print("{0:2} : Blow:{3:3} ({1:2})  Draw:{4:3} ({2:2}) Bend:{5}". \
				format(i,blowNote,drawNote,hm.offsetToName(blowNote),hm.offsetToName(drawNote)," ".join(bend)))