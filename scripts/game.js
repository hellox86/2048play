import * as matrix from "./rotationMatrixModule.js";

const offset = 0;
const canvas = document.getElementById("canvas");
const fw = canvas.width;
const fh = canvas.height;

const gridCellSize = fw / 4;
const borderSize = 9;

const textSize = window.getComputedStyle(canvas).fontSize;

const font = "sans-serif";
const ratio = window.devicePixelRatio || 1;

canvas.width = fw * ratio;
canvas.height = fh * ratio;
canvas.style.width = fw + "px";
canvas.style.height = fh + "px";

const fillAreaSize = gridCellSize - borderSize;

const ctx = canvas.getContext("2d");
ctx.scale(ratio, ratio);
const tileColor = {
  2: "rgb(238, 228, 218)",
  4: "rgb(236, 224, 200)",
  8: "rgb(243, 178, 122)",
  16: "rgb(245, 149, 99)",
  32: "rgb(245, 124, 95)",
  64: "rgb(246, 93, 59)",
  128: "rgb(237, 206, 113)",
  256: "rgb(237, 204, 97)",
  512: "rgb(236, 200, 80)",
  1024: "rgb(237, 197, 63)",
  2048: "rgb(238, 194, 46)",
  default: "rgb(61, 58, 51)",
};
// fadein for tiles in field
let alpha = 0;

function fillCell(x, y, color, w = gridCellSize, h = gridCellSize) {
  ctx.fillStyle = color;
  ctx.fillRect(0.5 + x + offset, offset + y, w, h);
}

function fadeIn(x, y, color, w, h) {
  ctx.clearRect(x, y, w, h);
  ctx.globalAlpha = alpha;
  fillCell(x, y, color, w, h);
  if (alpha < 1) {
    alpha += 0.02;
    requestAnimationFrame(fadeIn);
  } else {
    alpha = 1;
  }
}

function createCell(num, pos, textColor) {
  const i = pos[0];
  const j = pos[1];

  ctx.fillStyle = textColor;
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 3;
  const res = num.toString();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.strokeText(
    res,
    offset + gridCellSize * j + gridCellSize / 2,
    offset + gridCellSize * i + gridCellSize / 2,
  );
  ctx.fillText(
    res,
    offset + gridCellSize * j + gridCellSize / 2,
    offset + gridCellSize * i + gridCellSize / 2,
  );
}

export class GameField {
  #f;
  #f2;
  count;
  constructor(f) {
    this.#f = f;
    this.count = 0;
  }
  #getFreeCells() {
    let res = [];
    let el_count = 0;

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.#f[i][j] == 0) {
          res[el_count++] = { row: i, col: j };
        }
      }
    }
    return res;
  }
  generateNum(times = 1) {
    let output;
    const randomInRange = (min, max) => {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
      );
    };

    for (let i = 0; i < times; ++i) {
      output = 2;
      const randIndex = randomInRange(0, 9);
      if (randIndex == 9) {
        output = 4;
      }

      let i = 0;
      let freeCells = this.#getFreeCells();
      let coord = {};
      let row,
        col = -1;
      coord = freeCells[randomInRange(0, freeCells.length - 1)];
      if (Object.keys(coord).length != 0) {
        row = coord["row"];
        col = coord["col"];
        this.#f[row][col] = output;

        const currentColor = output > 2 ? tileColor["4"] : tileColor["2"];
        const textColor = "rgb(117, 100, 82)";
        fadeIn(
          gridCellSize * col + 5,
          gridCellSize * row + 5,
          currentColor,
          fillAreaSize,
          fillAreaSize,
        );
        alpha = 0;
        ctx.font = `${textSize} ${font}`;
        createCell(this.#f[row][col], [row, col], textColor);
      }
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
        fillCell(x, y, "rgb(184, 169, 156)");
      }
    }
    ctx.lineWidth = borderSize;
    ctx.strokeStyle = "rgb(156, 138, 124)";
    ctx.stroke();
  }
  reset() {
    this.count = 0;
    this.draw();
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        this.#f[i][j] = 0;
      }
    }
    this.generateNum(2);
  }
  getF() {
    return this.#f;
  }
  setF(obj) {
    this.#f = obj;
  }
  update() {
    this.draw();
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.#f[i][j] != 0) {
          if (this.#f[i][j] > 2048) {
            fillCell(
              gridCellSize * j + 5,
              gridCellSize * i + 5,
              tileColor["default"],
              fillAreaSize,
              fillAreaSize,
            );
          } else {
            fillCell(
              gridCellSize * j + 5,
              gridCellSize * i + 5,
              tileColor[this.#f[i][j].toString()],
              fillAreaSize,
              fillAreaSize,
            );
          }
          ctx.font = `${textSize} ${font}`;
          const textColor =
            this.#f[i][j] <= 4 ? "rgb(117, 100, 82)" : "rgb(255, 255, 255)";
          createCell(this.#f[i][j], [i, j], textColor);
        }
      }
    }
  }
  moveLeft(f = true) {
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
      for (let j = 0; j < 4; ) {
        if (j + 1 < 4 && arr[i][j] == arr[i][j + 1]) {
          res[i][el_counter] = arr[i][j] * 2;
          j += 2;
          this.count += res[i][el_counter];
        } else {
          res[i][el_counter] = arr[i][j];
          ++j;
        }
        ++el_counter;
      }
      el_counter = 0;
    }
    if (f) {
      this.#f = res.slice();
    } else {
      this.#f2 = res.slice();
    }
  }
  cmp(prev, now) {
    return matrix.compareTwoMatrix(prev, now);
  }

  moveRight() {
    const prev = this.#f;
    this.#f = matrix.rotate_180(this.#f);
    this.moveLeft();
    this.#f = matrix.rotate_180(this.#f);
    const now = this.#f;
    return this.cmp(prev, now);
  }

  moveDown() {
    const prev = this.#f;
    this.#f = matrix.rotate_90cw(this.#f);
    this.moveLeft();
    this.#f = matrix.rotate_90ccw(this.#f);
    const now = this.#f;
    return this.cmp(prev, now);
  }

  moveUp() {
    const prev = this.#f;
    this.#f = matrix.rotate_90ccw(this.#f);
    this.moveLeft();
    this.#f = matrix.rotate_90cw(this.#f);
    const now = this.#f;
    return this.cmp(prev, now);
  }
  isFull() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.#f[i][j] == 0) {
          return false;
        }
      }
    }
    return true;
  }
  isGameOver() {
    const isMergeable = () => {
      this.moveLeft(false);
      for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
          if (
            (j < 3 && this.#f2[i][j] == this.#f2[i][j + 1]) ||
            (j > 0 && this.#f2[i][j] == this.#f2[i][j - 1]) ||
            (i < 3 && this.#f2[i][j] == this.#f2[i + 1][j]) ||
            (i > 0 && this.#f2[i][j] == this.#f2[i - 1][j])
          )
            return false;
        }
      }
      return true;
    };
    if (this.isFull() && isMergeable()) {
      return true;
    }
    return false;
  }
  print() {
    let res = "";
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        res += " " + this.#f[i][j];
      }
      console.log(res);
      console.log();
      res = "";
    }
    console.log();
  }
}

export const mem = matrix.createField();
