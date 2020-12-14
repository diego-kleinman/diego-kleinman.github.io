let ctx;

window.onload = () => {
    canvas = document.getElementById('gameContainer')
    if (canvas.getContext) {
        alert("Left player (player1) plays with up an down arrows \n Right player (player2) plays with W and S")
        ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth * 0.6
        canvas.height = window.innerHeight * 0.6
        canvasObj["width"] = canvas.getAttribute("width")
        canvasObj["height"] = canvas.getAttribute("height")

        player1 = {
            "x": players["separationFromCorners"],
            "y": (canvasObj["height"] / 2) - players["height"] / 2,
        }
        player2 = {
            "x": canvasObj["width"] - players["width"] - players["separationFromCorners"],
            "y": (canvasObj["height"] / 2) - players["height"] / 2,
        }
        settings = {
            "playVelocity": 3,
            "playersVelocity": canvasObj["height"]/100,
            "pointsToWin": 5,
            "firstTouch": true,
            "maxBottom": canvasObj["height"] - players["height"],
            "leftLimit": player1["x"] + players["width"] + ball["vx"] + ball["radius"],
            "rightLimit": canvasObj["width"] - (canvasObj["width"] - player2["x"] + 2),
            "bottomLimit": canvasObj["height"],
            "topLimit": 0,
            "velocityFactor": (canvasObj["width"] / 2 - 2 * ball["radius"] - (canvasObj["width"] - player2["x"] + 2)) * 0.5
        }
        score = {
            "player1": 0,
            "player2": 0,
        }
        initialize(ctx)
        play(ctx)
    }
    else {
        alert("Sorry, due to your browser being not compatible you won't be able to play")
    }

    // @media screen and (max-width: 450px) {
    // @media screen and (min-width: 451px) {
    // @media screen and (min-width: 1200px) {

}

let canvas = document.getElementById("gameContainer")

let canvasObj = {
    "width": canvas.getAttribute("width"),
    "height": canvas.getAttribute("height"),
}

//-----------------------------------------------------------------------GAME VALUES-------------------------------------------------------------------------------------

//Object to control keys pressed
let keys = {
    "ArrowUp": false,
    "ArrowDown": false,
    "w": false,
    "s": false
}

let ball = {
    "x": null,
    "y": null,
    "radius": 4,
    "vx": 5,
    "vy": -3,
}

//Common attributes among players
let players = {
    "width": 10,
    "height": 60,
    "separationFromCorners": 10,
}

//Left player
let player1 = {
    "x": players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
}

//Right player
let player2 = {
    "x": canvasObj["width"] - players["width"] - players["separationFromCorners"],
    "y": (canvasObj["height"] / 2) - players["height"] / 2,
}

//Settings for the game
let settings = {
    "playVelocity": 3,
    "playersVelocity": 4,
    "pointsToWin": 5,
    "firstTouch": true,
    "maxBottom": canvasObj["height"] - players["height"] - 5,
    "leftLimit": player1["x"] + players["width"] + ball["vx"] + ball["radius"],
    "rightLimit": canvasObj["width"] - (canvasObj["width"] - player2["x"] + 2),
    "bottomLimit": canvasObj["height"],
    "topLimit": 0,
    "velocityFactor": (canvasObj["width"] / 2 - 2 * ball["radius"] - (canvasObj["width"] - player2["x"] + 2)) * 0.5
}

let score = {
    "player1": 0,
    "player2": 0,
}

//-----------------------------------------------------------------------AUXILIARY FUNCTIONS------------------------------------------------------------------------------------
const clearPlayer = (ctx, player) => {
    ctx.clearRect(player["x"], player["y"] - 1, players["width"], players["height"] + 2)
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
    randomizeBall()
    drawBall(ctx)
    settings["firstTouch"] = true
}

//Randomize the ball angle and "y" position, it´s used to throw the ball after each point
const randomizeBall = () => {
    ball["x"] = canvasObj["width"] / 2
    ball["y"] = Math.random() * (canvasObj["height"] * 0.6 - canvasObj["height"] * 0.4) + canvasObj["height"] * 0.4;
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

const movePlayer = (ctx, player, velocity) => {
    clearPlayer(ctx, player)
    player["y"] = player["y"] + velocity
    drawPlayer(ctx, player)
}

const movePlayers = (ctx) => {
    if (player1["y"] <= settings["maxBottom"]) {
        if (keys["ArrowDown"]) {
            movePlayer(ctx, player1, settings["playersVelocity"])
        }
    }
    if (player1["y"] >= 0) {
        if (keys["ArrowUp"]) {
            movePlayer(ctx, player1, -settings["playersVelocity"])
        }
    }
    if (player2["y"] <= settings["maxBottom"]) {
        if (keys["s"]) {
            movePlayer(ctx, player2, settings["playersVelocity"])
        }
    }
    if (player2["y"] >= 0) {
        if (keys["w"]) {
            movePlayer(ctx, player2, -settings["playersVelocity"])
        }
    }
}

const resetScores = () => {
    score["player1"] = 0
    score["player2"] = 0
}

const actualizeScore = (player) => {
    score[player]++
    document.getElementById("score").innerHTML = score["player1"] + " / " + score["player2"]
}


//-----------------------------------------------------------------------CONTROLLING GAME STATE------------------------------------------------------------------------------
// This functions are in charge of controlling if the ball is hitting the top or bottom wall, hitting a player, or scoring a goal
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
//
const play = (ctx) => {
    setInterval(() => {
        //Neither player 1 nor player 2 has win
        if (score["player1"] < settings["pointsToWin"] && score["player2"] < settings["pointsToWin"]) {

            //Ball limits
            let ballRightLimit = ball["x"] + 2 * ball["radius"] + 2
            let ballLeftLimit = ball["x"] - 2
            let ballTopLimit = ball["y"] - 2
            let ballBottomLimit = ball["y"] + 2 * ball["radius"] + 2

            //If the ball hits top or bottom ball vertical velocity is inverted
            if (bottomHitting(ballBottomLimit)) {
                ball["vy"] = -ball["vy"]
            }
            if (topHitting(ballTopLimit)) {
                ball["vy"] = -ball["vy"]
            }

            //If the ball is going right
            if (ball["vx"] > 0) {
                //And player2 hits it
                if (player2Hitting(ballRightLimit)) {
                    //If it´s the first touch, ball horizontal velocity is inverted and doubled after that touch
                    if (settings["firstTouch"]) {
                        ball["vx"] = -2 * ball["vx"]
                        settings["firstTouch"] = false
                    }
                    //If it's not the first touch, ball horizontal velocity is just inverted
                    else {
                        ball["vx"] = -ball["vx"]
                    }
                }
                //If player2 isn't hitting the ball, the ball continues moving till goal
                else {
                    moveBall(ctx)
                    if (rightGoal()) {
                        //IT WAS PLAYER1 GOAL, SET SCOREBOARD AND THROW ANOTHER BALL
                        actualizeScore("player1")
                        initialize(ctx)
                    }
                }
            }

            //Same logic as before but ball going left, so logic is mirrored
            if (ball["vx"] < 0) {
                if (player1Hitting(ballLeftLimit)) {
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
                        actualizeScore("player2")
                        initialize(ctx)
                    }
                }
            }
            movePlayers(ctx)
        }
        //If one of the players reached the score to win, display who won
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