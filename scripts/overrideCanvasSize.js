const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("animation");

function resize() {
  canvas2.width = canvas2.clientWidth;
  canvas.width = canvas.clientWidth;
  canvas2.height = canvas2.clientWidth;
  canvas.height = canvas.clientHeight;
}

resize();
