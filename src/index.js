var topInt;
var leftInt;
var rightInt;
var botInt;
var intTime = 10;
var difficulty;
var started = 0;
var startFromTop = true;
const ball = document.getElementById("ball");
const rod2 = document.getElementById("rod2");
const rod1 = document.getElementById("rod1");
const rod = document.querySelectorAll(".rod");
var rod1Score = 0;
var rod2Score = 0;

document.addEventListener("keydown", keyHandler);

function loadGame() {
  setBallPosition();
  makeRodsCenter();
  intitializeScores();
}

loadGame();

function keyHandler(e) {
  if (e.key === "d" || e.key === "ArrowRight") {
    //get the position of the rod2 and move it
    // console.log("d");
    for (let eachRod of rod) {
      const rodPosition = eachRod.getBoundingClientRect();
      rodPosition.x += 10;
      if (rodPosition.x >= window.innerWidth - eachRod.offsetWidth) {
        return;
      }
      eachRod.style.left = rodPosition.x + "px";
    }
  }
  if (e.key === "a" || e.key === "ArrowLeft") {
    //get the position of the rod2 and move it
    // console.log("a");
    for (let eachRod of rod) {
      const rodPosition = eachRod.getBoundingClientRect();
      rodPosition.x -= 10;
      if (rodPosition.x <= 0) {
        return;
      }
      eachRod.style.left = rodPosition.x + "px";
    }
  }
  if (e.key === "Enter" || e.key === " ") {
    if (started === 0) {
      startGame("first");
      started = 2;
      return;
    }
    if (started === 1 && startFromTop) {
      startGame("top");
      started = 2; //this is to avoid the confusion that what if someone presses the enter or space during the game
      return;
    }
    if (started === 1 && !startFromTop) {
      startGame("bottom");
      started = 2; //this is to avoid the confusion that what if someone presses the enter or space during the game
      return;
    }
  }
}

function startGame(startFrom) {
  startBall(startFrom);
  difficulty = setInterval(() => {
    intTime--;
    console.log("More Difficult");
    if (intTime <= 6) {
      clearInterval(difficulty);
    }
  }, 30000); //for every 30 seconds, make it more difficult
}

function startBall(startFrom) {
  intTime = 10;
  let randomNum = Math.floor(Math.random() * 10);
  if (startFrom === "first") {
    if (randomNum <= 5) {
      topInt = setInterval(moveTop, intTime);
      let randomNumSides = Math.floor(Math.random() * 10);
      if (randomNumSides <= 5) {
        leftInt = setInterval(() => {
          moveLeft(startFrom);
        }, 10);
      } else {
        rightInt = setInterval(() => {
          moveRight(startFrom);
        }, 10);
      }
    } else {
      botInt = setInterval(moveBot, intTime);
      let randomNumSides = Math.floor(Math.random() * 10);
      if (randomNumSides <= 5) {
        leftInt = setInterval(() => {
          moveLeft(startFrom);
        }, 10);
      } else {
        rightInt = setInterval(() => {
          moveRight(startFrom);
        }, 10);
      }
    }
  } else if (startFrom === "top") {
    botInt = setInterval(moveBot, intTime);
    let randomNumSides = Math.floor(Math.random() * 10);
    if (randomNumSides <= 5) {
      leftInt = setInterval(() => {
        moveLeft(startFrom);
      }, 10);
    } else {
      rightInt = setInterval(() => {
        moveRight(startFrom);
      }, 10);
    }
  } else if (startFrom === "bottom") {
    topInt = setInterval(moveTop, intTime);
    let randomNumSides = Math.floor(Math.random() * 10);
    if (randomNumSides <= 5) {
      leftInt = setInterval(() => {
        moveLeft(startFrom);
      }, 10);
    } else {
      rightInt = setInterval(() => {
        moveRight(startFrom);
      }, 10);
    }
  }
}

function moveTop() {
  const position = ball.getBoundingClientRect();
  position.y -= 2;
  ball.style.top = position.y + "px";
  hitRod1();
  hitTopScreen();
  return;
}

function moveBot() {
  const position = ball.getBoundingClientRect();
  position.y += 2;
  ball.style.top = position.y + "px";
  hitRod2();
  hitBotScreen();
  return;
}

function moveRight(startFrom) {
  const position = ball.getBoundingClientRect();
  let shift = Math.random() + 1;
  if (startFrom === "first") {
    position.x += shift;
  } else {
    position.x += 2;
  }
  ball.style.left = position.x + "px";
  hitRightScreen();
  return;
}

function moveLeft(startFrom) {
  const position = ball.getBoundingClientRect();
  let shift = Math.random() + 1;
  if (startFrom === "first") {
    position.x -= shift;
  } else {
    position.x -= 2;
  }
  ball.style.left = position.x + "px";
  hitLeftScreen();
  return;
}

