let ctx;
window.onload = () => {
    canvas = document.getElementById('gameContainer')
    if (canvas.getContext) {
        ctx = canvas.getContext('2d')
        initialize(ctx)
        play(ctx)
    }
    else {
        alert("Sorry, due to your browser being not compatible you won't be able to play")
    }
}
//-----------------------------------------------------------------------GAME VALUES-------------------------------------------------------------------------------------

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
    "x": null,
    "y": null,
    "radius": 4,
    "vx": 5,
    "vy": -3,
}

let players = {
    "width": 10,
    "height": 60,
    "separationFromCorners": 10,
}

let player1 = {
    "x": players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
}

let player2 = {
    "x": canvasObj["width"] - players["width"] - players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
}

let settings = {
    "playVelocity": 3,
    "playersVelocity": 5,
    "pointsToWin": 5,
    "firstTouch": true,
    "maxBottom": canvasObj["height"] - players["height"] - 5,
    "leftLimit": player1["x"] + players["width"] + ball["vx"] + ball["radius"],
    "rightLimit": canvasObj["width"] - (canvasObj["width"] - player2["x"] + 2),
    "bottomLimit": canvasObj["height"],
    "topLimit": 0,
    "velocityFactor": canvasObj["width"] / 2 - 2 * ball["radius"] - (canvasObj["width"] - player2["x"] + 2)
}

let score = {
    "player1": 0,
    "player2": 0,
}

//-----------------------------------------------------------------------AUXILIARY FUNCTIONS------------------------------------------------------------------------------------
const clearPlayer = (ctx, player) => {
    ctx.clearRect(player["x"], player["y"], players["width"], players["height"])
}

const clearBall = (ctx) => {
    ctx.clearRect(ball["x"] - ball["radius"] - 1, ball["y"] - ball["radius"] - 1, ball["radius"] * 2 + 2, ball["radius"] * 2 + 2)
}

const drawPlayer = (ctx, player) => {
    draw(ctx, player["x"], player["y"], players["width"], players["height"])
}

const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(ball["x"], ball["y"], ball["radius"], 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill()
}

const draw = (ctx, x, y, wid, len) => {
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(x, y, wid, len)
}

const initialize = (ctx) => {
    drawPlayer(ctx, player1)
    drawPlayer(ctx, player2)
    throwBall(ctx)
}

const restart = (ctx) => {
    clearPlayer(ctx, player1)
    clearPlayer(ctx, player2)
    player1["y"] = (canvasObj["height"] / 2) - players["height"] / 2
    player2["y"] = (canvasObj["height"] / 2) - players["height"] / 2
    initialize(ctx)
}

const throwBall = (ctx) => {
    clearBall(ctx)
    randomizeBall(ctx)
    drawBall(ctx)
    settings["firstTouch"] = true
}

const randomizeBall = (ctx) => {
    ball["x"] = canvasObj["width"] / 2
    ball["y"] = Math.random() * (canvasObj["height"] * 0.7 - canvasObj["height"] * 0.3) + canvasObj["height"] * 0.3;
    ball["vy"] = (Math.random() * 2 * (settings["playVelocity"])) - settings["playVelocity"]
    aux = Math.random()
    if (aux > 0.5) {
        ball["vx"] = settings["playVelocity"]
    }
    else {
        ball["vx"] = -settings["playVelocity"]
    }
}

const moveBall = (ctx) => {
    clearBall(ctx)
    ball["x"] = ball["x"] + ball["vx"]
    ball["y"] = ball["y"] + ball["vy"]
    drawBall(ctx)
}

const movePlayer = (ctx,player,velocity) => {
    clearPlayer(ctx, player)
    player["y"] = player["y"] + velocity
    drawPlayer(ctx,player)
}

