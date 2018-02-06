#
#	Script to rebuild and update sound, graphics and fonts in application.
#
echo "Making Graphics"
cd graphics
python makeatlas.py

echo "Copying to assets"
cp sprites.* ../app/assets/sprites
cp *.png ../app/assets/sprites
cd ..
cp fonts/*.png app/assets/fonts
cp fonts/*.fnt app/assets/fonts

echo "Updating .ogg files"
rm app/assets/sounds/*
cp sounds/notes/[0-9]*.ogg app/assets/sounds
cp sounds/metronome.ogg app/assets/sounds

echo "Converting OGG to MP3"
cd app/assets/sounds
foreach ($file in get-ChildItem *.ogg) {
	$newname = ([String]$file).Replace("ogg","mp3")
	ffmpeg -v 0 -i $file -c:a libmp3lame -q:a 2 $newname
}
cd ../../..

echo "Done."
