#include "Game.h"

const int thickness = 15;
const float paddleH = 100.0f;

Game::Game()
	:mWindow(nullptr)
	, mRenderer(nullptr)
	, mTicksCount(0)
	, mIsRunning(true)
	, mPaddle1Dir(0)
	, mPaddle1Speed(300)
	, mPaddle2Dir(0)
	, mPaddle2Speed(300)
{

}

bool Game::Initialize()
{
	// Initialize SDL
	int sdlResult = SDL_Init(SDL_INIT_VIDEO);
	if (sdlResult != 0) {return false;}

	// Create an SDL Window
	mWindow = SDL_CreateWindow("Pong Clone from Game Programming in C++ by Sanjay Madhav",100,100,1024,768,0);

	if (!mWindow) {return false;}

	mRenderer = SDL_CreateRenderer(mWindow,-1,SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);

	if (!mRenderer)	{return false;}
	// Initialize paddles and ball 
	// This can be improved by making it dynamic to resolution instead of hardcoding
	mPaddle1Pos.x = 10.0f;
	mPaddle1Pos.y = 768.0f / 2.0f;
	mPaddle2Pos.x = 1024.0f - 25.0f;
	mPaddle2Pos.y = 768.0f / 2.0f;
	mBallPos.x = 1024.0f / 2.0f;
	mBallPos.y = 768.0f / 2.0f;
	mBallVel.x = -200.0f;
	mBallVel.y = 235.0f;
	return true;
}

void Game::RunLoop()
{
	while (mIsRunning)
	{
		ProcessInput();
		UpdateGame();
		GenerateOutput();
	}
}

void Game::ProcessInput()
{
	SDL_Event event;
	while (SDL_PollEvent(&event))
	{
		switch (event.type)
		{
		// Check for exit command
		case SDL_QUIT:
			mIsRunning = false;
			break;
		}
	}

	const Uint8* state = SDL_GetKeyboardState(NULL);

	// Check for exit command
	if (state[SDL_SCANCODE_ESCAPE]) {mIsRunning = false;}

	// Check for user input
	mPaddle1Dir = 0;
	if (state[SDL_SCANCODE_W]) {mPaddle1Dir -= 1;}
	if (state[SDL_SCANCODE_S]) {mPaddle1Dir += 1;}
	mPaddle2Dir = 0;
	if (state[SDL_SCANCODE_UP])	{mPaddle2Dir -= 1;}
	if (state[SDL_SCANCODE_DOWN]) {mPaddle2Dir += 1;}
}

void Game::UpdateGame()
{	// Frame capping to 60fps
	while (!SDL_TICKS_PASSED(SDL_GetTicks(), mTicksCount + 16))
		;

	float deltaTime = (SDL_GetTicks() - mTicksCount) / 1000.0f;

	// Avoiding overload of deltaTime
	if (deltaTime > 0.05f) {deltaTime = 0.05f;}

	mTicksCount = SDL_GetTicks();
	// Handle paddle1 controls
	if (mPaddle1Dir != 0)
	{
		mPaddle1Pos.y += mPaddle1Dir * 300.0f * deltaTime;
		if (mPaddle1Pos.y < (paddleH / 2.0f + thickness))
		{
			mPaddle1Pos.y = paddleH / 2.0f + thickness;
		}
		else if (mPaddle1Pos.y > (768.0f - paddleH / 2.0f - thickness))
		{
			mPaddle1Pos.y = 768.0f - paddleH / 2.0f - thickness;
		}
	}
	// Handle paddle 2 controls
	if (mPaddle2Dir != 0)
	{
		mPaddle2Pos.y += mPaddle2Dir * 300.0f * deltaTime;
		if (mPaddle2Pos.y < (paddleH / 2.0f + thickness))
		{
			mPaddle2Pos.y = paddleH / 2.0f + thickness;
		}
		else if (mPaddle2Pos.y > (768.0f - paddleH / 2.0f - thickness))
		{
			mPaddle2Pos.y = 768.0f - paddleH / 2.0f - thickness;
		}
	}
	// Move ball as a function of deltaTime
	mBallPos.x += mBallVel.x * deltaTime;
	mBallPos.y += mBallVel.y * deltaTime;

	// Check if ball collides with paddle1 and bounce accordingly
	float diff1 = mPaddle1Pos.y - mBallPos.y;
	diff1 = (diff1 > 0.0f) ? diff1 : -diff1;
	if (
		diff1 <= paddleH / 2.0f &&
		mBallPos.x <= 25.0f && mBallPos.x >= 20.0f &&
		mBallVel.x < 0.0f)
	{
		mBallVel.x *= -1.1f;
		mPaddle1Speed *= 1.1f;
	}

	// Check if ball collides with paddle2 and bounce accordingly
	float diff2 = mPaddle2Pos.y - mBallPos.y;
	diff2 = (diff2 > 0.0f) ? diff2 : -diff2;
	if (
		diff2 <= paddleH / 2.0f &&
		mBallPos.x >= 1024.0f - 25.0f && mBallPos.x <= 1024 - 20.0f &&
		mBallVel.x > 0.0f)
	{
		mBallVel.x *= -1.1f;
		mPaddle1Speed *= 1.1f;
	}

	// Stop game if ball is out of bounds
	else if (mBallPos.x <= 0.0f || mBallPos.x > 1024.0f) {mIsRunning = false;}
	// Bounce from top wall
	if (mBallPos.y <= thickness && mBallVel.y < 0.0f) {	mBallVel.y *= -1;}
	// Bounce from bottom wall
	else if (mBallPos.y >= (768 - thickness) &&	mBallVel.y > 0.0f) {mBallVel.y *= -1;}
}

void Game::GenerateOutput()
{	// Set the initial draw color to blue
	SDL_SetRenderDrawColor(
		mRenderer,
		0,		// R
		0,		// G 
		255,	// B
		255		// A
	);
	// Clear the back buffer
	SDL_RenderClear(mRenderer);
	// Set draw color for walls
	SDL_SetRenderDrawColor(mRenderer, 255, 255, 255, 255);
	// Draw top and bottom walls
	SDL_Rect wall{0,0,1024,thickness};
	SDL_RenderFillRect(mRenderer, &wall);
	wall.y = 768 - thickness;
	SDL_RenderFillRect(mRenderer, &wall);
	// Create and draw paddles
	SDL_Rect paddle1{
		static_cast<int>(mPaddle1Pos.x),
		static_cast<int>(mPaddle1Pos.y - paddleH / 2),
		thickness,
		static_cast<int>(paddleH)
	};
	SDL_RenderFillRect(mRenderer, &paddle1);
	
	SDL_Rect paddle2{
		static_cast<int>(mPaddle2Pos.x),
		static_cast<int>(mPaddle2Pos.y - paddleH / 2),
		thickness,
		static_cast<int>(paddleH)
	};
	SDL_RenderFillRect(mRenderer, &paddle2);
	// Create and draw ball
	SDL_Rect ball{
		static_cast<int>(mBallPos.x - thickness / 2),
		static_cast<int>(mBallPos.y - thickness / 2),
		thickness,
		thickness
	};
	SDL_RenderFillRect(mRenderer, &ball);

	// Swap the front and back buffers (Vsync)
	SDL_RenderPresent(mRenderer);
}

void Game::Shutdown()
{
	SDL_DestroyRenderer(mRenderer);
	SDL_DestroyWindow(mWindow);
	SDL_Quit();
}