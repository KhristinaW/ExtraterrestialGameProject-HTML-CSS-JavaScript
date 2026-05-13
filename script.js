// STEP 1 - Store all our images in one array of objects
//          Each object has a "name" and a "file" property
// -----------------------------------------------------------
const gameImages = [
    { name: "ship",    file: " ship.png"   },
    { name: "earth",   file: " Earth.webp"    },
    { name: "neptune", file: " neptune.png"   },
    { name: "mars",    file: " Mars.webp"     },
    { name: "sun",     file: " Sun.webp"      },
    { name: "jupiter", file: " jupiter.webp"  },
    { name: "moon",    file: " moon.webp"     },
    { name: "uranus",  file: " uranus.png"    },
    { name: "venus",   file: " venus.png"     },
    { name: "mercury", file: " mercury.png"   },
];

// This helper function loops through the array above
// and returns the filename for a given image name
function getImageFile(imageName) {
    for (let i = 0; i < gameImages.length; i++) {
        if (gameImages[i].name === imageName) {
            return gameImages[i].file;   // found it! return the filename
        }
    }
    return "";  // if nothing found, return empty string
}


// STEP 2 - Store every planet in an array of objects
//          Each object tells us: which row, which col, and
//          the planet name (used for the penalty message)
const planets = [
    { row: 0, col: 2, name: "Neptune" },
    { row: 1, col: 5, name: "Mars"    },
    { row: 3, col: 4, name: "Jupiter" },
    { row: 4, col: 0, name: "Moon"    },
    { row: 5, col: 1, name: "Uranus"  },
    { row: 5, col: 5, name: "Venus"   },
    { row: 6, col: 2, name: "Mercury" },
];


// STEP 3 - Store the corner cells in an array of objects
//          Each corner changes the ship's direction
const corners = [
    { cssClass: "top-left-corner",  newDirection: "down"  },
    { cssClass: "top-right-corner", newDirection: "left"  },
    { cssClass: "left-corner",      newDirection: "right" },
    { cssClass: "right-corner",     newDirection: "up"    },
];


// STEP 4 - Build the game board HTML using our image array

// Grab the game-board div from the HTML page
const gameBoard = document.getElementById("game-board");

// Build the table and drop it into the game-board div
// We use getImageFile() so all images come from our array above
gameBoard.innerHTML = `
<table>
    <tr id="row-1">
        <td id="start-cell"><img src="${getImageFile("earth")}" alt="Earth">Start</td>
        <td class="top-left-corner"></td>
        <td class="planet"><img src="${getImageFile("neptune")}" alt="Neptune"></td>
        <td></td>
        <td></td>
        <td class="top-right-corner"></td>
    </tr>
    <tr id="row-2">
        <td></td>
        <td></td>
        <td class="top-left-corner"></td>
        <td></td>
        <td class="top-right-corner"></td>
        <td class="planet"><img src="${getImageFile("mars")}" alt="Mars"></td>
    </tr>
    <tr id="row-3">
        <td></td>
        <td></td>
        <td></td>
        <td id="end-cell"><img src="${getImageFile("sun")}" alt="Sun">End</td>
        <td></td>
        <td></td>
    </tr>
    <tr id="row-4">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="planet"><img src="${getImageFile("jupiter")}" alt="Jupiter"></td>
        <td></td>
    </tr>
    <tr id="row-5">
        <td class="planet"><img src="${getImageFile("moon")}" alt="Moon"></td>
        <td></td>
        <td class="left-corner"></td>
        <td class="right-corner"></td>
        <td></td>
        <td></td>
    </tr>
    <tr id="row-6">
        <td></td>
        <td class="left-corner"><img src="${getImageFile("uranus")}" alt="Uranus"></td>
        <td></td>
        <td></td>
        <td class="right-corner"></td>
        <td class="planet"><img src="${getImageFile("venus")}" alt="Venus"></td>
    </tr>
    <tr id="row-7">
        <td class="left-corner"></td>
        <td></td>
        <td class="planet"><img src="${getImageFile("mercury")}" alt="Mercury"></td>
        <td></td>
        <td></td>
        <td class="right-corner"></td>
    </tr>
</table>
`;


// STEP 5 - Grab the buttons and display elements from the page
//          using getElementById and querySelector

const rollButton   = document.getElementById("roll-btn");    // the roll dice button
const messageBox   = document.getElementById("message-box"); // where we show messages
const scoreDisplay = document.getElementById("score-display"); // shows current points


// -----------------------------------------------------------
// STEP 6 - Game variables  (these change as the game runs)
// -----------------------------------------------------------

let shipRow   = 0;       // which row the ship is on  (starts top-left)
let shipCol   = 0;       // which column the ship is on
let direction = "down";  // the ship always starts by moving DOWN
let points    = 10;       // player score
let isMoving  = false;   // true while the ship is animating 

