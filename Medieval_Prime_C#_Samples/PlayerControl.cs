using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class PlayerControl : MonoBehaviour
{
    public static PlayerControl instance;
    public float upForce;
    private bool isDead = false;
    public bool grounded = true;
    public bool isDashing = false;
    public LayerMask whatIsGround;
    private Animator anim;
    private Rigidbody2D rb2d;
    private Collider2D coll;
    private bool initJump = false;
    public Vector2 gravityModifier;
    public Vector3 dashRotation;
    private SpriteRenderer renderer;
    public int bufferTime = 3;

    public float dashScale = 0.12f;
    public float recoverScale = 0.06f;

    private bool shrink = false;

    private float originalSize;
    private float shrinkSize;

    private void Awake()
    {
        Physics2D.gravity = gravityModifier;
    }
    void Start()
    {
        anim = GetComponent<Animator>();
        rb2d = GetComponent<Rigidbody2D>();
        coll = GetComponent<Collider2D>();
        renderer = GetComponent<SpriteRenderer>();
        originalSize = renderer.transform.localScale.y;
        shrinkSize = originalSize / 2;

    }

    void Update()
    {
        // Make sure player stands straight
        //rb2d.transform.eulerAngles = new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, 0);
        if (isDead == false && GameControl.instance.isPlaying)
        {
            grounded = Physics2D.IsTouchingLayers(coll, whatIsGround);

            if (shrink)
            {
                Shrink();
            }
            else
            {
                Recover();
            }

            int i = 0;
            while (i < Input.touchCount)
            {
                Touch touch = Input.GetTouch(i);

                // PC CONTROLS
                // if (Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0) && !isDashing)

                // MOBILE CONTROLS
                // Disable play control when upper left corner pressed (for pause button)
                if (!(touch.position.x < Screen.width / 4 && touch.position.y > Screen.width / 5))
                {
                    // Debug.Log("TOUCH:" + touch.position.x.ToString() + " " + touch.position.y.ToString());
                    if (touch.position.x < Screen.width / 2)
                    {
                        if (touch.phase == TouchPhase.Began && !grounded)
                        {
                            Dash();
                        }
                        else if (touch.phase == TouchPhase.Stationary)
                        {
                            if (grounded)
                            {
                                shrink = true;
                                Shrink();
                            }
                        }
                        else if (touch.phase == TouchPhase.Ended)
                        {
                            shrink = false;
                        }
                    }
                    else if (touch.position.x > Screen.width / 2)
                    {
                        if (touch.phase == TouchPhase.Began)
                        {
                            if (grounded)
                            {
                                Jump();
                                Debug.Log("initj - jump: " + initJump.ToString());

                            }
                            // Double Jump
                            else if (initJump)
                            {
                                DoubleJump();
                                Debug.Log("initj - djump: " + initJump.ToString());
                            }
                        }

                    }
                }
                ++i;
            }
        }
    }

    void Dash()
    {
        // Dash down if character is jumping
        if (!grounded)
        {
            GameControl.instance.DashSound();
            rb2d.velocity = Vector2.zero;
            rb2d.AddForce(new Vector2(0, -upForce * 1.5f), ForceMode2D.Impulse);
            initJump = false;
        }
        // Slide if character is on the ground
         else if (grounded && !isDashing)
        {
            StartCoroutine(DashThrough());
        }
    }
    IEnumerator DashThrough()
    {
        Debug.Log("Started Dash");
        isDashing = true;
        renderer.color = new Color(153f, 0f, 0f, 1f);
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(dashDuration);

        Debug.Log("Waited Dash");
        renderer.color = Color.white;
        isDashing = false;
    }



    void OnTriggerEnter2D(Collider2D col)
    {


        if ((col.gameObject.tag == "lowHazard" && grounded == true) ||
        (col.gameObject.tag == "highHazard" && ((grounded == true) || (initJump == true))) ||
        (col.gameObject.tag == "dashHazard" && isDashing == false))
        {
            Debug.Log("crash");
            StartCoroutine(Hurt());
            GameControl.instance.updateLifeCounter();

            if (GameControl.instance.checkDead())
            {
                rb2d.velocity = Vector2.zero;
                isDead = true;
                isDashing = false;
                GameControl.instance.PlayerDied();
                //anim.SetTrigger("Die");
            }
            else
            {
                //Special Effects
            }
        }
    }

    void Jump()
    {
        initJump = true;
        rb2d.velocity = Vector2.zero;
        rb2d.AddForce(new Vector2(0, upForce), ForceMode2D.Impulse);
        renderer.color = new Color(0f, 255f, 0f, 1f);
        GameControl.instance.JumpSound();
    }

    void DoubleJump()
    {
        initJump = false;
        rb2d.velocity = Vector2.zero;
        rb2d.AddForce(new Vector2(0, upForce), ForceMode2D.Impulse);
        renderer.color = new Color(0.5f, 0.5f, 0.5f, 1f);
        GameControl.instance.JumpSound();
    }

    void Shrink()
    {
        Debug.Log("SHRINK: " + renderer.transform.localScale.y.ToString());
        if (renderer.transform.localScale.y > shrinkSize)
        {
            renderer.transform.localScale = new Vector2(renderer.transform.localScale.x, renderer.transform.localScale.y - dashScale);
        }
        renderer.color = new Color(255f, 255f, 0f, 1f);
    }

    void Recover()
    {
        Debug.Log("RECOVER: " + renderer.transform.localScale.y.ToString());
        if (renderer.transform.localScale.y < originalSize)
        {
            renderer.transform.localScale = new Vector2(renderer.transform.localScale.x, renderer.transform.localScale.y + recoverScale);
        }
        renderer.color = Color.white;
    }

    IEnumerator Hurt()
    {
        Debug.Log("HURT");
        renderer.material.color = new Color(255f, 0f, 0f, 1f);
        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.008f);
        renderer.material.color = Color.white;
    }
}