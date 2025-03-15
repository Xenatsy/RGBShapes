const SHAPE = Number(localStorage.getItem("shape"));
const WIDTH = localStorage.getItem("width");
const HEIGHT = localStorage.getItem("height");
const COLOR_COUNT = localStorage.getItem("colors");

randInt = (max) => { 
    return Math.floor(Math.random()*max);
}

const letters = "0123456789ABCDEF";
var colors = cartesian(letters, letters);
colors.forEach(
    (item, index) => {
        colors[index] = item.join("");
    }
);
colors = cartesian(colors, letters);
colors.forEach(
    (item, index) => {
        colors[index] = item.join("");
    }
);

var choicedColors = [];
function colorRefresher() {
    for (let i=0; i<COLOR_COUNT; i++) {
        let rindex = randInt(colors.length);

        color = colors.find( (element, index) => index == rindex );

        choicedColors.push(`#${color}`);
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


cell_size = 100;
switch (SHAPE){
    case 3:
        canvas.width  = cell_size * WIDTH / 2 + cell_size / 2;
        canvas.height = 3 ** .5 * cell_size * HEIGHT / 2;
        break;
    case 4:
        canvas.width  = cell_size * WIDTH;
        canvas.height = cell_size * HEIGHT;
        break;
    case 6:
        canvas.width  = cell_size * (3 * WIDTH + 1) / 2;
        canvas.height = 3 ** .5 * cell_size * HEIGHT + 3 ** .5 * cell_size / 2;
        break;
}



var data = {
    pathes: [],
    polies: [],
    colors: [],
    coords: []
};

// Init
colorRefresher();
let i = 0;
for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
        data.polies.push(FitToBoard(SHAPE, x, y, cell_size));
        data.pathes.push(new Path2D());
            data.polies[i].forEach(
                element => { data.pathes[i].lineTo(element.x, element.y);}
            );
            data.pathes[i].closePath();
        data.colors.push(choicedColors[0]);
        data.coords.push(new Point(x, y));
        i++;
    }
}

function check(){
    examenCell = data.colors[0];
    for (let i=1; i<data.colors.length; i++)
        if (examenCell != data.colors[i])
            return false;
    return true;
}
function shuffle(){
    colorRefresher();
    var shuffleSteps = document.getElementById("shuffleSteps").value; 
    for (let i = 0; i < shuffleSteps; i++) {
        switch (SHAPE){
            case 3:
                break;
            case 4:
                // Randomly select any point
                var randomPoint = new Point(randInt(WIDTH), randInt(HEIGHT));
                // Calculate neighbours
                n1 = new Point(randomPoint.x - 1, randomPoint.y);
                n2 = new Point(randomPoint.x + 1, randomPoint.y);
                n3 = new Point(randomPoint.x, randomPoint.y - 1);
                n4 = new Point(randomPoint.x, randomPoint.y + 1);
                data.coords.findIndex((element, index)=>{
                    if (n1.x == element.x && n1.y == element.y ){
                        n1 = index;
                    }
                    if (n2.x == element.x && n2.y == element.y){
                        n2 = index;
                    }
                    if (n3.x == element.x && n3.y == element.y){
                        n3 = index;
                    }
                    if (n4.x == element.x && n4.y == element.y){
                        n4 = index;
                    }
                });
                [n1, n2, n3, n4].forEach(index => {
                        foundIndex = choicedColors.findIndex((element) => element == data.colors[index]);
                        color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
                        data.colors[index] = color;
                    });
                break;
            case 6:
                break;
        }
    }
    draw();
}

canvas.onmousedown = (ev) => {
    let x = ev.offsetX;
    let y = ev.offsetY;


    for (let i = 0; i < data.pathes.length; i++) {
        if (ctx.isPointInPath(data.pathes[i], x, y)) {
            
            let foundIndex = choicedColors.findIndex((element) => element == data.colors[i]);
            let color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
            data.colors[i] = color;

            switch (SHAPE){
                case 3:

                    break;
                case 4:
                    
                    let n1, n2, n3, n4;
                    data.coords.findIndex((element, index) => {
                        if ((element.x == (data.coords[i].x + 1) % WIDTH) && (data.coords[i].y == element.y)){
                            n1 = index;
                        }
                        if ((data.coords[i].x == (element.x + 1) % WIDTH) && (data.coords[i].y == element.y)){
                            n2 = index;
                        }
                        if ((element.y == (data.coords[i].y + 1) % HEIGHT) && (data.coords[i].x == element.x)){
                            n3 = index;
                        }
                        if ((data.coords[i].y == (element.y + 1) % HEIGHT) && (data.coords[i].x == element.x)){
                            n4 = index;
                        }
                    });
                    [n1, n2, n3, n4].forEach( index => {
                        foundIndex = choicedColors.findIndex((element) => element == data.colors[index]);
                        color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
                        data.colors[index] = color;
                    } );
                    break;
            }
            break;
        };
    
    }
    draw(); 
    
}

canvas.onmouseup = (ev) => {
    if (check()){
        alert("Головоломка собрана!");
    }
}




function draw() {
    for (let i=0; i<data.pathes.length; i++){
        ctx.fillStyle = data.colors[i];
        ctx.fill(data.pathes[i]);
    }
    
}

draw();

