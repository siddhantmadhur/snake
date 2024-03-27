
class Apple {

    x
    y
    ctx

    constructor(x, y, ctx) {
        this.x = x
        this.y = y
        this.ctx = ctx
    }



}

class Snake {

    x
    y
    ctx

    /** @type {Snake | null} */
    child

    direction

    /** @type {Apple | null} */
    apple

    /** @type {Game | null} */
    game
    
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

    move(newX, newY) {
        if (this.child != null) {
            this.child.move(this.x, this.y)
        }



        this.x = newX
        this.y = newY



        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(this.x, this.y , 20, 20)
        if (this.apple != null) {
            if (this.apple.x == this.x && this.apple.y == this.y) {
                this.apple = new Apple(Math.floor(Math.random() * 40) * 20, Math.floor(Math.random() * 40) * 20)
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


class Game {

    /** @type {boolean} */
    game_finish
   

    /** @type {Snake} */
    player

    /** @type {CanvasRenderingContext2D} */
    ctx
    
    score


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
            this.ctx.fillRect(0, 0, 800, 800)
            this.ctx.fillStyle = 'white'
            this.ctx.font = "40px Arial"
            this.ctx.fillText("Game over: " + this.score, 350, 350 )
        } else {
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, 800, 800)
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

    snake.apple = new Apple(Math.floor(Math.random() * 40) * 20, Math.floor(Math.random() * 40) * 20)
    
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
