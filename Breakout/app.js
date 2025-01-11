const gameBoard = document.querySelector('#game-board')
const scoreDisplay = document.querySelector('#score')
const message = document.querySelector('.message')

const boardWidth = 560
const boardHeight = 300

const blockWidth = 100
const blockHeight = 20

const userStart = [230, 10]
let currentPosition = userStart
const user = document.querySelector('#user')
user.style.left = currentPosition[0] + 'px'
user.style.bottom = currentPosition[1] + 'px'

const ballStart = [270, 40]
let ballCurrentPosition = ballStart
const ball = document.querySelector('#ball')
const ballDiameter = 20
let xDirection = 2
let yDirection = 2

let score = 0
let timerId
let gameStarted = false

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = []

function generateBlocks() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            blocks.push(new Block(j * (blockWidth + 10) + 10, (i * (blockHeight + 10)) + 200))
        }
    }
}

generateBlocks()

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        gameBoard.appendChild(block)
    }
}

addBlocks()

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 20
                user.style.left = currentPosition[0] + 'px'
            }
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 20
                user.style.left = currentPosition[0] + 'px'
            }
            break
        case ' ':
            if (!gameStarted) {
                startGame()
            }
            break
    }
}

document.addEventListener('keydown', moveUser)

function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
    checkForCollisions()
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true
        timerId = setInterval(moveBall, 16)
        message.style.display = 'none'
    }
}

message.style.display = 'block'
message.textContent = 'Press SPACE to start\nUse ← → to move'

function checkForCollisions() {
    
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && 
             ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && 
             ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].remove()
            blocks.splice(i, 1)
            changeDirection()
            score++
            scoreDisplay.textContent = 'Score: ' + score
            
            if (blocks.length === 0) {
                showGameOver('You Win! 🎉')
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[0] <= 0 || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter)
    ) {
        changeDirection()
    }

    if (
        (ballCurrentPosition[0] > currentPosition[0] && 
         ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && 
         ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection()
    }
    
    if (ballCurrentPosition[1] <= 0) {
        showGameOver('Game Over! 😢')
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

function showGameOver(text) {
    message.style.display = 'block'
    message.innerHTML = text + '<br>Refresh to play again'
}