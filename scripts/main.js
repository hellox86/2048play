import { GameField } from "./game.js";

const field = new GameField();

const f = localStorage.getItem("field");
const score = localStorage.getItem("score");
const restart = document.getElementById("restart");
const count = document.getElementById("count");
const howto = document.getElementById("howto");
const canvas = document.getElementById("canvas");
const btnOver = document.getElementById("btn-over");
const textOver = document.getElementById("text-over");

function saveState() {
  localStorage.setItem("field", JSON.stringify(field.getF()));
  localStorage.setItem("score", field.count);
}
// game over checker
const interval = setInterval(() => {
  if (field.isGameOver()) {
    saveState();
    canvas.classList.remove("over");
    canvas.classList.add("over");
    textOver.style.display = "block";
    btnOver.style.display = "block";
  }
}, 150);

btnOver.addEventListener("click", () => {
  canvas.classList.remove("over");
  textOver.style.display = "none";
  btnOver.style.display = "none";
  field.reset();
  count.innerText = `Очки: ${field.count}`;
  saveState();
});
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
  canvas.classList.remove("over");
  textOver.style.display = "none";
  btnOver.style.display = "none";

  field.reset();
  saveState();
});

howto.addEventListener("click", () => {
  window.location.href = `${location}howto`;
});

function game(e) {
  const key = e.key;
  if (key.match(/w|s|a|d|ц|ы|ф|в/i)) {
    if (key == "ArrowLeft" || key == "a" || key == "ф") {
      if (!field.moveLeft()) {
        spawn();
      }
    } else if (key == "ArrowRight" || key == "d" || key == "в") {
      if (!field.moveRight()) {
        spawn();
      }
    } else if (key == "ArrowUp" || key == "w" || key == "ц") {
      if (!field.moveUp()) {
        spawn();
      }
    } else if (key == "ArrowDown" || key == "s" || key == "ы") {
      if (!field.moveDown()) {
        spawn();
      }
    }
    saveState();
    count.innerText = `Очки: ${field.count}`;
    field.update();
  }
}

let startX,
  startY = 0;
let endX,
  endY = 0;

function gameMobile() {
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
      if (!field.moveLeft()) {
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
  saveState();
  count.innerText = `Очки: ${field.count}`;
  field.update();
}
document.addEventListener("keydown", (e) => {
  game(e);
});
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();

  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  gameMobile();
});
window.addEventListener("beforeunload", () => {
  saveState();
});
