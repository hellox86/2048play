const n = 4;

export function createField() {
    const arr = new Array(n);

    for (let i = 0; i < n; i++)
    {
	arr[i] = new Array(n).fill(0);
    }
    return arr;
};

export function rotate_180(f) {
    let tmp = createField();
    for (let i = 0; i < n; i++)
    {
	for (let j = 0; j < n; j++)
	{
	    tmp[i][j] = f[n-i-1][n-j-1];
	}
    }
    return tmp;
}

export function rotate_90cw(f)
{
    let tmp = createField();
    for (let i = 0; i < n; i++)
    {
	for (let j = 0; j < n; j++)
	{
	    tmp[j][n-i-1] = f[i][j];
	}
    }
    return tmp;
}

export function rotate_90ccw(f)
{
    let tmp = createField();
    for (let i = 0; i < n; i++)
    {
	for (let j = 0; j < n; j++)
	{
	    tmp[n-j-1][i] = f[i][j];
	}
    }
    return tmp;
}

export * from "./rotationMatrixModule.js";
