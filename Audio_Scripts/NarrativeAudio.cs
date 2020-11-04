using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

namespace UnityCore
{
    namespace Audio
    {
        public class NarrativeAudio : MonoBehaviour
        {
            public AudioSource firstNarrativeAudioSource;
            //[SerializeField] MixerController mixerController;
            bool isTriggered;
            private MixerController mixerController;

            private void Start()
            {
                isTriggered = false;
                mixerController = MixerController.Instance;
            }

            public void StartNarrativeAudio(NarrativeMomentSO narrativeMoment)
            {
                if (!isTriggered)
                {
                    mixerController.SetSFXVolume(-20f);
                    //masterMixer.SetFloat("lowPassSend", 0f);
                    firstNarrativeAudioSource.volume = 0.3f;
                    firstNarrativeAudioSource.Play();
                    StartCoroutine(WaitForSound(firstNarrativeAudioSource));
                    isTriggered = true;
                }
            }

            public IEnumerator WaitForSound(AudioSource sound)
            {
                yield return new WaitUntil(() => sound.isPlaying == false);
                if (sound != null) { }
                mixerController.ClearSFXVolume();
                //masterMixer.SetFloat("lowPassSend", -80f);
            }
        }
    }

}