// -----------------------------------------------------------
// STEP 7 - Helper: getCell(row, col)
//          Returns the <td> element at a given row and column
// -----------------------------------------------------------
function getCell(row, col) {
    // Get all <tr> rows, pick the right one, then get the right <td> inside it
    let allRows = document.querySelectorAll("table tr");
    let targetRow = allRows[row];

    if (targetRow === undefined) {
        return null;   // row doesn't exist
    }

    let allCells = targetRow.querySelectorAll("td");
    let targetCell = allCells[col];

    if (targetCell === undefined) {
        return null;   // column doesn't exist
    }

    return targetCell;
}


// -----------------------------------------------------------
//          Removes the old ship image and puts it in a new cell
// -----------------------------------------------------------
function placeShip(row, col) {
    // Remove the old ship image from wherever it is now
    let oldShip = document.getElementById("ship");
    if (oldShip !== null) {
        oldShip.remove();
    }

    // Create a brand new <img> element for the ship
    let shipImg = document.createElement("img");
    shipImg.id  = "ship";
    shipImg.src = getImageFile("ship");   // src comes from our images array
    shipImg.alt = "ship";

    // Drop the ship image into the correct cell
    let cell = getCell(row, col);
    cell.appendChild(shipImg);
}


// -----------------------------------------------------------
// STEP 9 - Helper: updateScore()
//          Updates the score text on the page
// -----------------------------------------------------------
function updateScore() {
    scoreDisplay.textContent = "Resources: " + points;
}


// -----------------------------------------------------------
// STEP 10 - Helper: showMessage(text)
//           Puts a message in the message box on the page
// -----------------------------------------------------------
function showMessage(text) {
    messageBox.textContent = text;
}


// -----------------------------------------------------------
// STEP 11 - Helper: checkIfPlanet(row, col)
//           Looks through the planets array to see if the
//           ship just landed on a planet
//           If yes -> deduct 10 points (but keep moving!)
// -----------------------------------------------------------



// -----------------------------------------------------------
// STEP 12 - Helper: checkCorner(row, col)
//           Looks through the corners array to see if the
//           ship just hit a corner - if so, change direction
// -----------------------------------------------------------
function checkCorner(row, col) {
    let cell = getCell(row, col);
    if (cell === null) return;

    // Loop through every corner in our corners array
    for (let i = 0; i < corners.length; i++) {
        let corner = corners[i];   // current corner object

        // Does this cell have the corner's CSS class?
        if (cell.classList.contains(corner.cssClass)) {
            direction = corner.newDirection;   // turn the ship!
            break;
        }
    }
}


// -----------------------------------------------------------
// STEP 13 - Helper: showFloatingLabel(cell, text)
//           Creates a small label that floats up and fades out
// -----------------------------------------------------------
function showFloatingLabel(cell, text) {
    let label = document.createElement("div");
    label.textContent   = text;
    label.className     = "float-text";
    label.style.color   = "#ff4444";

    cell.style.position = "relative";   // needed so the label positions correctly
    cell.appendChild(label);

    // Remove the label after 1 second
    setTimeout(function() {
        label.remove();
    }, 1000);
}

 let tryAgain = document.getElementById('try-again')
let playAgain = document.getElementById('play-again')

// -----------------------------------------------------------
// STEP 14 - The main move function
//           Moves the ship one step at a time using setTimeout
//           so the player can SEE it moving across the board
// -----------------------------------------------------------
function moveShipOneStep(stepsLeft) {
    // Base case: no steps left -> movement is done
    if (stepsLeft === 0) {
        isMoving = false;
        rollButton.disabled = false;   // let the player roll again
        let addPoints = Math.floor(Math.random() * 100 );
        points = points + addPoints;
        updateScore()
        showMessage("Done moving! Roll the dice again 🎲");
        
        return;
    }

    // Work out the next row and column based on current direction
    let rowChange = 0;
    let colChange = 0;

    if (direction === "down")  { rowChange =  1; colChange =  0; }
    if (direction === "up")    { rowChange = -1; colChange =  0; }
    if (direction === "right") { rowChange =  0; colChange =  1; }
    if (direction === "left")  { rowChange =  0; colChange = -1; }

    let nextRow = shipRow + rowChange;
    let nextCol = shipCol + colChange;

    
    // let prevRow = shipRow - rowChange;
    // let prevCol = shipCol - colChange;

    // Make sure the next cell actually exists (safety check)
    let nextCell = getCell(nextRow, nextCol);
    if (nextCell === null) {
        isMoving = false;
        rollButton.disabled = false;
        showMessage("Reached the edge of the board!");
        return;
    }

    // Move the ship to the new position
    shipRow = nextRow;
    shipCol = nextCol;
    placeShip(shipRow, shipCol);

    // Check if we landed on a corner -> change direction
    checkCorner(shipRow, shipCol);

    // Check if we landed on a planet -> lose points (movement continues)
    checkIfPlanet(shipRow, shipCol, stepsLeft);

    // Check if we reached the end cell
    let currentCell = getCell(shipRow, shipCol);
   

    if (currentCell.id === "end-cell") {
        isMoving = false;
        rollButton.disabled = true; 
        if(points >= 1000){
         showMessage("You reached the Sun with " + points + " in resources and stopped it from exploding! You're a hero!");
         playAgain.classList.remove('active')
         return;
        }else{
         showMessage("You reached the Sun with  " + points + " in resources. It's not enough and the sun exploded!");  
         tryAgain.classList.remove('active')
         return;
        }

       
        
    }

    // Wait 400ms then move the next step
    setTimeout(function() {
        moveShipOneStep(stepsLeft - 1);
    }, 400);
}

