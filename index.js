const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d"),
fillColor = document.querySelector("#fill-color"),
tools = document.querySelectorAll(".options .tool"),
sizeSlider = document.querySelector("#size-slider input"),
colorBtns = document.querySelectorAll(".color .option"),
colorPicker = document.querySelector("#color-picker"),
saveImg = document.querySelector(".save-img");

let isDrawing = false,
prevMouseX, prevMouseY, snapShot,
brushWidth = 5,
selectedTool = "brush",
selectedColor;

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

function startDraw(e){
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(e){
    if(!isDrawing) return;
    ctx.putImageData(snapShot, 0, 0);
    if(selectedTool == "brush" || selectedTool == "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }else if(selectedTool == "rectangle"){
        drawRect(e);
    }else if(selectedTool == "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
}
function drawTriangle(e){
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
}
function drawCircle(e){
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
function drawRect(e){
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
for(let i = 0; i < tools.length; i++){
    tools[i].addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        tools[i].classList.add("active");
        selectedTool = tools[i].id;
    });
}
colorBtns.forEach(color => {
    color.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        color.classList.add("selected");
        selectedColor = window.getComputedStyle(color).getPropertyValue("background-color");
        console.log(selectedColor)
    });
})
function color(){
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
}
function save(){
    let link = document.createElement("a");
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL();
    link.click();
}

colorPicker.addEventListener("change", color);
sizeSlider.addEventListener("input", () => brushWidth = sizeSlider.value);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
saveImg.addEventListener("click", save);