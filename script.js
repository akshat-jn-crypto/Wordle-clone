import targetWords from "./targetWords.js";
import dictionary from "./dictionary.js";

//<<<<<<< main
let WORD_LENGTH=null ;
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
let targetWord = null;
const allWords = Array.from(new Set([...targetWords[0],,...targetWords[1],...targetWords[2],...dictionary]));
////=======
const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;
const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");
const newGameButton = document.getElementById("newGameButton");
const offsetFromDate = new Date(2022, 0, 1);
const msOffset = Date.now() - offsetFromDate;
const dayOffset = msOffset / 1000 / 60 / 60 / 24;
let targetWord = targetWords[Math.floor(dayOffset) % targetWords.length];
const allWords = Array.from(new Set([...targetWords, ...dictionary]));
//>>>>>>> main

startInteraction();




let container=document.querySelector('.guess-grid');
let tiles='';

let levels=document.getElementsByClassName('level');
let flag=0;

Array.from(levels).forEach((e)=>{



   e.addEventListener('click',()=>{
  if(e.id==='1')setboxes(0,30,5,6);
  else if(e.id==='2')setboxes(1,42,6,7)
  else setboxes(2,56,7,8);
})

}


)
let setboxes=(index,level,col,row)=>{
container.innerHTML=''
targetWord =
targetWords[index][Math.floor(Math.random() * targetWords[index].length)];
console.log(targetWord)
WORD_LENGTH=col
container.style.gridTemplateColumns=`repeat(${col}, 2em)`
  container.style.gridTemplateRows=`repeat(${row}, 2em)`;

    for (let i = 0; i < level; ++i) {
      let subcontainer = document.createElement("div");
      subcontainer.className = "tile";
      container.appendChild(subcontainer);
    }
}




function startInteraction() {
  newGameButton.classList.add("hidden");
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]|[A-Z]$/)) {
    pressKey(e.key.toLowerCase());
    return;
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;
  const nextTile = guessGrid.querySelector(":not([data-letter])");
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()];
//<<<<<<< main

  
  if (activeTiles.length !== WORD_LENGTH) {
  
    showAlert("Not enough letters")
  
    shakeTiles(activeTiles)

    return
//=======
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
    shakeTiles(activeTiles);
    return;
//>>>>>>> main
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

//<<<<<<< main
  // if (!allWords.includes(guess)) {
  //   showAlert("Not in word list")
  //   shakeTiles(activeTiles)
  //   return
  // }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
  
//=======
  if (!allWords.includes(guess)) {
    showAlert("Not in word list");
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction();
  let used = [0, 0, 0, 0, 0];
  let marker = [0, 0, 0, 0, 0];
  activeTiles.forEach((...params) => markCorrect(...params, used, marker));
  activeTiles.forEach((...params) =>
    markWrongLocation(...params, used, marker)
  );
  activeTiles.forEach((...params) => flipTile(...params, guess, marker));
//>>>>>>> main
}

function markCorrect(tile, index, array, used, marker) {
  const letter = tile.dataset.letter;
  if (targetWord[index] === letter) {
    marker[index] = 1;
    used[index] = 1;
  }
}

function markWrongLocation(tile, index, array, used, marker) {
  const letter = tile.dataset.letter;
  for (let i = 0; i < 5; i++) {
    if (targetWord[i] === letter && used[i] === 0) {
      marker[index] = 2;
      used[i] = 1;
      break;
    }
  }
}

function flipTile(tile, index, array, guess, marker) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[data-key="${letter}"i]`);
  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * FLIP_ANIMATION_DURATION) / 2);

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip");
      if (marker[index] === 1) {
        tile.dataset.state = "correct";
        key.classList.add("correct");
      } else if (marker[index] === 2) {
        tile.dataset.state = "wrong-location";
        key.classList.add("wrong-location");
      } else {
        tile.dataset.state = "wrong";
        key.classList.add("wrong");
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction();
            checkWinLose(guess, array);
          },
          { once: true }
        );
      }
    },
    { once: true }
  );
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

function shakeTiles(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    );
  });
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You Win", 5000);
    danceTiles(tiles);
    newGameButton.classList.remove("hidden");
    stopInteraction();
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null);
    stopInteraction();
    newGameButton.classList.remove("hidden");
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * DANCE_ANIMATION_DURATION) / 5);
  });
}

newGameButton.addEventListener("click", startNewGame);

function startNewGame() {
  const tiles = Array.from(document.getElementsByClassName("tile"));
  tiles.forEach((e) => {
    setTimeout(() => {
      e.classList.add("flip");
    }, FLIP_ANIMATION_DURATION / 2);
    e.addEventListener(
      "transitionend",
      () => {
        e.classList.remove("flip");
        e.textContent = "";
        delete e.dataset.state;
        delete e.dataset.letter;
      },
      { once: true }
    );
  });
  const keys = Array.from(document.getElementsByClassName("key"));
  keys.forEach((e) => {
    e.classList.remove("correct");
    e.classList.remove("wrong-location");
    e.classList.remove("wrong");
  });

  targetWord = allWords[Math.floor(Math.random() * allWords.length)];
  startInteraction();
}
