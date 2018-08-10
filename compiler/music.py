# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		music.py
#		Purpose:	Basic Music Object Classes
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

import re

# ****************************************************************************************
#									  Error reporting
# ****************************************************************************************

class MusicException(Exception):
	pass

# ****************************************************************************************
#								This class represents a bar
# ****************************************************************************************

class Bar(object):
	#
	#		Initialise the bar
	#
	def __init__(self,beats = 4,barData = ""):
		barData = barData.replace("\t"," ").strip()
		self.beats = beats 										# beats in bar
		self.qbPosition = 0 									# current position
		self.render = "" 										# current rendering
		for nData in barData.split(" "):						# copy provided bar data in.
			if nData != "":
				self.add(nData)
	#
	#		Advance the bar time position
	#
	def advance(self,quarterBeats):
		if quarterBeats < 1 and quarterBeats > 26:				# validate
			raise MusicException("Bad Quarterbeat count")
		self.qbPosition += quarterBeats 						# advance position
		self.render += chr(quarterBeats+ord('A')-1)				# adjust render
		if self.qbPosition > self.beats * 4: 					# can't go further than this.
			raise MusicException("Bar overflow")
	#
	#		Play a note in.
	#
	def play(self,hole,isDraw,bendAmount):
		#print("Adding",hole,isDraw,bendAmount)
		if hole < 1 or hole > 10 or bendAmount > 3:				# validate
			raise MusicException("Bad note data")
																# convert to hole ID
		holeRef = chr(hole+ord('m')) if isDraw else chr(hole+ord('a'))
		self.render += holeRef
		if bendAmount > 0:										# add optional bend
			self.render += str(bendAmount)
	#
	#		Add a play in in standard format 
	#
	def add(self,note):
		note = note.strip().upper().replace("&","X")			# & is rest, so becomes no strum.
		m = re.match("^(\-?[0-9X]+)(\/*)([O\.\-\=]*)$",note)	# correct format
		if m is None:
			raise MusicException("Bad note "+note.lower())
		if m.group(1) != "X":									# not a rest
			note = int(m.group(1))								# add the note play
			self.play(abs(note),note < 0,len(m.group(2)))
		length = 4 												# work out length
		for c in m.group(3):
			length += (4 if c == 'O' else 0)
			length -= (2 if c == '-' else 0)
			length -= (3 if c == '=' else 0)
			length = int(length*3/2) if c == '.' else length
		self.advance(length)									# add to time in bar
	#
	#		Get the current render
	#
	def getRender(self):
		return self.render
	#
	#		Convert back to string.
	#
	def toString(self):
		qbTime = 0
		r = self.getRender()
		rstr = ""
		while r != "":
			if r[0] >= 'a' and r[0] <= 'z':						# decode play note
				if r[0] >= 'm':
					descr = "Draw {0}".format(ord(r[0])-ord('m'))
				else:
					descr = "Blow {0}".format(ord(r[0])-ord('a'))
				rstr = rstr + " "+ descr
				r = r[1:]
				if r != "" and r[0] > '0' and r[0] < '9':		# handle bends
					rstr = rstr + "/"*int(r[0],10)
					r = r[1:]
				rstr = rstr + "@" + str(int(qbTime/4)) 			# add bar time played
				if qbTime % 4 != 0:
					rstr += ":"+str(qbTime % 4)
			else:
				if r[0] >= 'A' and r[0] <= 'Z':					# advance bar time
					qbTime += (ord(r[0]) - ord('A') + 1)
					r = r[1:]
		return rstr.strip()

# ****************************************************************************************
#					This class represents a piece of music
# ****************************************************************************************

class Music(object):
	#
	#		Create a new tune
	#
	def __init__(self,beats = 4,tempo = 100,music = ""):
		self.bars = []
		self.beats = beats
		self.tempo = tempo
		music = music.replace("\n","|")
		for barInfo in [x.strip() for x in music.split("|")]:
			if barInfo != "":
				self.addBar(barInfo)
	#
	#		Accessors/Mutators. Setting beats does not check validity.
	#
	def getBeats(self):
		return self.beats 
	def setBeats(self,beats):
		self.beats = beats
	def getTempo(self):
		return self.tempo 
	def setTempo(self,tempo):
		self.tempo = tempo		
	#
	#		Add a bar
	#
	def addBar(self,info = ""):
		self.bars.append(Bar(self.beats,info))
	#
	#		Get the current (e.g. last added) bar
	#
	def getCurrentBar(self):
		if len(self.bars) == 0:
			raise MusicException("Music has no bar")
		return self.bars[-1]
	#
	#		Render whole tune.
	#
	def getRender(self):
		tuneBit = "-".join([x.getRender() for x in self.bars])
		return "beats={0}&tempo={1}&music={2}".format(self.beats,self.tempo,tuneBit)
	#
	#		Convert to string
	#
	def toString(self):
		return "\n".join([x.toString() for x in self.bars])
	#
	#		Load in from a file
	#
	def load(self,srcFile):
		# tidu i[ amd remove comments]
		src = [x.replace("\t"," ") for x in open(srcFile).readlines()]
		src = [x.strip() if x.find("#") < 0 else x[:x.find("#")].strip() for x in src]
		# do assignments
		for op in [x for x in src if x.find(":=") > 0]:
			op = [x.strip() for x in op.split(":=")]
			if len(op) != 2:
				raise MusicException("Bad assignment syntax")
			if op[0] == "beats":
				self.setBeats(int(op[1]))
			elif op[0] == "tempo":
				self.setTempo(int(op[1]))
			else:
				raise MusicException("Can't assign to "+op[0])
		# look at the rest, which is the music.
		for music in [x if x.find(":=") <0 else "" for x in src]:
			for bar in [x.strip() for x in music.split("|") if x.strip() != ""]:
				#print(bar)
				self.addBar(bar)

#
#		Test routines for the library.
#
if __name__ == "__main__":
	b1 = Bar(4,"-4.")
	b1.add("&=")
	b1.add("5o")
	print(b1.getRender())
	print(b1.toString())
	print("==============================")

	tune = "1 2 3 4| -1 -2 -3 -4| -1o -2o | 5= 6= 7= -8=| -2// 2//"
	t1 = Music(4,100,tune)
	print(t1.getRender())
	print(t1.toString())
	print("==============================")

	t2 = Music()
	t2.load("herecomesthesun.harp")
	print(t2.getRender())
	print(t2.toString())

#
#	Music Format
#
#	a-l 		Blow on hole (ord - 'a')
#	m-x  		Draw on hole (ord - 'm')
#	1-9 		Number of draw/blow bends to apply (optional)
# 	A-Z 		advance (ord - 'A' + 1) quarterbeats
#	- 			Used to seperate bars

# TODO: 
#		Load wrapper tracking line
#		Add author, title and harmonica.
