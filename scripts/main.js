"use strict";

import { GameField, mem } from "./game.js";

const field = new GameField(mem);

const f = localStorage.getItem("field");
const score = localStorage.getItem("score");
const restart = document.getElementById("restart");
const count = document.getElementById("count");
const howto = document.getElementById("howto");
const canvas = document.getElementById("canvas");

function spawn(c = 1) {
  setTimeout(() => {
    field.generateNum(c);
  }, 150);
}

if (f != null) {
  field.setF(JSON.parse(f));
} else {
  field.reset();
}
if (score != null) {
  field.count = parseInt(score);
  count.innerText = `Очки: ${field.count}`;
}
field.update();
restart.addEventListener("click", () => {
  field.reset();
  localStorage.setItem("field", JSON.stringify(field.getF()));
  count.innerText = `Очки: ${field.count}`;
});
howto.addEventListener("click", () => {
  window.location.href = `/2048play/howto`;
});
function game(e) {
  localStorage.setItem("field", JSON.stringify(field.getF()));
  localStorage.setItem("score", field.count);
  if (e.key == "ArrowLeft" || e.key == "a") {
    const prev = field.getF();
    field.moveLeft();
    const now = field.getF();
    if (!field.cmp(prev, now)) {
      spawn();
    }
  } else if (e.key == "ArrowRight" || e.key == "d") {
    if (!field.moveRight()) {
      spawn();
    }
  } else if (e.key == "ArrowUp" || e.key == "w") {
    if (!field.moveUp()) {
      spawn();
    }
  } else if (e.key == "ArrowDown" || e.key == "s") {
    if (!field.moveDown()) {
      spawn();
    }
  }
  if (field.isGameOver()) {
    alert("Game Over!");
    field.reset();
  } else {
    count.innerText = `Очки: ${field.count}`;
    field.update();
  }
}

let startX,
  startY = 0;
let endX,
  endY = 0;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();

  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
});

function gameMobile(e) {
  localStorage.setItem("field", JSON.stringify(field.getF()));
  localStorage.setItem("score", field.count);
  const deviationX = startX - endX;
  const deviationY = startY - endY;
  let flag = true;
  if (Math.abs(deviationX) > Math.abs(deviationY)) {
    flag = true;
  } else if (Math.abs(deviationX) < Math.abs(deviationY)) {
    flag = false;
  }
  if (flag) {
    if (deviationX > 0) {
      const prev = field.getF();
      field.moveLeft();
      const now = field.getF();
      if (!field.cmp(prev, now)) {
        spawn();
      }
    } else if (deviationX < 0) {
      if (!field.moveRight()) {
        spawn();
      }
    }
  } else {
    if (deviationY > 0) {
      if (!field.moveUp()) {
        spawn();
      }
    } else if (deviationY < 0) {
      if (!field.moveDown()) {
        spawn();
      }
    }
  }
  if (field.isGameOver()) {
    alert("Game Over!");
    field.reset();
  } else {
    count.innerText = `Очки: ${field.count}`;
    field.update();
  }
}
document.addEventListener("keydown", (e) => {
  game(e);
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  gameMobile();
});
window.addEventListener("beforeunload", () => {
  localStorage.setItem("field", JSON.stringify(field.getF()));
  localStorage.setItem("score", field.count);
});
