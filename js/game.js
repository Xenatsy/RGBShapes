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
for (let i=0; i<COLOR_COUNT; i++) {
    let rindex = randInt(colors.length);

    color = colors.find( (element, index) => index == rindex );

    choicedColors.push(`#${color}`);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


cell_size = 150;
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

canvas.onmousedown = (ev) => {
    let x = ev.offsetX;
    let y = ev.offsetY;

    for (let i = 0; i < data.pathes.length; i++){
        if (ctx.isPointInPath(data.pathes[i], x, y)) {
            
            let foundIndex = choicedColors.findIndex((element) => element == data.colors[i]);
            let color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
            
            document.title = `${data.coords[i].x}/${data.coords[i].y}`;
            switch (SHAPE){
                case 3:

                    break;
                case 4:
                    let
                        n1 = data.coords.findIndex((element)=> (data.coords[i].x == (element.x - 1)%WIDTH & data.coords[i].y == element.y)),
                        n2 = data.coords.findIndex((element)=> (data.coords[i].x == (element.x + 1)%WIDTH & data.coords[i].y == element.y)),
                        n3 = data.coords.findIndex((element)=> (data.coords[i].y == (element.y - 1)%HEIGHT & data.coords[i].x == element.x)),
                        n4 = data.coords.findIndex((element)=> (data.coords[i].y == (element.y + 1)%HEIGHT & data.coords[i].x == element.x));
                    
                    data.colors[i] = color;
                    data.colors[n1] = color;
                    data.colors[n2] = color;
                    data.colors[n3] = color;
                    data.colors[n4] = color;

                    break;

            }
            
            draw();
            break;
        };
    }
}




function draw() {
    for (let i=0; i<data.pathes.length; i++){
        ctx.fillStyle = data.colors[i];
        ctx.fill(data.pathes[i]);
    }
}

draw();

