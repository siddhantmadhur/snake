

class Snake {

    x
    y
    ctx

    /** @type {Snake | null} */
    child

    direction

    constructor(x, y, ctx) {
        this.x = x
        this.y = y
        this.child = null
        this.ctx = ctx
        this.direction = 2
    }

    move(newX, newY) {
        if (this.child != null) {
            this.child.move(this.x, this.y)
        }

        this.x = newX
        this.y = newY
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(this.x, this.y , 20, 20)
    }
}




async function main() {

    /** @type {HTMLCanvasElement} */
        const canvas = document.getElementById('canvas')


    const ctx = canvas.getContext("2d");
    if (ctx == null) return

   
    const thirdSnake = new Snake(10, 0, ctx)
    const secondSnake = new Snake(10, 5, ctx)
    secondSnake.child = thirdSnake

    const snake = new Snake(10, 10, ctx)
    snake.child = secondSnake

    setInterval(()=>{
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, 800, 800)
        switch (snake.direction) {
            case 1:
                snake.move(snake.x, snake.y - 20 )
                break;
            case 2:
                snake.move(snake.x + 20, snake.y )
                break;
            case 3:
                snake.move(snake.x, snake.y + 20 )
                break;
            case 4:
                snake.move(snake.x - 20, snake.y )
                break;
        }
    }, 700)

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
