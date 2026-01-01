"use strict"

import { GameField, mem } from "./game.js";

const field = new GameField(mem);

const f = localStorage.getItem("field");
const score = localStorage.getItem("score");
const restart = document.getElementById("restart");
const count = document.getElementById("count");

function spawn(c=1) {
    setTimeout(() => {
	field.generateNum(c);
    }, 150);
}

if (f != null) {
    field.setF(JSON.parse(f));
}
if (score != null) {
    field.count = parseInt(score);
    count.innerText = `Score: ${field.count}`;
}
field.update();
restart.addEventListener("click", () => {
    field.reset();
    localStorage.setItem("field", JSON.stringify(field.getF()));
    count.innerText = `Score: ${field.count}`;
})

document.addEventListener("keydown", (e) => {	    
    if (e.key == "ArrowLeft" || e.key == "a") {
	const prev = field.getF();
	field.moveLeft();
	const now = field.getF();
	if(!field.cmp(prev, now)) {
	    spawn();
	}
    } else if ((e.key == "ArrowRight" || e.key == "d")) {
	if(!field.moveRight()) {
	    spawn();
	}
    } else if (e.key == "ArrowUp" || e.key == "w") {
	if(!field.moveUp()) {
	    spawn();
	}
    } else if (e.key == "ArrowDown" || e.key == "s") {
	if(!field.moveDown()) {
	    spawn();
	}
    }
    localStorage.setItem("field", JSON.stringify(field.getF()));
    localStorage.setItem("score", field.count);
    
    if (field.isGameOver()) {
	alert("Game Over!");
	field.reset();	
	localStorage.setItem("field", JSON.stringify(field.getF()));
	count.innerText = `Score: ${field.count}`;
    } else {
	count.innerText = `Score: ${field.count}`;
	field.update();	
    }
})



