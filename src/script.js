const wordInput = document.getElementById('word-input');
const submitBtn = document.getElementById('submit-btn');
let guessCount = 0;
let secretWord;

// check if there's a secretWord in local storage
if (localStorage.getItem('secretWord')) {
  secretWord = localStorage.getItem('secretWord');
  console.log(`Secret word from local storage: ${secretWord}`);
} else {
  getSecretWord();
}

function getSecretWord() {
  fetch('/src/word-list.json')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid word list');
      }
      const sixLetterWords = data.filter(word => word.length === 6);
      const randomIndex = Math.floor(Math.random() * sixLetterWords.length);
      secretWord = sixLetterWords[randomIndex].toUpperCase();
      localStorage.setItem('secretWord', secretWord);
      console.log(`Secret word: ${secretWord}`);
    })
    .catch(error => console.error(error));
}


// Game over function
function gameOver(guess) {
  if (guess === secretWord || guessCount === 6) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    const message = document.createElement('h1');
    message.textContent = guess === secretWord ? 'You win!' : 'Game over!';
    messageContainer.appendChild(message);
    const correctWord = document.createElement('p');
    correctWord.textContent = `The correct word was ${secretWord}`;
    messageContainer.appendChild(correctWord);
    const resetText = document.createElement('p');
    resetText.textContent = "Click the reset button to try again.";
    messageContainer.appendChild(resetText);
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.parentNode.insertBefore(messageContainer, gridContainer);
    gridContainer.style.display = "none";
  }
}

//Listen for submit button click
submitBtn.addEventListener("click", function () {
  const guess = wordInput.value.toUpperCase();
  guessCount++;
  checkGuess(guess, guessCount);

  const characters = guess.split("");

  const topRowItems = document.querySelectorAll(`#row-${guessCount} .grid-item`);
  for (let i = 0; i < topRowItems.length; i++) {
    topRowItems[i].textContent = characters[i];
  }

  gameOver(guess, guessCount);
});

// check the guess against the target word and update colours correspondingly
function checkGuess(guess, count) {
  const topRowItems = document.querySelectorAll(`#row-${count} .grid-item`);
  for (let i = 0; i < topRowItems.length; i++) {
    const cell = topRowItems[i];
    if (guess[i] === secretWord[i]) {
      cell.style.backgroundColor = "green";
    } else if (secretWord.includes(guess[i])) {
      cell.style.backgroundColor = "rgb(173, 173, 0)";
    } else {
      cell.style.backgroundColor = "#666666";
    }
  }
}

//Reset Button
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function() {
  localStorage.removeItem('secretWord');
  location.reload();
  const gridContainer = document.querySelector('.grid-container');
  const messageContainer = document.querySelector('.message-container');
  if (messageContainer) {
    messageContainer.parentNode.removeChild(messageContainer);
  }
  gridContainer.style.display = "grid";
  const gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].textContent = '';
    gridItems[i].style.backgroundColor = '#121213';
  }
  guessCount = 0;
});

