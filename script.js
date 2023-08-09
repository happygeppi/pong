let updater;
const width = innerWidth;
const height = innerHeight;

const paddles = [];
let ball;

function Init() {
    CreateObjects();
    Update();
}

function CreateObjects() {
    const w = 20;
    const h = height / 4;
    const v = 10;
    paddles[0] = new Paddle(0, w, h, v);
    paddles[1] = new Paddle(1, w, h, v);

    const r = 10;
    const speed = 10;
    const acc = 0.01;
    ball = new Ball(r, speed, acc);
}

function Update() {
    paddles[0].update();
    paddles[1].update();
    ball.update();

    updater = requestAnimationFrame(Update);
}

function Score(player) {
    paddles[player].score++;
    document.querySelectorAll(".score")[player].innerHTML = paddles[player].score;
    ball.reset();
}

class Ball {
    constructor(r, v, a) {
        this.r = r;
        this.v0 = v;
        this.v = this.v0;
        this.acc = a;

        this.rgb = [255, 255, 255];

        this.reset();

        this.html = document.createElement("div");
        this.html.id = "ball";
        document.getElementById("game").append(this.html);
        this.html.style.width = `${2 * this.r}px`;
        this.html.style.backgroundColor = `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`
    }
    
    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.v = this.v0;
        this.rgb = [255, 255, 255];
        let a = Math.random() * Math.PI / 2 - Math.PI / 4;
        if (Math.random() < 0.5) a += Math.PI;
        this.vx = this.v * Math.cos(a);
        this.vy = this.v * Math.sin(a);
    }

    update() {
        this.move();
        this.show();
    }

    move() {
        this.v += this.acc;
        if (this.rgb[1] > 0) {
            this.rgb[1] -= 0.1;
            this.rgb[2] -= 0.1;
        } else if(this.rgb[0] > 0) this.rgb[0] -= 0.1;
        
        if (this.y < this.r) {
            this.y = this.r;
            this.vy *= -1;
        }
        if (this.y > height - this.r) {
            this.y = height - this.r;
            this.vy *= -1;
        }

        if (this.x < 2 * paddles[0].w + this.r)
            if (paddles[0].y < this.y && paddles[0].y + paddles[0].h > this.y) {
                this.x = 2 * paddles[0].w + this.r;
                this.vx *= -1;
                let a = Math.atan2(this.vy, this.vx);
                a += Math.random() * 0.5 - 0.25;
                this.vx = this.v * Math.cos(a);
                this.vy = this.v * Math.sin(a);
                // this.rgb[0] = Math.random() * 255;
                // this.rgb[1] = Math.random() * 255;
                // this.rgb[2] = Math.random() * 255;
            } else Score(0);
        
        if (this.x > width - 2 * paddles[0].w - this.r)
            if (paddles[1].y < this.y && paddles[1].y + paddles[1].h > this.y) {
                this.x = width - 2 * paddles[0].w - this.r;
                this.vx *= -1;
                let a = Math.atan2(this.vy, this.vx);
                a += Math.random() * 0.5 - 0.25;
                this.vx = this.v * Math.cos(a);
                this.vy = this.v * Math.sin(a);
                // this.rgb[0] = Math.random() * 255;
                // this.rgb[1] = Math.random() * 255;
                // this.rgb[2] = Math.random() * 255;
            } else Score(1);

        this.x += this.vx;
        this.y += this.vy;
    }

    show() {
        this.html.style.left = `${this.x}px`;
        this.html.style.top = `${this.y}px`;
        this.html.style.backgroundColor = `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`
    }
}

class Paddle {
    constructor(side, w, h, v) {
        this.w = w;
        this.h = h;
        this.x = side == 0 ? w : width - 2 * w;
        this.y = height / 2 - h / 2;
        this.v = v;
        this.side = side;

        this.score = 0;

        this.html = document.createElement("div");
        this.html.classList.add("paddle");
        document.getElementById("game").append(this.html);
        this.html.style.left = `${this.x}px`;
        this.html.style.top = `${this.y}px`;
        this.html.style.width = `${this.w}px`;
        this.html.style.height = `${this.h}px`;
    }

    update() {
        let dir = false;
        if (this.side == 0) {
            if (keyDown("w")) dir = -1;
            if (keyDown("s")) dir = 1;
        }
        else if (this.side == 1) {
            if (keyDown("ArrowUp")) dir = -1;
            if (keyDown("ArrowDown")) dir = 1;
        }

        if (!dir) return;

        this.move(dir);
        this.show();
    }

    move(dir) {
        this.y += dir * this.v;
        if (this.y < 0) this.y = 0;
        if (this.y + this.h > height) this.y = height - this.h;
    }

    show() {
        this.html.style.top = `${this.y}px`;
    }
}

let keysdown = [];

const keyDown = (key) => keysdown.includes(key);

document.addEventListener("keydown", (e) => {
    if (!keysdown.includes(e.key)) keysdown.push(e.key);
});
document.addEventListener("keyup", (e) => {
    keysdown.splice(keysdown.indexOf(e.key), 1);
});

Init();
