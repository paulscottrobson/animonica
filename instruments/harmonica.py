# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		harmonica.py
#		Purpose:	Base Harmonica Class
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

class Harmonica(object):
	#
	#		Initialise, setting a specific semitonal offset and key, defaults should
	#		be 'C'
	#
	def __init__(self,key = "C",keyAdjust = 0):
		self.keyAdjust = keyAdjust
		self.key = key
		self.data = [ 0 ] * (16 + 3 *self.getHoleCount())
		#
		#	Build the structure
		#
		self.data[0] = 1										# type ID
		self.data[1] = self.getShortKeyName().format(self.key).upper() # Short name
		self.data[2] = self.getLongName().format(self.key)		# Full name
		self.data[3] = self.getHoleCount()						# Number of holes
		self.data[4] = self.getChromaticAdjustment()			# Chromatic adjust (0=None)
		#
		#	Built blow,draw,bend for each hole
		#
		for i in range(1,self.getHoleCount()+1):				# For each hole pair
			base = (i - 1) * 3 + 16								# Info here.
																# Load in blow/draw with key adjust
			self.data[base] = self.noteToOffset(self.getBlowNote(i))+self.keyAdjust
			self.data[base+1] = self.noteToOffset(self.getDrawNote(i))+self.keyAdjust

			if self.getDrawBend(i) > 0:							# work out bending if anything.
				self.data[base+2] = self.getDrawBend(i)|0x04
			elif self.getBlowBend(i) > 0:
				self.data[base+2] = self.getBlowBend(i) 
	#
	#		Convert a note by name into a offset from C3 (C3 == 1)
	#
	def noteToOffset(self,note):
		assert note[1] >= '3' and note[1] <= '8'
		assert note[:-1].upper() in Harmonica.TOID
		return Harmonica.TOID[note[:-1].upper()]+12 * (int(note[1]) - 3) + 1
	#
	#		Return string representation of data
	#
	def render(self):
		items = ",".join([str(x) if isinstance(x,int) else '"'+x+'"' for x in self.data])
		return "["+items+"]"
	#
	#		Number of semitones you can draw bend hole (override)
	#
	def getDrawBend(self,hole):
		return 0

	#
	#		Number of semitones you can blow bend hole (override)
	#
	def getBlowBend(self,hole):
		return 0
	#
	#		Get semitonal offsest when sharp button pressed (0 = no chromatic button)
	#
	def getChromaticAdjustment(self):
		return 0

Harmonica.NOTES = [ "C","C#","D","D#","E","F","G","G#","A","A#","B" ]

Harmonica.TOID = { "C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11, \
				   "DB":1,"EB":3,"GB":6,"AB":8,"BB":10 }

