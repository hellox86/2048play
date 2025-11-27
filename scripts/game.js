'use strict';
import * as matrix from "./modules/rotationMatrixModule.js"

const fw = 400;
const fh = 400;
const gridCellSize = 100;
const offset = 10;

const ctx = document.getElementById("canvas").getContext("2d");

let gameField = matrix.createField();

function generateNum(times) {
    let output = 2;
    const randomInRange = (min, max) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random()*(maxFloored-minCeiled+1) + minCeiled);
    }
    for (let i = 0; i < times; i++) {
	const randIndex = randomInRange(0, 9);

	if (randIndex != 9) {
	    output = 2;
	} else {
	    output = 4;
	}
	let row;
	let col;
	do {
	     row = randomInRange(0, 3);
	     col = randomInRange(0, 3);
	} while(gameField[row][col] != 0);
	gameField[row][col] = output;
    }
}

function drawField() {
    for (let x = 0; x <= fw; x += gridCellSize) {
        ctx.moveTo(0.5 + x + offset, offset);
        ctx.lineTo(0.5 + x + offset, fh + offset);
	for (let y = 0; y <= fh; y += gridCellSize) {
            ctx.moveTo(offset, 0.5 + y + offset);
            ctx.lineTo(fw + offset, 0.5 + y + offset);
	}
    }
    for (let x = 0; x < fw; x += gridCellSize) {
	for (let y = 0; y < fh; y += gridCellSize)
	{
	    ctx.fillStyle = "rgb(238, 228, 218)";	    
	    ctx.fillRect(0.5 + x + offset, offset + y, gridCellSize, gridCellSize);
	}
    }
    ctx.strokeStyle = "rgb(155, 136, 120)";
    ctx.lineWidth = 5;
    ctx.stroke();
}

drawField();
generateNum(2);
console.log(gameField);
// game movement

function move_left(f) {
    let arr = matrix.createField();
    let el_counter = 0;

    for (let i = 0; i < 4; i++)
    {
	for (let j = 0; j < 4; j++)
	{
	    if (f[i][j] != 0)
	    {
		arr[i][el_counter] = f[i][j];
		el_counter++;
	    }
	}
    }
    let res = matrix.createField();
    for (let i = 0; i < 4; i++)
    {
	for (let j = 0; j < 4;)
	{
	    if (j+1 < 4 && arr[i][j] == arr[i][j+1])
	    {
		res[i][el_counter] = arr[i][j]*2;
		j+=2;
	    }
	    else
	    {
		res[i][el_counter] = arr[i][j];
		j++;
	    }
	    el_counter++;
	}
	el_counter = 0;
    }
    return res;
}

function move_right(f) {
    f = matrix.rotate_180(f);
    f = move_left(f);
    f = matrix.rotate_180(f);
    return f;
}

function move_down(f) {
    f = matrix.rotate_90cw(f);
    f = move_left(f);
    f = matrix.rotate_90ccw(f);
    return f;
}

function move_up(f) {
    f = matrix.rotate_90ccw(f);
    f = move_left(f);
    f = matrix.rotate_90cw(f);
    return f;
}

gameField = move_left(gameField);
console.log(gameField);
