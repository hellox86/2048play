'use strict';
import * as matrix from "./modules/rotationMatrixModule.js";

const fw = 400;
const fh = 400;
const gridCellSize = 100;
const offset = 10;

const ctx = document.getElementById("canvas").getContext("2d");

function fillCell(x, y, color, w=gridCellSize, h=gridCellSize) {
    ctx.fillStyle = color;
    ctx.fillRect(0.5 + x + offset, offset + y, w, h);
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
	    fillCell(x, y, "rgb(189, 172, 151)");
	}	
    }
    
    ctx.strokeStyle = "rgb(155, 136, 120)";
    ctx.lineWidth = 9;
    ctx.stroke();
}

class GameField {    
    #f;
    constructor (f) {
	this.#f = f;
    }
    generateNum(times) {
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
	    } while(this.#f[row][col] != 0);
	    this.#f[row][col] = output;
	    fillCell(100*row+5, 100*col+5, "rgb(238, 228, 218)", 90, 90);
	    ctx.fillStyle = "rgb(117, 100, 82)";
	    ctx.font = "30px sans-serif";
	    const res = output.toString();
	    ctx.fillText(res, 100*row+75, 100*col+75);
	}
    }   

    move_left() {
	let arr = matrix.createField();
	let el_counter = 0;
	
	for (let i = 0; i < 4; i++)
	{
	    for (let j = 0; j < 4; j++)
	    {
		if (this.#f[i][j] != 0)
		{
		    arr[i][el_counter] = this.#f[i][j];
		    el_counter++;
		}
	    }
	    el_counter = 0;	
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
	this.#f = res.slice();
    }

    move_right() {
	this.#f = matrix.rotate_180(this.#f);
	this.move_left();
	this.#f = matrix.rotate_180(this.#f);
    }

    move_down() {
	this.#f = matrix.rotate_90cw(this.#f);
	this.move_left();
	this.#f = matrix.rotate_90ccw(this.#f);
    }

    move_up() {
	this.#f = matrix.rotate_90ccw(this.#f);
	this.move_left();
	this.#f = matrix.rotate_90cw(this.#f);
    }
    print() {
	let res = "";
	let c = 0;
	for (let i = 0; i < 4; i++) {
	    for (let j = 0; j < 4; j++) {
		res += " " + this.#f[i][j];
	    }
	    console.log(res);
	    console.log();
	    res = "";
	}
	console.log(this.#f);
	console.log();
    }
}

drawField();
const mem = matrix.createField();
const field = new GameField(mem);

field.generateNum(2);

