const GUESS_CHARACTERS = 5
let guess = "";

function ready() {
    let element = document.getElementById("hello-world")
    fetch("/test")
        .then(response => response.text())              // decode the response
        .then(text => element.innerHTML = text)         // put it in the html element
}

function updateLetters() {
    let elements = document.querySelectorAll("#row > div")
    for (let i = 0; i < elements.length; i++) {
        if (i < guess.length) {
            elements[i].innerHTML = guess[i];
        } else {
            elements[i].innerHTML = ""
        }
    } 

}

async function submitGuess() {
    if (guess.length != GUESS_CHARACTERS) return;

    let response = await fetch("/guess", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({text: guess})
    })
    guess = ""
    updateLetters()

    let result = await response.text()
    console.log(result)
    document.getElementById("hello-world").innerHTML = result
}

function keypressed(event) {
    console.log(event.code)
    
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