function hitBotScreen() {
  if (ball.offsetTop > window.innerHeight) {
    //it means it hit the bot screen so stop moving down and start moving up
    let startFrom = "bottom";
    gameOver(startFrom);
    return;
    // topInt=setInterval(moveTop,10);
  }
}

function hitRightScreen() {
  if (ball.offsetLeft >= window.innerWidth - ball.offsetWidth) {
    //it means it hit the right screen so stop moving right and start moving left
    clearInterval(rightInt);
    leftInt = setInterval(moveLeft, intTime);
  }
}

function hitTopScreen() {
  if (ball.offsetTop < -30) {
    //it means the ball hit the top, so stop moving top and start moving bottom
    let startFrom = "top";
    gameOver(startFrom);
    return;
    // botInt=setInterval(moveBot,10);
  }
}

function hitLeftScreen() {
  if (ball.offsetLeft <= 0) {
    //it means the ball hit the left screen, so stop moving left and start moving right
    clearInterval(leftInt);
    rightInt = setInterval(moveRight, intTime);
  }
}

function hitRod2() {
  //get the ball position first and if it's in the limits
  //then it is said to be hit the rod
  const ballPosition = ball.getBoundingClientRect();
  const rod2Position = rod2.getBoundingClientRect();
  if (ballPosition.y >= rod2Position.y - ball.offsetHeight) {
    if (
      ballPosition.x >= rod2Position.x - 15 &&
      ballPosition.x < rod2Position.x + rod2.offsetWidth - 30
    ) {
      updateScore("rod2");
      clearInterval(botInt);
      topInt = setInterval(moveTop, intTime);
    }
  }
}

function hitRod1() {
  //get the ball position first and if it's in the limits
  //then it is said to be hit the rod
  const ballPosition = ball.getBoundingClientRect();
  const rod1Position = rod1.getBoundingClientRect();
  if (ballPosition.y <= rod1.offsetHeight) {
    if (
      ballPosition.x >= rod1Position.x - 15 &&
      ballPosition.x < rod1Position.x + rod2.offsetWidth - 30
    ) {
      updateScore("rod1");
      clearInterval(topInt);
      botInt = setInterval(moveBot, intTime);
    }
  }
}

function gameOver(startFrom) {
  //fisrt display gameover
  window.alert("Game is Over");
  clearInterval(topInt);
  clearInterval(botInt);
  clearInterval(leftInt);
  clearInterval(rightInt);
  clearInterval(difficulty);
  displayScoresOnAlert();
  started = 1;
  makeRodsCenter();
  setBallPosition(startFrom);
  intitializeScores();
  return;
}

function intitializeScores() {
  rod1Score = 0;
  rod2Score = 0;
  showScore();
}

function showScore() {
  let score1 = document.getElementById("rod1-score");
  let score2 = document.getElementById("rod2-score");
  score1.innerHTML = rod1Score;
  score2.innerHTML = rod2Score;
}

function updateScore(rod) {
  if (rod === "rod1") {
    rod1Score++;
    updateMaxScore();
    showScore();
    return;
  } else {
    rod2Score++;
    updateMaxScore();
    showScore();
    return;
  }
}

function updateMaxScore() {
  let maxScore1 = localStorage.getItem("maxScore1");
  let maxScore2 = localStorage.getItem("maxScore2");
 
  if (rod1Score > Number(maxScore1)) {
    localStorage.setItem("maxScore1", `${rod1Score}`);
  }
  if (rod2Score > Number(maxScore2)) {
    localStorage.setItem("maxScore2", `${rod2Score}`);
  }
}

function displayScoresOnAlert() {
  let maxScore1 =localStorage.getItem("maxScore1"); 
  let maxScore2 =localStorage.getItem("maxScore2");
  if(maxScore1==null){
    maxScore1=0;
  }
  if(maxScore2==null){
    maxScore2=0;
  }
  let message = `
    Rod1 Score=${rod1Score.toString()}, Max Score=${maxScore1}  
    Rod2 Score=${rod2Score.toString()}, Max Score=${maxScore2}
    `;
  window.alert(message);
}

function setBallPosition(startFrom) {
  if (!started) {
    ball.style.top = window.innerHeight / 2 + ball.offsetHeight / 2 + "px";
    ball.style.left = window.innerWidth / 2 - ball.offsetWidth / 2 + "px";
    return;
  }
  if (startFrom === "top") {
    ball.style.top = rod1.offsetHeight + "px";
    ball.style.left =
      rod1.offsetLeft + rod1.offsetWidth / 2 - ball.offsetWidth / 2 + "px";
  } else if (startFrom === "bottom") {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ball.style.left =
      rod2.offsetLeft + rod2.offsetWidth / 2 - ball.offsetWidth / 2 + "px";
    startFromTop = false;
  }
}

function makeRodsCenter() {
  for (let eachRod of rod) {
    eachRod.style.left = window.innerWidth / 2 - eachRod.offsetWidth / 2 + "px";
  }
  return;
}
