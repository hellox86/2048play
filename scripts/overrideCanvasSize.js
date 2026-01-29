const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("animation");

function resize() {
  canvas2.width = canvas.width = canvas.clientWidth;
  canvas2.height = canvas.height = canvas.clientHeight;
}

resize();
