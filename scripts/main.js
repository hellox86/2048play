'use strict'

import { GameField, mem } from "./game.js";

const field = new GameField(mem);

field.draw();

function spawn() {
    setTimeout(() => {
	field.generateNum();
    }, 150);
}

document.addEventListener('keydown', (e) => {	
    if (!field.isGameOver()) {	
	if (e.key == "ArrowLeft" || e.key == "a") {
	    field.moveLeft();
	    spawn();
	} else if ((e.key == "ArrowRight" || e.key == "d")) {
	    field.moveRight();
	} else if (e.key == "ArrowUp" || e.key == "w") {
	    field.moveUp();
	    spawn();
	} else if (e.key == "ArrowDown" || e.key == "s") {
	    field.moveDown();
	    spawn();
	}
	field.update();
    } else {
	alert("Game Over!");
	field.draw();
    }
})

