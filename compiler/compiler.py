import re

class CompilerException(Exception):
	pass

class HarmonicaCompiler(object):

	def __init__(self):
		pass
	#
	#		Compile a source file into a valid query string
	#
	def compile(self,sourceFile):
		src = [x.replace("\t"," ") for x in open(sourceFile).readlines()]				# read file
		src = [x if x.find("//") < 0 else x[:x.find("//")] for x in src]				# remove comments
		src = [x.strip().lower() for x in src if x.strip() != ""]						# remove blanks,strip

		self.keys = { "title":"unknown","beats":"4","tempo":"100","key":"c" }	  		# defaults
		self.keys["harmonica"] = "diatonic"																
		for ctrl in [x for x in src if x.find(":=") >= 0]:								# process keys
			ctrl = [x.strip() for x in ctrl.split(":=")]
			if len(ctrl) != 2:
				raise CompilerException("Bad assignment")
			self.keys[ctrl[0]] = ctrl[1].replace(" ","-")

		src = "|".join([x for x in src if x.find(":=") < 0])							# single note string
		self.bars = []
		for barDef in [x.strip() for x in src.upper().split("|")]:						# do each bar in turn
			if barDef != "":
				self.bars.append(self.barCompile(barDef))
		self.keys["music"] = "-".join(self.bars)										# store music 
		qstring = "&".join(key+"="+self.keys[key] for key in self.keys)					# build query string
		print(qstring)		
	#
	#		Compile a single bar
	#
	def barCompile(self,barInfo):
		qbPos = 0																		# QuarterBeat position
		barDef = ""
		for barPart in [x for x in barInfo.split(" ") if x != ""]:						# look at components
			m = re.match("^(\\-?[\\&0-9]+)(B*)([O\\.\\-\\=]*)$",barPart)
			if m is None:
				raise CompilerException("Syntax Error "+barPart.lower())
			if m.group(1) != "&":														# note, not rest
				noteID = self.posToNote(int(m.group(1)),len(m.group(2)))				# which note from action+bend
				noteLength = self.lengthToQBeats(m.group(3))							# length
				print(barPart,noteID,noteLength,qbPos)
				qbPos += noteLength														# update pos
				barDef += "{0:02}".format(noteID)+chr(noteLength+97)					# add descriptor
			else:
				noteLength = self.lengthToQBeats(m.group(3))							# how long to rest
				print(barPart,"Rest",noteLength,qbPos)	
				qbPos += noteLength														# update pos
				barDef += "00"+chr(noteLength+97)										# add descriptor
		if qbPos > int(self.keys["beats"] * 4):											# exceeded # beatas
			raise CompilerException("Bar too long")
		return(barDef)
	#
	#		Convert a position (blow/draw 1-10) and bend to a noteID where C4 = 1
	#
	def posToNote(self,pos,bends):
		note = HarmonicaCompiler.BLOWNOTES[pos-1] if pos > 0 else HarmonicaCompiler.DRAWNOTES[abs(pos)-1]		
		if bends > HarmonicaCompiler.MAXBEND[abs(pos)-1]:
			raise CompilerException("Cannot bend note that much")
		return note - bends
	#
	#		Convert a series of length operators o - = . to qb length
	#
	def lengthToQBeats(self,lenDef):
		length = 4
		for c in lenDef:
			if c == "=":
				length -= 3
			if c == "-":
				length -= 2
			if c == "O":
				length += 4
			if c == ".":
				length = int(length*3/2)
		return length
# 								1	2	3	4	5	6	7	8	9	10
HarmonicaCompiler.BLOWNOTES = [ 1,	5,  8,  13, 17, 20,	25, 29, 32,	37 ]
HarmonicaCompiler.DRAWNOTES = [ 2,  8,  11, 15, 18, 22, 24, 27, 31, 34 ]
HarmonicaCompiler.MAXBEND   = [ 1,	2,	3,	1,	0,	1,	0,	1,	1,	2  ]

hc = HarmonicaCompiler()
hc.compile("redriver.harp")