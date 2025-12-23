import * as matrix from "./rotationMatrixModule.js";
// TODO: BUG, animation, localstorage: canvas, score
const fw = 400;
const fh = 400;
const gridCellSize = 100;
const offset = 10;

const ctx = document.getElementById("canvas").getContext("2d");

const tileColor = {
    "2": "rgb(238, 228, 218)",
    "4": "rgb(236, 224, 200)",
    "8": "rgb(239, 178, 124)",
    "16": "rgb(245, 149, 99)",
    "32": "rgb(245, 124, 95)",
    "64": "rgb(246, 93, 59)",
    "128": "rgb(237, 206, 113)",
    "256": "rgb(237, 204, 97)",
    "512": "rgb(236, 200, 80)",
    "1024": "rgb(237, 197, 63)",
    "2048": "rgb(238, 194, 46)",
    "default": "rgb(61, 58, 51)"
};
const textSize = "35px";

function fillCell(x, y, color, w=gridCellSize, h=gridCellSize) {
    ctx.fillStyle = color;

    ctx.fillRect(0.5 + x + offset, offset + y, w, h);
}

export class GameField {    
    #f;
    count;
    prevf;
    constructor (f) {
	this.#f = f;
    }
    generateNum(times=1) {
	let output;
	const randomInRange = (min, max) => {
	    const minCeiled = Math.ceil(min);
	    const maxFloored = Math.floor(max);
	    return Math.floor(Math.random()*(maxFloored-minCeiled+1) + minCeiled);
	};
	for (let i = 0; i < times; ++i) {
	    output = 2;
	    const randIndex = randomInRange(0, 9);

	    if (randIndex == 9) {
		output = 4;
	    }
	    let row;
	    let col;
	    do {
		row = randomInRange(0, 3);
		col = randomInRange(0, 3);
	    } while(this.#f[row][col] != 0);
	    this.#f[row][col] = output;
	    let currentColor = (output > 2) ? tileColor["4"] : tileColor["2"];

	    fillCell(100*col+5, 100*row+5, currentColor, 90, 90);
	    ctx.font = `${textSize} sans-serif`;
	    ctx.fillStyle = "rgb(117, 100, 82)";
	    ctx.strokeStyle = "rgb(117, 100, 82)";	    
	    ctx.lineWidth = 2;
	    const res = output.toString();
	    ctx.textBaseline = "middle";
	    ctx.textAlign = "center";
	    ctx.strokeText(res, offset + gridCellSize * col + gridCellSize/2, offset + gridCellSize * row + gridCellSize/2, 100);
	    ctx.fillText(res, offset + gridCellSize * col + gridCellSize/2, offset + gridCellSize * row + gridCellSize/2, 100);

	}
    }   
    draw() {
	for (let x = 0; x <= fw; x += gridCellSize) {
            ctx.moveTo(0.5 + x + offset, offset);
            ctx.lineTo(0.5 + x + offset, fh + offset);
	    for (let y = 0; y <= fh; y += gridCellSize) {
		ctx.moveTo(offset, 0.5 + y + offset);
		ctx.lineTo(fw + offset, 0.5 + y + offset);
	    }
	}
	
	for (let x = 0; x < fw; x += gridCellSize) {
	    for (let y = 0; y < fh; y += gridCellSize) {
		fillCell(x, y, "rgb(189, 172, 151)");
	    }	
	}
	
	ctx.strokeStyle = "rgb(155, 136, 120)";
	ctx.lineWidth = 9;
	ctx.stroke();
	
	for (let i = 0; i < 4; ++i) {
	    for (let j = 0; j < 4; ++j) {
		this.#f[i][j] = 0;
	    }
	}
	setTimeout(() => {
	    this.generateNum(2);
	}, 150)
    }
    update() {
	for (let x = 0; x <= fw; x += gridCellSize) {
            ctx.moveTo(0.5 + x + offset, offset);
            ctx.lineTo(0.5 + x + offset, fh + offset);
	    for (let y = 0; y <= fh; y += gridCellSize) {
		ctx.moveTo(offset, 0.5 + y + offset);
		ctx.lineTo(fw + offset, 0.5 + y + offset);
	    }
	}
	
	for (let x = 0; x < fw; x += gridCellSize) {
	    for (let y = 0; y < fh; y += gridCellSize) {
		fillCell(x, y, "rgb(189, 172, 151)");
	    }	
	}
	ctx.strokeStyle = "rgb(155, 136, 120)";
	ctx.lineWidth = 9;
	ctx.stroke();
	
	for (let i = 0; i < 4; ++i) {
	    for (let j = 0; j < 4; ++j) {
		if (this.#f[i][j] != 0) {
		    if (this.#f[i][j] > 2048) {
			fillCell(100*j+5, 100*i+5, tileColor["default"], 90, 90);    
		    } else {
			fillCell(100*j+5, 100*i+5, tileColor[this.#f[i][j].toString()], 90, 90);			    	
		    }
		    ctx.font = `${textSize} sans-serif`;
		    const textColor = (this.#f[i][j] <= 4) ? "rgb(117, 100, 82)" : "rgb(255, 255, 255)";
		    ctx.fillStyle = textColor;
		    ctx.strokeStyle = textColor;	    
		    ctx.lineWidth = 2;
		    const res = this.#f[i][j].toString();
		    ctx.textBaseline = "middle";
		    ctx.textAlign = "center";
		    ctx.strokeText(res, offset + gridCellSize * j + gridCellSize/2, offset + gridCellSize * i + gridCellSize/2, 100);
		    ctx.fillText(res, offset + gridCellSize * j + gridCellSize/2, offset + gridCellSize * i + gridCellSize/2, 100);
		}
	    }
	}
    }
    moveLeft() {
	let arr = matrix.createField();
	let el_counter = 0;
	    
	    for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
		    if (this.#f[i][j] != 0) {
			arr[i][el_counter] = this.#f[i][j];
			++el_counter;
		    }
		}
		el_counter = 0;	
	    }
	    let res = matrix.createField();
	    for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4;) {
		    if (j+1 < 4 && arr[i][j] == arr[i][j+1]) {
			res[i][el_counter] = arr[i][j]*2;
			j+=2;
			this.count += res[i][el_counter];
		    } else {
			res[i][el_counter] = arr[i][j];
			++j;
		    }
		    ++el_counter;
		}
		el_counter = 0;
	    }
	    this.#f = res.slice();
	}

    moveRight() {
	this.#f = matrix.rotate_180(this.#f);
	this.moveLeft();
	this.#f = matrix.rotate_180(this.#f);
    }

    moveDown() {
	this.#f = matrix.rotate_90cw(this.#f);
	this.moveLeft();
	this.#f = matrix.rotate_90ccw(this.#f);
    }

    moveUp() {
	this.#f = matrix.rotate_90ccw(this.#f);
	this.moveLeft();
	this.#f = matrix.rotate_90cw(this.#f);
    }
    isGameOver() {
	let flag = false;
	let c = 0;
	for (let i = 0; i < 4; ++i) {
	    for (let j = 0; j < 4; ++j) {
		if(this.#f[i][j] == 0) {
		    c++;
		}
	    }
	}
	if (c == 0) {
	    flag = true;
	}
	return flag;
    }
    print() {
	let res = "";
	let c = 0;
	for (let i = 0; i < 4; ++i) {
	    for (let j = 0; j < 4; ++j) {
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

export const mem = matrix.createField();
