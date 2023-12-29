class Cell
{
    static width = 10;
    static height = 10;

    constructor (context, gridX, gridY)
    {
        this.context = context;

        this.gridX = gridX;
        this.gridY = gridY;

        this.alive = Math.random() > 0.99;
    }

    draw() {
        if (this.alive)
        {
          this.context.fillStyle = '#7bc99a';
          this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
        }
    }
}

class GameWorld {

    static numColumns = 75;
    static numRows = 40;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 500;
        this.canvas.height = 500;

        this.gameObjects = [];

        this.createGrid();

        window.requestAnimationFrame(() => this.gameLoop());
    }

    createGrid()
    {
        for (let y = 0; y < GameWorld.numRows; y++) {
            for (let x = 0; x < GameWorld.numColumns; x++) {
                this.gameObjects.push(new Cell(this.context, x, y));
            }
        }
    }

    isAlive(x, y)
    {
        if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows){
            return false;
        }

        return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
    }

    gridToIndex(x, y){
        return x + (y * GameWorld.numColumns);
    }

    checkSurrounding ()
    {
        for (let x = 0; x < GameWorld.numColumns; x++) {
            for (let y = 0; y < GameWorld.numRows; y++) {

                let numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);
                let centerIndex = this.gridToIndex(x, y);

                if (numAlive % 2 === 1)
                {
                  this.gameObjects[centerIndex].nextAlive = true;
                }
                else
                {
                  this.gameObjects[centerIndex].nextAlive = false;
                }

                /*if (numAlive == 2)
                {
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                }
                else if (numAlive == 3)
                {
                    this.gameObjects[centerIndex].nextAlive = true;
                }
                else
                {
                    this.gameObjects[centerIndex].nextAlive = false;
                }*/
            }
        }

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
        }
    }

    gameLoop() {
        this.checkSurrounding();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        setTimeout( () => {
            window.requestAnimationFrame(() => this.gameLoop());
        }, 500)
    }
}

window.onload = () => {
  let gameWorld = new GameWorld('life-canvas');
}