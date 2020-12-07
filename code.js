let ctx;
window.onload = () => {
    let canvas = document.getElementById('gameContainer')
    // alert(window.innerWidth)
    // alert(window.innerHeight)
    if (canvas.getContext) {
        ctx = canvas.getContext('2d')
        initialize(ctx)
        play(ctx)
    }
    else {
        alert("Sorry, due to your browser being not compatible you won't be able to play")
    }
}
//-----------------------------------------------------------------------GAME OBJECT VALUES-------------------------------------------------------------------------------

let canvas = document.getElementById("gameContainer")

let keys = {
    "ArrowUp": false,
    "ArrowDown": false,
    "w": false,
    "s": false
}

let canvasObj = {
    "width": canvas.getAttribute("width"),
    "height": canvas.getAttribute("height"),
}

let ball = {
    "x": 500,
    "y": 250,
    "radius": 4,
    "vx": 5,
    "vy": -3,
}

let playVelocity = 5
let playersVelocity = 5
let pointsToWin = 5
let topLimit = 2 * ball["radius"]
let bottomLimit = canvasObj["height"] - 3*ball["radius"]

let players = {
    "width": 10,
    "height": 60,
    "separationFromCorners": 10
}

let player1 = {
    "x": players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
    "width": players["width"],
    "height": players["height"]
}

let player2 = {
    "x": canvasObj["width"] - players["width"] - players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
    "width": players["width"],
    "height": players["height"]
}

let score = {
    "player1": 0,
    "player2": 0,
}

let firstTouch = {
    "first": true
}

let rightLimit = canvasObj["width"] - (canvasObj["width"] - player2["x"]) + ball["radius"]
let leftLimit = player1["x"] + player1["width"] - ball["radius"]

