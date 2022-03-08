// Game Constants and Variable
let inputDir = {x: 0, y: 0};
const foodsound = new Audio('resources/music/food.mp3');
const gameOverSound = new Audio('resources/music/gameover.mp3');
const moveSound = new Audio('resources/music/move.mp3');
const musicSound = new Audio('resources/music/music.mp3');
const maxNumberOfRows = 24;
const maxNumberOfColumns = 24;
let a = 2;
let b = 22;
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}  // first value inclusive and second value exclusive
];
let food = {x: 6, y: 7};
let tempFood = {x: 6, y: 7};
musicSound.loop = true;

// Game Funstions
function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed)
    {
        return;
    }
    lastPaintTime = ctime;
    // console.log(tempFood.x,">>tempfood>>", tempFood.y);
    // console.log(food.x,">>food>>", food.y);
    // console.log(ctime);

    gameEngine();
}

// Check for food position so that it is not on snake's body
function isFoodPositionValid(tFood,snake)
{
    snake.forEach((e) => {
        if(e.x == tFood.x && e.y == tFood.y)
        return false;
    })
    return true;
}

// Check for Snake collision
function isCollide(snake){
    // If snake bump into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If snake bump into wall
    if(snake[0].x >= maxNumberOfColumns || snake[0].x <=0 || snake[0].y >= maxNumberOfRows || snake[0].y <= 0){
        return true;
    }
    return false;
}

function gameEngine(){
    // Part 1: Upfating the snake array
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game Over. Press any key to play again");
        snakeArr = [
            {x: 13, y: 15}
        ];
        musicSound.play();
        score = 0;
    }

    // If snake eaten the food, increament the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodsound.play();
        score += 1; // Score increament

        // Highscore logic
        if(score > hiscoreVal){
            hiscoreVal = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreVal));
            highscoreBox.innerHTML = "HighScore: " + hiscoreVal;
        }

        // Displaying score
        scoreBox.innerText = "Score: " + score;

        // increasing snake's leength, adding element at the beginning with unshift property
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});

        // Updating food
        tempFood = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())};
        while(!(isFoodPositionValid(tempFood,snakeArr)))
            tempFood = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())};
        
        food = tempFood;
    }

    // Moving the snake

    // Moving snake's body
    for (let i = snakeArr.length-2; i >=0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};   // Using spread operator to create new object
    }

    // Moving snake's head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    

    // Part 2: Display the snake and food

    // Display the snake

    board.innerHTML = "";
    snakeArr.forEach((e,index)=>{   // e is for elements in snake array and index is index of that element
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        
        if(index === 0){
            if(inputDir.x == 0 &&  inputDir.y == -1){
                snakeElement.classList.add('head','up');
            }
            else if(inputDir.x == 0 &&  inputDir.y == 1){
                snakeElement.classList.add('head','down');
            }
            else if(inputDir.x == -1 &&  inputDir.y == 0){
                snakeElement.classList.add('head','left');
            }
            else{
                snakeElement.classList.add('head','right');
            }
        }

        else{
            snakeElement.classList.add('snake');  // Adding div to the classList so that div has the property of the class
        }


        board.appendChild(snakeElement);  // Displaying snake on board
    })



    // Display the food
        foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        board.appendChild(foodElement);
}





// Main logic starts here (button logic)

// HighScore updation to localstorage
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){   // If highscore not present in localstorage
    hiscoreVal = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreVal));
}
else{   // If not present put the value from localstorage
    hiscoreVal = JSON.parse(hiscore);
    highscoreBox.innerHTML = "HighScore: " + hiscore;
}

// Taking Arrow inputs and starting game
window.requestAnimationFrame(main);

window.addEventListener('keydown', e =>{
    inputDir = {x:0, y:0} //Starts the game
    musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            // console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            // console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            // console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            // console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    
        default:
            break;
    }
});