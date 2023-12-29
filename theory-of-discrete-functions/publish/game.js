var requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

const Resources = {
    loaded: 0,
    total: 0,
    images: {},
    onComplete: null,

    load(urls) {
        this.total = urls.length;
        this.loaded = 0;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const image = new Image();

            image.addEventListener('load', () => {
                this.loaded++;
                this.images[url] = image;

                if (this.loaded === this.total && typeof this.onComplete === 'function') {
                    this.onComplete();
                }
            });

            image.addEventListener('error', () => {
                console.error(`Error loading image: ${url}`);

                this.loaded++;

                if (this.loaded === this.total && typeof this.onComplete === 'function') {
                    this.onComplete();
                }
            });

            image.src = url;
        }
    },

    onReady(callback) {
        if (typeof callback === 'function') {
            this.onComplete = callback;

            if (this.loaded === this.total) {
                this.onComplete();
            }
        }
    },

    get(url) {
        return this.images[url] || null;
    }
};

const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

const comp_table_canvas = document.getElementById('table-canvas');
const comp_table_ctx = comp_table_canvas.getContext('2d');

const diam_table_canvas = document.getElementById('diam-table-canvas');
const diam_table_ctx = diam_table_canvas.getContext('2d');

const heart_table_canvas = document.getElementById('heart-table-canvas');
const heart_table_ctx = heart_table_canvas.getContext('2d');

const diagram_canvas = document.getElementById('diagram-canvas');
const diagram_ctx = diagram_canvas.getContext('2d');

const computers_table = [
  ['img/cp.png', 'img/cy.png', 'img/cg.png'],
];

const hearts_table = [["red_heart", "purple_heart"]];
const diamonds_table = [["purple", "cyan", "green", "red"],
                        ["orange", "pink", "yellow", "grey"]]

const margin = 30;
const space = 30;

const width = 500;
const height = 300;
const table_height = 300;
canvas.width = width;
canvas.height = height;

comp_table_canvas.width = width;
diam_table_canvas.width = width;
heart_table_canvas.width = width;

diagram_canvas.width = width;
diagram_canvas.height = width;

const boxWidth = 129;
const boxHeight = 138;
const boxX = width / 2 - boxWidth / 2;
const boxY = height / 2 - boxHeight / 2;

const leftSpriteX = boxX - 50;
const leftSpriteY = boxY + boxHeight / 2;
const rightSpriteX = boxX + boxWidth + 50;
const rightSpriteY = boxY + boxHeight / 2;

const sprites = {
    "purple": [0, 0],
    "cyan": [0, 1],
    "green": [0, 2],
    "red": [0, 3],
    "orange": [0, 4],
    "pink": [1, 0],
    "blue": [1, 1],
    "yellow": [1, 2],
    "grey": [1, 4],
    "red_heart": [2, 1],
    "purple_heart": [2, 2],
};

let a = "red_heart";
const states = ["purple", "cyan", "green", "red", "orange", "pink", "yellow", "grey"];
const computers = ["img/cy.png", "img/cg.png", "img/cp.png"];

let dashOffset = 0;
let index = 0;
const dashSpeed = 1;
let spriteWidth = 80;
let spriteHeight = 80;


function main() {
    drawBox();
    requestAnimFrame(main);
};


function init() {
    drawTable(computers_table, 50, 70, 20, drawComp, comp_table_ctx, comp_table_canvas);
    drawTable(diamonds_table, 50, 50, 20, drawSprite, diam_table_ctx, diam_table_canvas);
    drawTable(hearts_table, 50, 100, 50, drawSprite, heart_table_ctx, heart_table_canvas);
    drawDiagram();
    main();
}

const resources = Object.create(Resources);

resources.load([
    'img/cy.png',
    'img/cg.png',
    'img/cp.png',
    'img/dhs2.png'
]);
resources.onReady(init);

function drawDiagram() {
    const comp1 = resources.get("img/cy.png");
    const comp2 = resources.get("img/cg.png");
    const comp3 = resources.get("img/cp.png");

    const x1 = width / 2 - comp1.width / 2;
    const y1 = 50;

    const x2 = width / 5 - comp2.width / 2;
    const y2 = width - y1 - comp2.height;

    const x3 = 4 * width / 5 - comp2.width / 2;
    const y3 = width - y1 - comp2.height;

    diagram_ctx.drawImage(comp1, x1, y1, boxWidth, boxHeight);
    diagram_ctx.drawImage(comp2, x2, y2, boxWidth, boxHeight);
    diagram_ctx.drawImage(comp3, x3, y3, boxWidth, boxHeight);

}


function drawTable(table, margin_top, margin_side, space, draw_function, ctx, canvas) {
    const n_cols = table[0].length;
    const n_rows = table.length;
    const cellWidth = (width - 2 * margin_side - space * (n_cols - 1)) / n_cols;
    const cellHeight = cellWidth;
    canvas.height = 2 * margin_top + n_rows * cellHeight;
    for (let row = 0; row < n_rows; row++) {
        for (let col = 0; col < n_cols; col++) {

            const x = margin_side + col * (cellWidth + space);
            const y = margin_top + row * cellHeight;

            draw_function(table[row][col], x, y, cellWidth, cellHeight, ctx);
        }
    }
}

function drawComp(img_url, x, y, cellWidth, cellHeight, ctx) {
    ctx.drawImage(resources.get(img_url), x, y, cellWidth, cellHeight);
}

function drawSprite(name, x, y, cellWidth, cellHeight, ctx) {
    const sprite = sprites[name];
    const image = resources.get('img/dhs2.png');

    ctx.drawImage(
        image,
        sprite[1] * spriteWidth,
        sprite[0] * spriteHeight,
        spriteWidth,
        spriteHeight,
        x,
        y,
        cellWidth,
        cellHeight
    );
}

function drawBox() {
    const sprite = sprites[states[index % states.length]];
    const x = sprite[1];
    const y = sprite[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dashOffset += dashSpeed;
    if (dashOffset > 10)
    {
        dashOffset = 0;
    }

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -dashOffset;
    ctx.moveTo(leftSpriteX - spriteWidth / 2, leftSpriteY);
    ctx.lineTo(boxX, boxY + boxHeight / 2);
    ctx.lineTo(rightSpriteX + spriteWidth / 2, rightSpriteY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(resources.get(computers[index % computers.length]), 
        boxX, 
        boxY, 
        boxWidth, 
        boxHeight
    );
    
   
    ctx.drawImage(
        resources.get('img/dhs2.png'),
        1 * spriteWidth,
        2 * spriteHeight,
        spriteWidth,
        spriteHeight,
        leftSpriteX - spriteWidth,
        leftSpriteY - spriteHeight / 2,
        spriteWidth,
        spriteHeight
    );

    ctx.drawImage(
        resources.get('img/dhs2.png'),
        x * spriteWidth,
        y * spriteHeight,
        spriteWidth,
        spriteHeight,
        rightSpriteX,
        rightSpriteY - spriteHeight / 2,
        spriteWidth,
        spriteHeight
    );
}

const slider = document.getElementById("slider");

function handleSliderChange() {
    index = parseInt(slider.value) - 1;
}

const button = document.getElementById('state_button');
const iconImage = document.getElementById('iconImage');
const images = ['img/red_heart.png', 'img/purple_heart.png']; // Add paths to your different icon images

let currentIndex = 0;

button.addEventListener('click', function() {
  currentIndex = (currentIndex + 1) % images.length; // Cycle through the images
  iconImage.src = images[currentIndex]; // Change the image source
});

slider.addEventListener("input", handleSliderChange);
