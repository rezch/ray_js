let ray_k = 2;
let ray_dist = 1000;
let ray_collisions = 1;
let beam_density = 0.4;
let sc_width = 1400, sc_height = 800;

function setup() {
    createCanvas(sc_width, sc_height);
}

let walls = [];

class Wall {
    constructor(x, y, angle, len) {
        this.x = x
        this.y = y
        this.angle = angle / 57.3
        this.len = len
        walls.push(this)
    }

    draw() {
        let x4 = this.x + cos(this.angle) * this.len
        let y4 = this.y - sin(this.angle) * this.len
        strokeWeight(2)
        line(x4, y4, this.x, this.y)
    }

    intersect(x1, y1, x2, y2) {
        let x3 = this.x, y3 = this.y
        let x4 = x3 + cos(this.angle) * this.len
        let y4 = y3 - sin(this.angle) * this.len

        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false
        }
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

        if (denominator === 0) {
            return false
        }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

        return !(ua < 0 || ua > 1 || ub < 0 || ub > 1);
    }
}

class Ray {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle / 57.3
        this.angle_temp = this.angle;
        this.collisions = ray_collisions;
    }

    reflection(x, y, wall) {
        let newx = x + cos(this.angle_temp) * ray_k;
        let newy = y - sin(this.angle_temp) * ray_k;

        let inters = wall.intersect(x, y, newx, newy);
        if (inters) {
            this.collisions -= 1;
            this.angle_temp = 2 * wall.angle - this.angle_temp
            return 1;
        }
        return 0;
    }

    draw() {
        strokeWeight(4)
        let x = this.x, y = this.y;
        this.angle_temp = this.angle;
        this.collisions = ray_collisions;

        strokeWeight(0.6)
        let xstart = x, ystart = y;
        for (let i = 0; i < ray_dist; i++) {
            x += cos(this.angle_temp) * ray_k;
            y -= sin(this.angle_temp) * ray_k;

            for (const wall of walls) {
                if (this.reflection(x, y, wall)) {
                    line(xstart, ystart, x, y)
                    xstart = x
                    ystart = y
                }
            }

            if (this.collisions <= 0) {
                line(xstart, ystart, x, y)
                break;
            }
        }
        line(xstart, ystart, x, y)
    }
}


class Beam {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        for (let angle = 0; angle <= 360; angle += (1 - beam_density) * 10) {
            new Ray(this.x, this.y, angle).draw()
        }
    }
}


let border1 = new Wall (0, 0, 0, sc_width)
let border2 = new Wall (0, 0, -90, sc_height)
let border3 = new Wall (sc_width, 0, -90, sc_height)
let border4 = new Wall (0, sc_height, 0, sc_height)

//let ray = new Ray(150, 200, -5)

let wall1 = new Wall(350, 240, 30, 200)
let wall2 = new Wall(350, 240, -30, 200)
let wall3 = new Wall(523, 140, 55, 200)
let wall4 = new Wall(400, 340, 180, 400)
let wall5 = new Wall(800, 640, -42, 400)
let wall66 = new Wall(1000, 440, 120, 400)

let beam1 = new Beam(sc_width / 2, sc_height / 2);

function draw() {
    background(220);
    beam1.draw()
    /*if ((keyIsPressed === true) && (key === 'w')) {
        beam1.y -= 5
    }
    if ((keyIsPressed === true) && (key === 'a')) {
        beam1.x -= 5
    }
    if ((keyIsPressed === true) && (key === 's')) {
        beam1.y += 5
    }
    if ((keyIsPressed === true) && (key === 'd')) {
        beam1.x += 5
    }*/
    beam1.x = mouseX
    beam1.y = mouseY

    for (const wall of walls) {
        wall.draw()
    }
}
