using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

public class MixerController : MonoBehaviour
{
    [SerializeField] AudioMixer masterMixer;
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void SetSFXVolume(float sfxVolume)
    {
        masterMixer.SetFloat("sfxVolume", sfxVolume);
    }
    //public void SetMusicLevel(float musicLevel)
    //{
    //    masterMixer.SetFloat("sfxVolume", musicLevel);
    //}
    public void SetLowPassLevel(float lowPassLevel)
    {
        masterMixer.SetFloat("lowPassSend", lowPassLevel);
    }
    public void ClearSFXVolume()
    {
        masterMixer.ClearFloat("sfxVolume");
    }
    public void ClearLowPassLevel()
    {
        masterMixer.ClearFloat("lowPassSend");
    }
    public static MixerController Instance { get; private set; }


}
