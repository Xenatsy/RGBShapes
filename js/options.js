function go(){
    shape = document.getElementById("shape").value;
    width = document.getElementById("width").value;
    height = document.getElementById("height").value;
    colors = document.getElementById("colors").value;


    localStorage.setItem("shape", shape);
    localStorage.setItem("width", width);
    localStorage.setItem("height", height);
    localStorage.setItem("colors", colors);

    if ((0 == width) || (0 == height) || (0 == colors) || (shape == 0)){
        let tip = document.getElementById("tip");
        tip.innerText = "Enter the full data!";
        tip.style.backgroundColor = "#F00";
        tip.style.color = "#000";


    } else {
        if (shape == 4) {
            window.location = "game.html";
        }
        else {
            tip.innerText = "This mode is not yet available...";
            tip.style.backgroundColor = "#FF0";
            tip.style.color = "#000";
        }
    }
}