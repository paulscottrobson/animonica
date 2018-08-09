# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		diatonic.py
#		Purpose:	Diatonic harmonica class
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

from harmonica import *

# ****************************************************************************************
#								Diatonic Harmonica Subclass
# ****************************************************************************************

class DiatonicHarmonica(Harmonica):

	def getHoleCount(self):
		return 10

	def getShortKeyName(self):
		return "{0}DIAT"

	def getLongName(self):
		return "Diatonic Harmonica {0}"

	def getDrawNote(self,hole):
		return "D4,G4,B4,D5,F5,A5,B5,D6,F6,A6".split(",")[hole-1]

	def getBlowNote(self,hole):
		return "C4,E4,G4,C5,E5,G5,C6,G6,E6,C7".split(",")[hole-1]

	def getDrawBend(self,hole):
		return [1,2,3,1,0,1,0,0,0,0][hole-1]

	def getBlowBend(self,hole):
		return [0,0,0,0,0,0,0,1,1,2][hole-1]

	def getChromaticAdjustment(self):
		return 0
