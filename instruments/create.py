# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		create.py
#		Purpose:	Create array of supported harmonicas
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

from harmonica import *
from diatonic import *

#
#		Diatonic keys advised by Lee Oskar
#
diatonicList = 		[ "C","A","G","D","E","F","Bb","Eb" ]
diatonicOffset =	[  0 , 9 , 7,  2,  4,  5,  10,  3   ]


harmonicas = []
#
#		Create all the diatonics
#
for i in range(0,len(diatonicList)):
	h1 = DiatonicHarmonica(diatonicList[i],diatonicOffset[i])
	harmonicas.append(h1.render())

info = "["+",".join(harmonicas)+"]"
#print(info+"\n\n")

#
#		This one is used to get information in Python format.
#
h = open("instrumentinfo.py","w")
h.write("class InstrumentInfo(object):\n")
h.write("\tdef getRawInfo(self):\n")
h.write("\t\treturn "+info+"\n\n")