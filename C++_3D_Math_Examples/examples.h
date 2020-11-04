/*
	These are some example snippets taken from a bigger 3D Math library. I'm providing only these examples as most of the library was provided by my professor and these are the functions that I wrote myself.
*/


// Dot product between two vectors (a dot b)
float Dot(const Vector3& a, const Vector3& b)
{
	float temp = a.x * b.x + a.y * b.y + a.z * b.z;
	return temp;
}

// Cross product between two vectors (a cross b)
Vector3 Cross(const Vector3& a, const Vector3& b)
{
	return Vector3(
		(a.y * b.z) - (a.z * b.y),
		(a.z * b.x) - (a.x * b.z),
		(a.x * b.y) - (a.y * b.x));
}

// Lerp from A to B by f
Vector3 Lerp(const Vector3& a, const Vector3& b, float f)
{
	return Vector3(a.x * (1 - f) + b.x * f, a.y * (1 - f) + b.y * f, a.z * (1 - f) + b.z * f);
}

// Normalize this vector
void Normalize()
{
	float length = Length();
	x /= length;
	y /= length;
	z /= length;
	w /= length;
}
// Normalize the provided vector
Vector4 Normalize(const Vector4& vec)
{
	Vector4 temp = vec;
	temp.Normalize();
	return temp;
}

// Lerp from A to B by f
Vector4 Lerp(const Vector4& a, const Vector4& b, float f)
{
	return Vector4(a.x * (1 - f) + b.x * f, a.y * (1 - f) + b.y * f, a.z * (1 - f) + b.z * f, a.w * (1 - f) + b.w * f);
}

// Get the translation component of the matrix
Vector3 GetTranslation() const
{
	return Vector3(mat[3][0], mat[3][1], mat[3][2]);
}

// Get the X axis of the matrix (forward)
Vector3 GetXAxis() const
{
	return Vector3(mat[0][0], mat[0][1], mat[0][2]);
}

// Get the Y axis of the matrix (left)
Vector3 GetYAxis() const
{
	return Vector3(mat[1][0], mat[1][1], mat[1][2]);
}

// Get the Z axis of the matrix (up)
Vector3 GetZAxis() const
{
	return Vector3(mat[2][0], mat[2][1], mat[2][2]);
}

// Create a scale matrix with x, y, and z scales
static Matrix4 CreateScale(float xScale, float yScale, float zScale)
{
	float temp[4][4] =
	{
		{ xScale, 0.0f, 0.0f, 0.0f },
		{ 0.0f, yScale, 0.0f, 0.0f },
		{ 0.0f, 0.0f, zScale, 0.0f },
		{ 0.0f, 0.0f, 0.0f, 1.0f }
	};
	return Matrix4(temp);
}

// Rotation about x-axis
static Matrix4 CreateRotationX(float theta)
{
	float temp[4][4] =
	{
		{ 1.0f, 0.0f, 0.0f, 0.0f },
		{ 0.0f, (float)cos(theta), (float)sin(theta), 0.0f },
		{ 0.0f, (float)-sin(theta), (float)cos(theta), 0.0f },
		{ 0.0f, 0.0f, 0.0f, 1.0f },
	};
	return Matrix4(temp);
}

// Rotation about y-axis
static Matrix4 CreateRotationY(float theta)
{
	float temp[4][4] =
	{
		{ (float)cos(theta), 0.0f, (float)-sin(theta), 0.0f },
		{ 0.0f, 1.0f, 0.0f, 0.0f },
		{ (float)sin(theta), 0.0f, (float)cos(theta), 0.0f },
		{ 0.0f, 0.0f, 0.0f, 1.0f },
	};
	return Matrix4(temp);
}

// Rotation about z-axis
static Matrix4 CreateRotationZ(float theta)
{
	float temp[4][4] =
	{
		{ (float)cos(theta), (float)sin(theta), 0.0f, 0.0f },
		{ (float)-sin(theta), (float)cos(theta), 0.0f, 0.0f },
		{ 0.0f, 0.0f, 1.0f, 0.0f },
		{ 0.0f, 0.0f, 0.0f, 1.0f },
	};
	return Matrix4(temp);
}

static Matrix4 CreateTranslation(const Vector3& trans)
{
	float temp[4][4] =
	{
		{ 1.0f, 0.0f, 0.0f, 0.0f },
		{ 0.0f, 1.0f, 0.0f, 0.0f },
		{ 0.0f, 0.0f, 1.0f, 0.0f },
		{ trans.x, trans.y, trans.z, 1.0f },
	};
	return Matrix4(temp);
}

inline Vector3 Transform(const Vector3& vec, const Matrix4& mat, float w = 1.0f)
{

	Vector3 retVal;
	retVal.x = vec.x * mat.mat[0][0] + vec.y * mat.mat[1][0] +
		vec.z * mat.mat[2][0] + w * mat.mat[3][0];
	retVal.y = vec.x * mat.mat[0][1] + vec.y * mat.mat[1][1] +
		vec.z * mat.mat[2][1] + w * mat.mat[3][1];
	retVal.z = vec.x * mat.mat[0][2] + vec.y * mat.mat[1][2] +
		vec.z * mat.mat[2][2] + w * mat.mat[3][2];
	return retVal;
}