// coded by rajibul 
//if u copy the code you gay (boys)
//if u copy the code you are not straight xd (girls)
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

var cwidth, cheight;
var shells = [];
var pass = [];

var colors = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
  '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', 
  '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', 
  '#FF6E40'
];

window.onresize = function () {
  reset();
};
reset();

function reset() {
  cwidth = window.innerWidth;
  cheight = window.innerHeight;
  c.width = cwidth;
  c.height = cheight;
}

// Function to create a new shell
function newShell() {
  var left = Math.random() > 0.5;
  var shell = {};
  shell.x = left ? 1 : 0;
  shell.y = 1;
  shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
  shell.yoff = 0.01 + Math.random() * 0.007;
  shell.size = Math.random() * 6 + 3;
  shell.color = colors[Math.floor(Math.random() * colors.length)];

  shells.push(shell);
}

// Function to create particles from a shell
function newPass(shell) {
  var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

  for (let i = 0; i < pasCount; i++) {
    var pas = {};
    pas.x = shell.x * cwidth;
    pas.y = shell.y * cheight;

    var a = Math.random() * 4;
    var s = Math.random() * 10;

    pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
    pas.yoff = s * Math.sin(a * (Math.PI / 2));

    pas.color = shell.color;
    pas.size = Math.sqrt(shell.size);

    if (pass.length < 500) pass.push(pas); // Limit particles for better performance
  }
}

var lastRun = 0;
Run();

// Main animation loop
function Run() {
  var dt = 1;
  if (lastRun != 0) {
    dt = Math.min(50, performance.now() - lastRun);
  }
  lastRun = performance.now();

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, cwidth, cheight);

  if (shells.length < 5 && Math.random() > 0.96) {
    newShell();
  }

  // Draw shells
  for (let ix in shells) {
    var shell = shells[ix];

    ctx.beginPath();
    ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
    ctx.fillStyle = shell.color;
    ctx.fill();

    shell.x -= shell.xoff;
    shell.y -= shell.yoff;
    shell.xoff -= shell.xoff * dt * 0.001;
    shell.yoff -= (shell.yoff + 0.2) * dt * 0.00005;

    if (shell.yoff < -0.005) {
      newPass(shell);
      shells.splice(ix, 1);
    }
  }

  // Draw particles
  for (let ix in pass) {
    var pas = pass[ix];

    ctx.beginPath();
    ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
    ctx.fillStyle = pas.color;
    ctx.fill();

    pas.x -= pas.xoff;
    pas.y -= pas.yoff;
    pas.xoff -= pas.xoff * dt * 0.001;
    pas.yoff -= (pas.yoff + 5) * dt * 0.0005;
    pas.size -= dt * 0.002 * Math.random();

    if (pas.y > cheight || pas.y < -50 || pas.size <= 0) {
      pass.splice(ix, 1);
    }
  }
  requestAnimationFrame(Run);
}

// Add touch event for interaction
c.addEventListener("click", function (e) {
  var shell = {};
  shell.x = e.clientX / cwidth;
  shell.y = e.clientY / cheight;
  shell.size = Math.random() * 6 + 3;
  shell.color = colors[Math.floor(Math.random() * colors.length)];
  newPass(shell);
});