//-----------------------------------------------------------------------INITIALIZING ROUND------------------------------------------------------------------------------------
const initialize = (ctx) => {
    draw(ctx, player1["x"], player1["y"], player1["width"], player1["height"])
    draw(ctx, player2["x"], player2["y"], player2["width"], player2["height"])
    ctx.clearRect(ball["x"] - ball["radius"] - 1, ball["y"] - ball["radius"] - 1, ball["radius"] * 2 + 2, ball["radius"] * 2 + 2)
    ball["x"] = canvasObj["width"]/2
    ball["y"] = Math.random() * (canvasObj["height"]*0.8 - canvasObj["height"]*0.2) + canvasObj["height"]*0.2;
    ball["vy"] = (Math.random() * 2 * (playVelocity)) - playVelocity
    aux = Math.random()
    if (aux > 0.5) {
        ball["vx"] = playVelocity
    }
    else {
        ball["vx"] = -playVelocity
    }
    ctx.beginPath();
    ctx.arc(ball["x"], ball["y"], ball["radius"], 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill()
    firstTouch["first"] = true
}

//-----------------------------------------------------------------------CONTROLLING GAME STATE------------------------------------------------------------------------------

const draw = (ctx, x, y, wid, len) => {
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(x, y, wid, len)
}

const moveBall = (ctx) => {
    ctx.clearRect(ball["x"] - ball["radius"] - 1, ball["y"] - ball["radius"] - 1, ball["radius"] * 2 + 2, ball["radius"] * 2 + 2)
    let newX = ball["x"] + ball["vx"]
    let newY = ball["y"] + ball["vy"]
    ball["x"] = newX
    ball["y"] = newY
    ctx.beginPath();
    ctx.arc(ball["x"], ball["y"], ball["radius"], 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill()
}

const clearPlayer = (ctx, player) => {
    ctx.clearRect(player["x"], player["y"], player["width"], player["height"])
}

const movePlayers = (ctx) => {
    
    if (player1["y"] <= canvasObj["height"] - player2["height"] - 5) {
        if (keys["ArrowDown"]) {
            let newY = player1["y"] + playersVelocity
            clearPlayer(ctx, player1)
            player1["y"] = newY
            draw(ctx, player1["x"], player1["y"], player1["width"], player1["height"])
        }
    }
    if (player1["y"] >= 0) {
        if (keys["ArrowUp"]) {
            let newY2 = player1["y"] - playersVelocity
            clearPlayer(ctx, player1)
            player1["y"] = newY2
            draw(ctx, player1["x"], player1["y"], player1["width"], player1["height"])
        }
    }
    if (player2["y"] <= canvasObj["height"] - player2["height"] - 5) {
        if (keys["s"]) {
            let newY3 = player2["y"] + playersVelocity
            clearPlayer(ctx, player2)
            player2["y"] = newY3
            draw(ctx, player2["x"], player2["y"], player2["width"], player2["height"])
        }
    }
    if (player2["y"] >= 0) {
        if (keys["w"]) {
            let newY4 = player2["y"] - playersVelocity
            clearPlayer(ctx, player2)
            player2["y"] = newY4
            draw(ctx, player2["x"], player2["y"], player2["width"], player2["height"])
        }
    }
}

const topHitting = (limit) => {
    return (limit <= topLimit)
}

const bottomHitting = (limit) => {
    return (limit >= bottomLimit)
}

const player1Hitting = (limit) => {
    return (ball["y"] + ball["radius"] >= (player1["y"]) && ball["y"] <= (player1["y"] + player1["height"]) && (limit <= leftLimit))
}

const player2Hitting = (limit) => {
    return (ball["y"] + ball["radius"] >= (player2["y"]) && ball["y"] <= (player2["y"] + player2["height"]) && (limit >= rightLimit))
}

const rightGoal = () => {
    return (ball["x"]) > canvasObj["width"] - players["separationFromCorners"]
}

const leftGoal = () => {
    return (ball["x"]) < players["separationFromCorners"]
}

const resetScores = () => {
    score["player1"] = 0
    score["player2"] = 0
}

const actualizeScore = (ctx,player) => {
    score[player]++
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
    initialize(ctx)
}

//-----------------------------------------------------------------------EXECUTES IN 60FPS-------------------------------------------------------------------------------
const play = (ctx) => {
    setInterval(() => {
        if (score["player1"] < pointsToWin && score["player2"] < pointsToWin) {
            let ballRightLimit = ball["x"] + 2 * ball["radius"] + ball["vx"]
            let ballLeftLimit = ball["x"] - 2 * ball["radius"] + ball["vx"]
            let ballTopLimit = ball["y"]
            let ballBottomLimit = ball["y"]

            if (bottomHitting(ballBottomLimit)) {
                ball["vy"] = -ball["vy"]
            }
            if (topHitting(ballTopLimit)) {
                ball["vy"] = -ball["vy"]
            }

            if (ball["vx"] > 0) {
                if (player2Hitting(ballRightLimit)) {
                    if (firstTouch["first"]) {
                        ball["vx"] = -2 * ball["vx"]
                        firstTouch["first"] = false
                    }
                    else {
                        ball["vx"] = -ball["vx"]
                    }
                }
                else {
                    moveBall(ctx)
                    if (rightGoal()) {
                        //IT WAS PLAYER1 GOAL, SET SCOREBOARD AND THROW ANOTHER BALL
                        actualizeScore(ctx,"player1")
                    }
                }
            }
            if (ball["vx"] < 0) {
                if (player1Hitting(ballLeftLimit)) {
                    if (firstTouch["first"]) {
                        ball["vx"] = -2 * ball["vx"]
                        firstTouch["first"] = false
                    }
                    else {
                        ball["vx"] = -ball["vx"]
                    }
                }
                else {
                    moveBall(ctx)
                    if (leftGoal()) {
                        //IT WAS PLAYER2 GOAL, SET SCOREBOARD AND THROW ANOTHER BALL
                        actualizeScore(ctx,"player2")
                    }
                }
            }
            movePlayers(ctx)
        }
        else {
            if (score["player1"] == pointsToWin) {
                document.getElementById("score").innerHTML = "Player 1 won"
            }
            else {
                document.getElementById("score").innerHTML = "Player 2 won"
            }
            clearInterval()
        }
    }, 16.67);
}
//-----------------------------------------------------------------------CONTROL INPUT STATE----------------------------------------------------------------------------------
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    switch (keyName) {
        case 'ArrowDown':
            keys["ArrowDown"] = true
            break
        case 'ArrowUp':
            keys["ArrowUp"] = true
            break
        case 'w':
            keys["w"] = true
            break
        case 's':
            keys["s"] = true
            break
        default:
            break;
    }
})

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    switch (keyName) {
        case 'ArrowDown':
            keys["ArrowDown"] = false
            break
        case 'ArrowUp':
            keys["ArrowUp"] = false
            break
        case 'w':
            keys["w"] = false
            break
        case 's':
            keys["s"] = false
            break
        default:
            break;
    }
})

document.getElementById("restartButton").addEventListener('click', () => {
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("slow").addEventListener('click', () => {
    playVelocity = 2
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("medium").addEventListener('click', () => {
    playVelocity = 5
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("fast").addEventListener('click', () => {
    playVelocity = 7
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("insane").addEventListener('click', () => {
    playVelocity = 10
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})