const movePlayers = (ctx) => {
    if (player1["y"] <= settings["maxBottom"]) {
        if (keys["ArrowDown"]) {
            movePlayer(ctx,player1,settings["playersVelocity"])
        }
    }
    if (player1["y"] >= 0) {
        if (keys["ArrowUp"]) {
            movePlayer(ctx,player1,-settings["playersVelocity"])
        }
    }
    if (player2["y"] <= settings["maxBottom"]) {
        if (keys["s"]) {
            movePlayer(ctx,player2,settings["playersVelocity"])
        }
    }
    if (player2["y"] >= 0) {
        if (keys["w"]) {
            movePlayer(ctx,player2,-settings["playersVelocity"])
        }
    }
}

const resetScores = () => {
    score["player1"] = 0
    score["player2"] = 0
}

const actualizeScore = (ctx, player) => {
    score[player]++
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
}


//-----------------------------------------------------------------------CONTROLLING GAME STATE------------------------------------------------------------------------------

const topHitting = (limit) => {
    return (limit <= settings["topLimit"])
}

const bottomHitting = (limit) => {
    return (limit >= settings["bottomLimit"])
}

const player1Hitting = (limit) => {
    return (ball["y"] + ball["radius"] >= (player1["y"]) && ball["y"] <= (player1["y"] + players["height"]) && (limit <= settings["leftLimit"]))
}

const player2Hitting = (limit) => {
    return (ball["y"] + ball["radius"] >= (player2["y"]) && ball["y"] <= (player2["y"] + players["height"]) && (limit >= settings["rightLimit"]))
}

const rightGoal = () => {
    return (ball["x"]) > canvasObj["width"] - players["separationFromCorners"]
}

const leftGoal = () => {
    return (ball["x"]) < players["separationFromCorners"]
}
//-----------------------------------------------------------------------EXECUTES IN 60FPS-------------------------------------------------------------------------------
const play = (ctx) => {
    setInterval(() => {
        if (score["player1"] < settings["pointsToWin"] && score["player2"] < settings["pointsToWin"]) {
            let ballRightLimit = ball["x"] + 2 * ball["radius"] + 2
            let ballLeftLimit = ball["x"] - 2
            let ballTopLimit = ball["y"] - 2
            let ballBottomLimit = ball["y"] + 2 * ball["radius"] + 2

            if (bottomHitting(ballBottomLimit)) {
                ball["vy"] = -ball["vy"]
            }
            if (topHitting(ballTopLimit)) {
                ball["vy"] = -ball["vy"]
            }

            if (ball["vx"] > 0) {
                if (player2Hitting(ballRightLimit)) {
                    //alert("hit")
                    if (settings["firstTouch"]) {
                        ball["vx"] = -2 * ball["vx"]
                        settings["firstTouch"] = false
                    }
                    else {
                        ball["vx"] = -ball["vx"]
                    }
                }
                else {
                    moveBall(ctx)
                    if (rightGoal()) {
                        //IT WAS PLAYER1 GOAL, SET SCOREBOARD AND THROW ANOTHER BALL
                        actualizeScore(ctx, "player1")
                        initialize(ctx)
                    }
                }
            }
            if (ball["vx"] < 0) {
                if (player1Hitting(ballLeftLimit)) {
                    //alert("hit")
                    if (settings["firstTouch"]) {
                        ball["vx"] = -2 * ball["vx"]
                        settings["firstTouch"] = false
                    }
                    else {
                        ball["vx"] = -ball["vx"]
                    }
                }
                else {
                    moveBall(ctx)
                    if (leftGoal()) {
                        //IT WAS PLAYER2 GOAL, SET SCOREBOARD AND THROW ANOTHER BALL
                        actualizeScore(ctx, "player2")
                        initialize(ctx)
                    }
                }
            }
            movePlayers(ctx)
        }
        else {
            if (score["player1"] == settings["pointsToWin"]) {
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
    restart(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("slow").addEventListener('click', () => {
    settings["playVelocity"] = settings["velocityFactor"] * 0.01
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("medium").addEventListener('click', () => {
    settings["playVelocity"] = settings["velocityFactor"] * 0.02
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("fast").addEventListener('click', () => {
    settings["playVelocity"] = settings["velocityFactor"] * 0.025
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})

document.getElementById("insane").addEventListener('click', () => {
    settings["playVelocity"] = settings["velocityFactor"] * 0.04
    initialize(ctx)
    resetScores()
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
})