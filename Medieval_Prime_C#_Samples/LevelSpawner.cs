using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelSpawner : MonoBehaviour
{
    [SerializeField]
    private GameObject[] hazardChunks;
    [SerializeField]
    private Sprite[] spriteList;
    [SerializeField]
    private GameObject town;
    private Sprite randomTownSprite;
    [SerializeField]
    private int spawnCount = 0;
    int randomInt;
    void Start()
    {
        InvokeRepeating("SpawnChunk", 3.0f, 5f);
    }

    void SpawnChunk()
    {
        if (spawnCount < 10)
        {
            randomInt = Random.Range(0, hazardChunks.Length);
            Instantiate(hazardChunks[randomInt], transform.TransformPoint(new Vector3(35f, -2f, 0f)), Quaternion.identity);
            spawnCount++;
        }
        else
        {
            // Move town to new position
            town.transform.position = new Vector3(40f, 0f, 0f);
            // Change sprite of town here
            randomTownSprite = spriteList[Random.Range(0, spriteList.Length)];
            town.GetComponent<SpriteRenderer>().sprite = randomTownSprite;
            town.GetComponent<SpriteRenderer>().sortingLayerName = "Midground";
            spawnCount = 0;
        }


    }
}