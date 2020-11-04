#pragma once
#include "Graphics.h"
#include "VertexFormat.h"
class Shader;
class VertexBuffer;
class RenderObj;

class Game
{
public:
    Game();
    ~Game();

    void Init(HWND hWnd, float width, float height);
    void Shutdown();
	void Update(float deltaTime);
    void RenderFrame();

	void OnKeyDown(uint32_t key);
	void OnKeyUp(uint32_t key);
	bool IsKeyHeld(uint32_t key) const;
	VertexPosColor vertexPosColor;

private:
	std::unordered_map<uint32_t, bool> m_keyIsHeld;
	Graphics mGraphics;
	// TODO Lab 02c
	Shader* simpleShader = nullptr;
	// TODO Lab 02e
	VertexBuffer* vertBuffer = nullptr;
	// TODO Lab 02f
	RenderObj* renderObj = nullptr;
	bool LoadLevel(const WCHAR* fileName);
};