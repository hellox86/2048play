import * as matrix from "./rotationMatrixModule.js";
const tilesColor = {
  2: "#7cb5e2",
  4: "#4495d4",
  8: "#2f6895",
  16: "#f5bd70",
  32: "#f2a032",
  default: "#eeeeee",
};
const elements = table.querySelectorAll("tr");
const howto = document.getElementById("howto");
const restart = document.getElementById("restart");

function randomInRange(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export class Game {
  #f;

  constructor() {
    this.#f = matrix.createField();
  }
  init() {
    this.#clearAll();
    this.generateNumber(2);
  }

  #clearAll() {
    this.#f = matrix.createField();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const el = elements[i].children[j.toString()];
        el.innerText = "";
        el.style.backgroundColor = tilesColor["default"];
        el.classList.remove("fade-in");
        el.classList.remove("movement");
      }
    }
  }
  listeners() {
    howto.addEventListener("click", () => {
      window.location.href = `${location}howto`;
    });
    restart.addEventListener("click", () => {
      this.init();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowLeft") {
        if (!this.moveLeft()) {
          this.generateNumber(1);
        }
      } else if (e.key == "ArrowRight") {
        if (!this.moveRight()) {
          this.generateNumber(1);
        }
      } else if (e.key == "ArrowUp") {
        if (!this.moveUp()) this.generateNumber(1);
      } else if (e.key == "ArrowDown") {
        if (!this.moveDown()) this.generateNumber(1);
      }
      console.log(this.#f);
    });
  }

  #getFreeCells() {
    let res = [];
    let el_count = 0;

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.#f[i][j] == 0) {
          res.push({ row: i, col: j });
        }
      }
    }
    return res;
  }

  generateNumber(n) {
    let out = 0;

    for (let i = 0; i < n; ++i) {
      if (randomInRange(0, 9) == 9) {
        out = 4;
      } else {
        out = 2;
      }
      const freeCells = this.#getFreeCells();
      const coord = freeCells[randomInRange(0, freeCells.length - 1)];
      let row = coord["row"];
      let col = coord["col"];
      this.#f[row][col] = out;
      const el = elements[row].children[col.toString()];
      el.innerText = out;
      el.style.backgroundColor = tilesColor[out.toString()];
      el.classList.remove("fade-in");
      el.classList.add("fade-in");
      el.classList.add("movement");
    }
  }
  getF() {
    return this.#f;
  }
  cmp(prev, now) {
    return matrix.compareTwoMatrix(prev, now);
  }

  moveLeft() {
    let arr = matrix.createField();
    const prev = this.#f;
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

    this.#f = res.slice();

    return this.cmp(prev, this.#f);
  }
  moveRight() {
    this.#f = matrix.rotate_180(this.#f);
    let fl = this.moveLeft();
    this.#f = matrix.rotate_180(this.#f);
    return fl;
  }

  moveDown() {
    this.#f = matrix.rotate_90cw(this.#f);
    let fl = this.moveLeft();
    this.#f = matrix.rotate_90ccw(this.#f);
    return fl;
  }

  moveUp() {
    this.#f = matrix.rotate_90ccw(this.#f);
    let fl = this.moveLeft();
    this.#f = matrix.rotate_90cw(this.#f);
    return fl;
  }
}
