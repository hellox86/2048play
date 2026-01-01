"use strict"

import { GameField, mem } from "./game.js";

const field = new GameField(mem);

const f = localStorage.getItem("field");
const score = localStorage.getItem("score");
const restart = document.getElementById("restart");
const count = document.getElementById("count");

// TODO: touchpad handling in my game, animation

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

function game(e) {     
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
}

let startX, startY = 0;
let endX, endY = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
})
document.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    console.log([startX, startY], [endX, endY]);
})

function gameMobile(e) {
    let direction = "";
    
    const deviationX = Math.abs(startX)-Math.abs(endX);
    const deviationY = Math.abs(startY)-Math.abs(endY);
    
    if(deviationX > 0) {
	const prev = field.getF();
	field.moveLeft();
	const now = field.getF();
	if(!field.cmp(prev, now)) {
	    spawn();
	}	
    } else if(deviationX < 0) {
	if(!field.moveRight()) {
	    spawn();
	}	
    } else if(deviationY > 0) {
	if(!field.moveUp()) {
	    spawn();
	}	
    } else if(deviationY < 0) {
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
}
document.addEventListener("keydown", (e) => {
    game(e);
})
document.addEventListener("touchmove", () => {
    gameMobile();
})



