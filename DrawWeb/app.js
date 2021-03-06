var socket = io();

var canvas = document.getElementById("draw");
var drawing = false;


var ctx = canvas.getContext("2d");
resize();


function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mousedown", pressDown);
document.addEventListener("mouseup", pressUp);
document.addEventListener("touchstart", pressDown, false);
document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchend", pressUp, false);



var pos = {x: 0, y: 0, size: document.getElementById("penSize").value,
              color: document.getElementById("colorSel").value};

var clear = document.getElementById("clear");

clear.addEventListener("click", function(event){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function touchDown(e){
    drawing = true;
    pos.size= document.getElementById("penSize").value;
    pos.color= document.getElementById("colorSel").value;
    pos.x = e.touches[0].clientX;
    pos.y = e.touches[0].clientY;
}

function touchMove(e){
  e.preventDefault();
  if (!drawing) { return; }
  draw(pos.x, pos.y, e.touches[0].clientX, e.touches[0].clientY, pos.color, pos.size, true);
  pos.size= document.getElementById("penSize").value;
  pos.color= document.getElementById("colorSel").value;
  pos.x = event.touches[0].clientX;
  pos.y = event.touches[0].clientY;

}


function mouseMove(e){
    if (!drawing) { return; }
    draw(pos.x, pos.y, e.clientX, e.clientY, pos.color, pos.size, true);
    pos.size= document.getElementById("penSize").value;
    pos.color= document.getElementById("colorSel").value;
    pos.x = e.clientX;
    pos.y = e.clientY;

  }

function pressDown(e){
  drawing = true;
  pos.size= document.getElementById("penSize").value;
  pos.color= document.getElementById("colorSel").value;
  pos.x = e.clientX;
  pos.y = e.clientY;
}

function pressUp(e){
    if (!drawing) {
      return;
    }
    drawing = false;
    draw(pos.x, pos.y, e.clientX, e.clientY, pos.color, pos.size, true);
  }


function draw(x, y, x1, y1, color, size, emit) {
    xI = x-8;
    xF = x1-8;
    yI = y-58;
    yF = y1-58;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.moveTo(xI, yI);
    ctx.lineTo(xF, yF);
    ctx.stroke();
    ctx.closePath();

    if (emit){
      var w = canvas.width;
      var h = canvas.height;

      socket.emit('drawings', {
        x: x / w,
        y: y / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
        size: size
      });
    }
  }

    socket.on('drawings', function(data){
      var w = canvas.width;
      var h = canvas.height;
      draw(data.x * w, data.y * h, data.x1 * w, data.y1 * h, data.color, data.size);
    });
