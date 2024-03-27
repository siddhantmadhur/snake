

/**
    * This is the object for the user to collide with to get a point
    *
    */
class Apple {

    /** @type {number} */
    x

    /** @type {number} */
    y
    
    /** @type {CanvasRenderingContext2D} */
    ctx

    /** 
        * @constructor
        * @param {number} x 
        * @param {number} y 
        * @param {CanvasRenderingContext2D} ctx 
        * */
    constructor(x, y, ctx) {
        this.x = x
        this.y = y
        this.ctx = ctx
    }



}
/** Recursive snake object containing all the steps for the player to move, collect apples and grow */
class Snake {

    /** @type {number} */
    x

    /** @type {number} */
    y
    
    /** @type {CanvasRenderingContext2D} */
    ctx

    /** @type {Snake | null} */
    child


    /** @type {number} */
    direction

    /** @type {Apple | null} */
    apple

    /** @type {Game | null} */
    game
   

    /** 
        * @constructor
        * @param {number} x 
        * @param {number} y 
        * @param {CanvasRenderingContext2D} ctx 
        * */
    constructor(x, y, ctx) {
        this.x = x
        this.y = y
        this.child = null
        this.ctx = ctx
        this.direction = 2
        this.apple = null
        this.game = null
    }



    /**
        * @param {Map} player_grid 
        * @returns {Map}
        * */
    is_tangled(player_grid) {
        if (`${this.x}_${this.y}` in player_grid) {
            this.game.game_finish = true
            return player_grid
        }else {
            player_grid.set(`${this.x}_${this.y}`, 1)
            if (this.child != null) {
                return this.child.is_tangled(player_grid)
            }
        }

        return player_grid
    }

    /**
        * @param {number} newX 
        * @param {number} newY 
        * */
    move(newX, newY) {
        if (this.child != null) {
            this.child.move(this.x, this.y)
        }



        this.x = newX
        this.y = newY


        if (this.x < 0 || this.x > 400 || this.y < 0 || this.y > 400){
            this.game.game_finish = true
            return

        }


        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(this.x, this.y , 20, 20)
        if (this.apple != null) {
            if (this.apple.x == this.x && this.apple.y == this.y) {
                this.apple = new Apple(Math.floor(Math.random() * 20) * 20, Math.floor(Math.random() * 20) * 20)
                this.appendSnake()
                this.game.score += 1
            }else{
                this.ctx.fillStyle = 'red'
                this.ctx.fillRect(this.apple.x, this.apple.y , 20, 20)
                let snake_map = new Map();
                const map_of_spots = this.is_tangled(snake_map)
                if (map_of_spots.size != this.length) {
                    this.game.game_finish = true
                } 
            }
        }
    }

    /**
        * Appends a new snake recursively
        * @param {number} x
        * @param {number} y 
        * */
    appendSnake() {

        if (this.child != null) {
            this.child.appendSnake()
        }else{
           this.child = new Snake(this.x, this.y, this.ctx) 
        }
    }

    /**
        * Appends a new snake recursively
        * @param {Snake} y 
        * */

    get length() {
        if (this.child != null) {
            return 1 + this.child.length
        }else{
            return 1
        }

    }
}


/**
    * Manages game state
    *
    * */
class Game {

    /** @type {boolean} */
    game_finish
   

    /** @type {Snake} */
    player

    /** @type {CanvasRenderingContext2D} */
    ctx
    
    /** @type {number} */
    score


    /** 
        * @constructor
        * @param {CanvasRenderingContext2D} ctx 
        * @param {Snake} snake
        * */
    constructor(ctx, snake) {
        this.game_finish = false
        this.ctx = ctx
        this.player = snake
        this.player.game = this
        this.score = 0
    }



    render() {
        

        if (this.game_finish) {
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, 400, 400)
            this.ctx.fillStyle = 'white'
            this.ctx.font = "20px Arial"
            this.ctx.fillText("Game over: \n" + this.score, 10, 50 )
        } else {
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, 400, 400)
            switch (this.player.direction) {
                case 1:
                    this.player.move(this.player.x, this.player.y - 20 )
                    break;
                case 2:
                    this.player.move(this.player.x + 20, this.player.y )
                    break;
                case 3:
                    this.player.move(this.player.x, this.player.y + 20 )
                    break;
                case 4:
                    this.player.move(this.player.x - 20, this.player.y )
                    break;
            }
        }
    }
}

async function main() {

    /** @type {HTMLCanvasElement} */
        const canvas = document.getElementById('canvas')


    const ctx = canvas.getContext("2d");
    if (ctx == null) return

   
    const thirdSnake = new Snake(20, 0, ctx)
    const secondSnake = new Snake(20, 20, ctx)
    secondSnake.child = thirdSnake

    const snake = new Snake(20, 40, ctx)
    snake.child = secondSnake

    snake.apple = new Apple(Math.floor(Math.random() * 20) * 20, Math.floor(Math.random() * 20) * 20)
    
    const game = new Game(ctx, snake)

    setInterval(()=>{
        game.render()
    }, 200)

    document.addEventListener("keydown", (event)=>{
        if (event.key === "w" && (snake.direction != 3)) {
            snake.direction = 1
        } else if (event.key === "d" && (snake.direction != 4)) {
            snake.direction = 2
        } else if (event.key === "s" && (snake.direction != 1)) {
            snake.direction = 3
        } else if (event.key === "a" && (snake.direction != 2)) {
            snake.direction = 4
        }
    })
}



main();