function checkIfPlanet(row, col) {
    // Loop through every planet in our planets array
    for (let i = 0; i < planets.length; i++) {
        let planet = planets[i];   // current planet object

        // Does this planet's row AND col match where the ship is?
        if (planet.row === row && planet.col === col) {
            let decision = prompt("Board planet? You can earn extra resources")
            if(decision === "yes"){
                let guessInput = prompt("You've encountered aliens! Pick a number 1-10 to decide your fate")
               let guess = Number(guessInput)
                let fate = Math.floor(Math.random() * 10);
                let fate2 = Math.floor(Math.random() * 10);
                let fate3 = Math.floor(Math.random() * 10)
                

               if(guess === fate || guess === fate2 || guess === fate3 ){
                alert("The aliens were nice enough to give you extra resources!")
                let extraPoints = Math.floor(Math.random() * 2000 );
                points = points + extraPoints
                updateScore()
               }else if (guess = Number){
                let response = prompt("The aliens want to steal your resouces! do you want to fight back?")
                if(response === "no"){
                alert("You let the aliens take your things :|")
                let lossPoints = Math.floor(Math.random() * 100 );
                points = points - lossPoints;
                updateScore()
                }else if(response === 'yes'){
                    let reaction = prompt("Attack or Flee? ");
                    if(reaction === "attack"){
                       let random = Math.floor(Math.random() * 2);
                       if(random === 1){
                        alert("You sucessfully fought back and stole their resources!");
                        let extraPoints = Math.floor(Math.random() * 1000 );
                        points = points + extraPoints
                        updateScore()
                        return;
                       }else if (random === 2){
                        alert("They beat you up and stole more than originally planned :o")
                        let lossPoints = Math.floor(Math.random() * 1000 );
                        points = points - lossPoints;
                        updateScore();
                        return;
                       }else{
                        alert("You lost but they decided to spare you :)");
                         

                       }
                    }else if(reaction === "flee"){
                       let flee =  prompt("Left or Right?")
                       if(flee === "right" || "left"){
                         let random = Math.floor(Math.random() * 1);
                       if(random === 1){
                        prompt("You sucessfully fleed!")
                       }else{
                        alert("They beat you up and stole more than originally planned :o")
                       }
                       }
                       
                    }
                }else{
                    alert("You let them do whatever >:( ")
                    let lossPoints = Math.floor(Math.random() * 100 );
                     points = points - lossPoints;
                }
                
               }
               

               
            
                

                // Flash the cell red briefly
                let cell = getCell(row, col);
                cell.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
                setTimeout(function() {
                    cell.style.backgroundColor = "";
                }, 600);
            

                // Show a floating "-10" label above the cell
                showFloatingLabel(cell, + '' + planet.name);
                

                
                break;
            }else if (decision === "no"){
                alert("You missed out on a good oppurtunity")
                continue;
            }
            
               
            
            
        } 
    }
}


// -----------------------------------------------------------
// STEP 15 - addEventListener on the Roll button
//           This replaces onclick="rollDice()" in the HTML
//           "click" means: run this code when the button is clicked
// -----------------------------------------------------------
rollButton.addEventListener("click", function() {
    // Don't allow rolling while the ship is still moving
    if (isMoving) return;

    // Roll a random number between 1 and 12
    let diceRoll = Math.floor(Math.random() * 12) + 1;

    // Show the roll result in the message box
    showMessage("You rolled a " + diceRoll + "! Moving " + diceRoll + " space(s)...");

    // Lock the button so the player can't roll again mid-move
    isMoving = true;
    rollButton.disabled = true;

    // Start moving the ship
    moveShipOneStep(diceRoll);
});


// -----------------------------------------------------------
// STEP 16 - Start the game!
//           Place the ship at the starting cell and show a welcome message
// -----------------------------------------------------------
placeShip(0, 0);
updateScore();
showMessage("You're on a journey to the sun to stop it from exploding with enough resources you can save everybody! 🚀");

function resetGame(){
    playAgain.classList.add('active')
    tryAgain.classList.add('active')
     shipRow   = 0;       
     shipCol   = 0;       
     direction = "down";  
     points    = 10;       
     isMoving  = false;
     stepsLeft = 0
     moveShipOneStep(stepsLeft)
    showMessage("You're on a journey to the sun to stop it from exploding with enough resources you can save everybody! 🚀");
   placeShip(0, 0);
    updateScore();
    
    
}
