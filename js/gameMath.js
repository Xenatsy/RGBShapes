const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;
const abs = Math.abs;
const max = Math.max;

var scaleBySide = { 3: 3, 4: 2, 6: 1 };
var rotationBySide = { 3: 30, 4: 45, 6: 60 };

function getNeighbourhood(shape, point, radius=1) {
    if (radius < 1) {
        return [];
    }

    let  neighbourhood = [];
    switch (shape) {
        case 3:
            neighbourhood = [
                new Point(point.x - 1, point.y),
                new Point(point.x + 1, point.y),
                (point.x + point.y) % 2?
                    new Point(point.x, point.y + 1): 
                        new Point(point.x, point.y - 1)
            ]; break;
        case 4:
            neighbourhood = [
                new Point(point.x - 1, point.y),
                new Point(point.x, point.y - 1),
                new Point(point.x + 1, point.y),
                new Point(point.x, point.y + 1),
            ]; break;
            
        case 6:
            neighbourhood = [
                new Point(point.x - 1, point.y),
                new Point(point.x + 1, point.y),
                new Point(point.x, point.y - 1),
                new Point(point.x, point.y + 1),
                point.x % 2?
                    new Point(point.x + 1, point.y + 1):
                        new Point(point.x - 1, point.y - 1),
                point.x % 2?
                    new Point(point.x - 1, point.y + 1):
                            new Point(point.x + 1, point.y - 1),
            ]; break;
    }
    neighbourhood = neighbourhood.concat(point).concat(
        neighbourhood.map(el => getNeighbourhood(shape, el, radius-1))
    ).flat();
    return Array.from(new Set(neighbourhood));
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function cartesian(arr1, arr2) {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            result.push([arr1[i], arr2[j]]);
        }
    }
    return result;
}

function getPerfectPolygon(sideLength, vertexCount) {
    let angle = 2 * Math.PI / vertexCount;
    let points = [];
    for (let i = 0; i < vertexCount; i++) {
        a = i * angle;
        x = sideLength * cos(a);
        y = sideLength * sin(a);
        points.push(new Point(x, y));
    }
    return points;
}

function movePolygon(vertices, dVector) {
    vertices.forEach(element => {
        element.x += dVector.x;
        element.y += dVector.y;
    });
}

function rotate_point(x, y, theta) {
    return new Point(
        x * cos(theta) - y * sin(theta),
        x * sin(theta) + y * cos(theta),
    );
}

function FitToBoard(sides, x, y, size) {
    let length = size / scaleBySide[sides] ** .5;
    let rotation = PI * rotationBySide[sides] / 180;

    let polygon = getPerfectPolygon(length, sides);

    let condition = (x + y) % 2 == 1;
    let dVector;
    switch (sides) {
        case 3:
            polygon.forEach((element, index) => {
                polygon[index] = rotate_point(
                    element.x, element.y,
                    !condition ? PI / 2 : rotation
                );
            });
            dVector = new Point((x + 1) * size / 2, 3 ** .5 * size * (3 * y + 2) / 6 - (!condition ? length / 2 : 0));
            break;
        case 4:
            polygon.forEach((element, index) => {
                polygon[index] = rotate_point(
                    element.x, element.y,
                    rotation
                );
            });
            dVector = new Point(size * (.5 + x), size * (.5 + y));
            break;
        case 6:
            dVector = new Point(3 * size * x / 2 + size, 3 ** .5 * size * (y + (x % 2 ? .5 : 0)) + size * 3 ** .5 / 2);
            break;
            dVector = new Point(0, 0);
            break;

    }
    movePolygon(polygon, dVector);

    return polygon;
}
