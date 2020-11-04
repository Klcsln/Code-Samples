"""
Python script to randomly pick a noise file in flac format and merge it with a clean wav file using an embedded bash script with ffmpeg.
It takes the first file as the main file and adds the second file to it.
You can easily play with the settings by checking ffmpeg documentation.
"""
import os
import glob
import random

audio_path = "Audio/"
output_path = "Output/"

clean_files = glob.glob(os.path.join(audio_path, '*.wav'))
noise_files = glob.glob(os.path.join(audio_path, '*.flac'))

counter = 0

for filename in clean_files:
    rnd_noise = random.choice(noise_files)
    os.system('ffmpeg -i {audio} -i {noise} -filter_complex "[0:0][1:0] amix=inputs=2:duration=first" -c:a libmp3lame {output}'
              .format(audio=filename,noise=rnd_noise,output=output_path+str(counter)+".wav"))
    counter +=1
