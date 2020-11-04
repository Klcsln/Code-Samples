using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

namespace UnityCore
{
    namespace Audio
    {
        public class PlayerAudio : MonoBehaviour
        {
            [SerializeField] PlayerAudioPackageSO audioPackage;
            [SerializeField] AudioClip[] strideClips, clothClips, turnClips;
            [SerializeField] AudioSource stride, cloth, turn, slide, ambienceWind;
            [SerializeField] AudioMixer masterMixer;
            Vector3 playerVelocity;
            Vector2 leftSki, rightSki;
            float leftLean, rightLean;
            bool isOnStrideRight, isOnStrideLeft, isOnTurnRight, isOnTurnLeft;


            

            #region Unity Functions
            private void Start()
            {
                isOnStrideRight = false;
                isOnStrideLeft = false;
                isOnTurnRight = false;
                isOnTurnLeft = false;
                ambienceWind.volume = 0.05f;
                ambienceWind.loop = true;
                ambienceWind.Play();
            }
            private void Update()
            {

                UpdateAudioData();
                CheckStrideLeft();
                CheckStrideRight();
                CheckTurnLeft();
                CheckTurnRight();

                UpdateSlideVolume();

            }
            #endregion
            #region Public Functions
            public void StartSlideLoop()
            {
                slide.loop = true;
                slide.Play(0);
            }
            public void StopSlideLoop()
            {
                slide.Stop();
            }
            #endregion
            #region Private Functions
            private void UpdateAudioData()
            {
                playerVelocity = audioPackage.GetPlayerVelocity();
                leftSki = audioPackage.GetLeftSki();
                rightSki = audioPackage.GetRightSki();
                leftLean = audioPackage.GetLeftLean();
                rightLean = audioPackage.GetRightLean();
            }
            private void CheckStrideLeft()
            {
                if (Mathf.Abs(leftSki.y) > 0.2 && !isOnStrideLeft)
                {
                    isOnStrideLeft = true;
                    int strideSelection = Random.Range(0, strideClips.Length);
                    int clothSelection = Random.Range(0, clothClips.Length);
                    PlayAudioSource(stride, strideClips[strideSelection]);
                    PlayAudioSource(cloth, clothClips[clothSelection]);
                }
                else if (Mathf.Abs(leftSki.y) < 0.2)
                {
                    isOnStrideLeft = false;
                }
            }

            private void CheckStrideRight()
            {
                if (Mathf.Abs(rightSki.y) > 0.2 && !isOnStrideRight)
                {
                    isOnStrideRight = true;
                    int strideSelection = Random.Range(0, strideClips.Length);
                    int clothSelection = Random.Range(0, clothClips.Length);
                    PlayAudioSource(stride, strideClips[strideSelection]);
                    PlayAudioSource(cloth, clothClips[clothSelection]);
                }
                else if (Mathf.Abs(rightSki.y) < 0.2)
                {
                    isOnStrideRight = false;
                }
            }
            private void CheckTurnRight()
            {
                if (Mathf.Abs(rightSki.x) > 0.5 && !isOnTurnRight)
                {
                    isOnTurnRight = true;
                    int turnSelection = Random.Range(0, turnClips.Length);
                    PlayAudioSource(turn, turnClips[turnSelection]);
                }
                else if (Mathf.Abs(rightSki.x) < 0.5)
                {
                    isOnTurnRight = false;
                }
            }
            private void CheckTurnLeft()
            {
                if (Mathf.Abs(leftSki.x) > 0.5 && !isOnTurnLeft)
                {
                    isOnTurnLeft = true;
                    int turnSelection = Random.Range(0, turnClips.Length);
                    PlayAudioSource(turn, turnClips[turnSelection]);

                }
                else if (Mathf.Abs(leftSki.x) < 0.5)
                {
                    isOnTurnLeft = false;
                }
            }

            private void PlayAudioSource(AudioSource source, AudioClip clip)
            {
                float vol = Random.Range(0.1f, 0.25f);
                float pitchVariation = Random.Range(-0.3f, 0.3f);
                source.clip = clip;
                source.pitch = 1 + pitchVariation;
                source.volume = vol;
                source.Play();
            }

            private void UpdateSlideVolume()
            {
                float vol = playerVelocity.magnitude / 120;
                slide.volume = vol;
            }
            #endregion
        }
    }
}
