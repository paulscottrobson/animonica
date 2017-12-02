# *************************************************************************
#
#								Compiler
#
# *************************************************************************

from harmonica import Harmonica,HarmonicaException
from diatonic import DiatonicHarmonica
from tunejson import TuneJSON 
import re,os,sys

class Compiler:
	def __init__(self,instrument = DiatonicHarmonica()):
		self.instrument = instrument 
	#
	#	Compile a single file, can trigger Harmonica Exception.
	#
	def compileBase(self,sourceFile):		
		self.json = TuneJSON()
		self.sourceFile = sourceFile
		self.name = sourceFile.replace(".harmonica","").split(os.sep)[-1].strip().replace(" ","_").lower()
		self.lineNumber = 0
		# read file in.
		h = open(sourceFile)
		if h is None:
			raise HarmonicaException("Source file not found "+sourceFile)
		self.src = [x.replace("\t"," ").lower() for x in h.readlines()]
		h.close()
		self.src = [x if x.find("//") < 0 else x[:x.find("//")] for x in self.src]
		self.src = [x.strip() for x in self.src]
		for i in range(0,len(self.src)):
			self.lineNumber = i + 1
			defn = self.src[i]
			if defn.find(":=") >= 0:
				m = re.match("^([a-z]+)\s*\:\=\s*(.*?)\s*$",defn)
				if m is None:
					raise HarmonicaException("Bad assignment "+defn)
				self.json.setSetting(m.group(1).strip(),m.group(2).strip())
			else:
				for barDef in [x.strip() for x in defn.split("|") if x.strip() != ""]:
					#print("--------	")
					self.json.addBar()
					for noteDef in [x.strip() for x in barDef.split(" ") if x.strip() != ""]:
						self.compileNote(noteDef)
	#
	#	Compile a single note
	#
	def compileNote(self,noteDef):
		originalDef = noteDef
		if noteDef[0] == "&":
			# & is a rest, which is encoded as note zero.
			noteDef = noteDef[1:]
			noteID = 0
		else:
			isBlow = True
			# check for preceding + or -
			if noteDef[0] == '+' or noteDef[0] == '-':
				isBlow = (noteDef[0] == '+')
				noteDef = noteDef[1:]
			# look for the number, which is 1-10.
			m = re.match("^(\d+)(.*)$",noteDef)
			if m is None:
				raise HarmonicaException("Missing note number '"+originalDef+"'")
			holeNumber = int(m.group(1))
			if holeNumber < 1 or holeNumber > self.instrument.getHoleCount():
				raise HarmonicaException("Bad hole number '"+originalDef+"'")
			# look after hole and check for bending.
			noteDef = m.group(2)
			bendCount = 0
			while noteDef != "" and noteDef[0] == "^":
				bendCount += 1
				noteDef = noteDef[1:]
			noteID = self.instrument.getNote(holeNumber,isBlow,bendCount,False)
		# Now work out the note lengths:
		noteLength = 4 
		if re.match("^[-=.o]*$",noteDef) is None:
			raise HarmonicaException("Bad note length modifier '"+originalDef+"'")
		for nMod in noteDef:
			if nMod == 'o':
				noteLength += 4
			if nMod == '-':
				noteLength -= 2
			if nMod == '=':
				noteLength -= 3
			if nMod == '.':
				noteLength = int(noteLength * 3 / 2)
		#print(originalDef,noteID,Harmonica.noteIDToName(noteID),noteLength)
		# Add to the bar
		self.json.addNoteEvent(noteID,noteLength)
	#
	#	Error trapped compile
	#
	def compile(self,sourceFile):
		try:
			self.compileBase(sourceFile)
		except HarmonicaException as he:
			print("Error: {0}({1}) {2}".format(self.sourceFile,self.lineNumber,he.message))
			sys.exit(1)
	#
	#	Write result out.
	#
	def write(self,targetFile):
		h = open(targetFile,"w")
		h.write(cm.json.render(cm.name.replace("_"," ")))	
		h.close()

if __name__ == '__main__':
	cm = Compiler()
	cm.compile("./Oh Danny Boy.harmonica")
	print(cm.json.render(cm.name.replace("_"," ")))
	cm.write("../app/music.json")
#	js.addBar()
#	for i in range(0,4):
#		js.addNoteEvent(48+i*2,4)
#	js.addBar()
#	for i in range(0,8):
#		js.addNoteEvent(62-i,2)
#	print(js.render())
#	h = open("../app/music.json","w").write(js.render())
	