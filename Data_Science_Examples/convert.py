"""
Small python script to batch convert all wav files in a folder to flac
"""

import os
import glob

audio_path = "path/"
audio_files = glob.glob(os.path.join(audio_path, '*.wav'))
counter = 0

for filename in audio_files:
    os.system('ffmpeg -i {input} {output}'.format(input = filename, output="Noise/"+str(counter)+".flac"))
    counter +=1
