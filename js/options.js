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
        alert("Enter the full data!");
    } else {
        if (shape == 6){
            alert("This mode is not yet available...");
        } else {
            document.location = "game.html";
        }
    }
}