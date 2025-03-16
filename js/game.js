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
        canvas.width  = cell_size * (3 * WIDTH + 1) / 2 / 2;
        canvas.height = 3 ** .5 * cell_size * HEIGHT / 2 + 3 ** .5 * cell_size / 2 / 2;
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
        data.polies.push(FitToBoard(SHAPE, x, y, SHAPE==6 ? cell_size / 2 : cell_size));
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
    let shuffleSteps = document.getElementById("shuffleSteps").value; 
    if (shuffleSteps > 0){
        document.getElementById('menu-container').style.borderColor = '#F00';
    }
    for (let i = 0; i < shuffleSteps; i++) {
        let randomPoint = new Point(randInt(WIDTH), randInt(HEIGHT));
        nes = getNeighbourhood(SHAPE, randomPoint, 1);
        
        data.coords.findIndex((el, index) => {
            for (let i = 0; i < nes.length; i++){
                if (nes[i].x == el.x && nes[i].y == el.y ){
                    nes[i] = index;
                }
            }
        });

        nes.forEach(index => {
                foundIndex = choicedColors.findIndex((element) => element == data.colors[index]);
                color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
                data.colors[index] = color;
            });
        }
    draw();
}

canvas.onmousedown = (ev) => {
    let x = ev.offsetX;
    let y = ev.offsetY;

    for (let i = 0; i < data.pathes.length; i++) {
        if (ctx.isPointInPath(data.pathes[i], x, y)) {
            let neighbourhood = getNeighbourhood(SHAPE, data.coords[i], 1);
            neighbourhood.forEach( el1 => {
                data.coords.forEach( (el2, index) => {
                    if (el1.x == el2.x && el1.y == el2.y){
                        let foundIndex = choicedColors.findIndex((element) => element == data.colors[index]);
                        let color = choicedColors[(foundIndex + 1)%COLOR_COUNT];
                        data.colors[index] = color;
                    }
                });
            });
            break;
            }
        };
    draw(); 

}

canvas.onmouseup = (ev) => {
    document.getElementById('menu-container').style.borderColor = (check()? '#0F0': '#F00');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i=0; i<data.pathes.length; i++){
        ctx.fillStyle = data.colors[i];
        ctx.fill(data.pathes[i]);
    }
    
}

draw();

