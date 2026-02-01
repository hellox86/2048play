import * as matrix from "./rotationMatrixModule.js";

const canvas = document.getElementById("canvas");
const rounding = 8;
const spacing = 10;
const gamecont = document.querySelector(".game-container");
const spaceBetweenCells = 4 * spacing;

const fw = canvas.width + spaceBetweenCells;
const fh = canvas.height + spaceBetweenCells;
const ratio = window.devicePixelRatio || 1;
const gridCellSize = (fw - spaceBetweenCells) / 4;
const emptyCellColor = "#eeeeee";
const tileColor = {
  2: "#7cb5e2",
  4: "#4495d4",
  8: "#2f6895",
  16: "#f5bd70",
  32: "#f2a032",
  64: "#cd8829",
  128: "#e37051",
  256: "#de5833",
  512: "",
  1024: "",
  2048: "",
  default: "",
};
canvas.width = fw * ratio;
canvas.height = fh * ratio;

gamecont.style.width = canvas.style.width = fw + "px";
gamecont.style.height = canvas.style.height = fh + "px";

const ctx = canvas.getContext("2d");
ctx.scale(ratio, ratio);

const textSize = window.getComputedStyle(canvas).fontSize;

const howto = document.getElementById("howto");

export class Game {
  #f;
  constructor() {
    this.#f = matrix.createField();
  }
  drawField() {
    ctx.fillStyle = emptyCellColor;

    for (let y = 0; y < fw; y += gridCellSize + spacing) {
      for (let x = 0; x < fh; x += gridCellSize + spacing) {
        ctx.roundRect(x, y, gridCellSize, gridCellSize, rounding);
      }
    }
    ctx.fill();
  }
  listeners() {
    howto.addEventListener("click", () => {
      window.location.href = `${location}howto`;
    });
  }
}
