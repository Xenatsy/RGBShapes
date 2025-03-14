
let colors = ["red", "green", "blue"];

function func(){
    var polygon = document.getElementById("polygon");
    index = Math.floor(Math.random()*colors.length);
    polygon.style.backgroundColor = colors[index];
}
