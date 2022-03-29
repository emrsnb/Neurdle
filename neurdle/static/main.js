const GUESS_CHARACTERS = 5
const MAX_GUESSES = 6

let submitLock = false;
let hasWon = false;
let guess = "";
let numGuesses = 0;

function ready() {
    // Focus the fake input on page load
    let fakeInput = document.getElementById("fake-input");
    fakeInput.focus()
    fakeInput.addEventListener("change", evt=>fakeInput.value="")
}

function updateLetters() {
    if (numGuesses == MAX_GUESSES) return;
    let rows = document.querySelectorAll(".row")
    let letters = rows[numGuesses].children
    for (let i = 0; i < letters.length; i++) {
        if (i < guess.length) {
            letters[i].innerHTML = guess[i];
        } else {
            letters[i].innerHTML = " "
        }
    } 

}

async function submitGuess() {
    if (guess.length != GUESS_CHARACTERS) return;
    
    // freeze while submission is in progress
    if (submitLock) return;
    submitLock = true;
    
    // Post to server
    let response = await fetch("/guess", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({text: guess})
    })

    // Get response
    let result = await response.text()
    let rows = document.querySelectorAll(".row")
    let letters = rows[numGuesses].children
    
    let anyWrong = false;
    for (let i = 0; i < GUESS_CHARACTERS; i++) {
        if (result[i] == "2") {
            letters[i].classList.add("right-place")
        } else if (result[i] == "1") {
            anyWrong = true;
            letters[i].classList.add("wrong-place")
        } else {
            anyWrong = true;
            letters[i].classList.add("not-in-word")
        }
    }

    // Check if won
    if (anyWrong == false) hasWon = true;

    // Move to next row
    numGuesses += 1;
    guess = ""
    updateLetters()

    // release submit lock
    submitLock = false;
}

function keypressed(event) {
    console.log(event.code)
    
    // No longer responsive if the game is over
    if (hasWon) return;
    if (numGuesses > MAX_GUESSES) return;

    // handle backspace
    if (event.code == 'Backspace') {
        if (guess.length > 0) {
            guess = guess.substring(0, guess.length-1);
        } else {
            console.log("Nothing to delete!")
        }
    }

    // handle enter/submit
    if (event.code == 'Enter') {
        if (guess.length == GUESS_CHARACTERS) {
            console.log("Submitted")
            submitGuess()
        } else {
            console.log("Can't submit!")
        }
    }

    // check if its a letter
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        if (guess.length == GUESS_CHARACTERS) {
            console.log("Can't enter more characters")
        } else {
            guess = guess + event.key
            console.log("Added " + event.key)
        }
    }

    updateLetters();
}

document.addEventListener("DOMContentLoaded", ready);
document.addEventListener("keydown", keypressed)