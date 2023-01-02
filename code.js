const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const container = document.getElementById("container");
const quoteDisplayElement = document.getElementById("quoteDisplay");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");

let timerID;
let isTimerStated = false;
let quote;
let currentIndex = 0;
let strokes;

window.addEventListener("click", (event) => {
    const clickedNode = event.target;
    if (container.contains(clickedNode)) {
        if (!isTimerStated) {
            container.classList.add("container-focus");
            startTimer();
        }
    } else {
        container.classList.remove("container-focus");
        timerElement.innerText = 0;
        stopTimer();
        currentIndex = 0;
        resetStrokes();
        quoteDisplayElement.childNodes.forEach((node) => {
            node.classList.remove("correct");
            node.classList.remove("incorrect");
        });
    }
});

function calcualtewpm() {
    if (getTimerTime() > 0) {
        wpmElement.innerText = Math.round(
            parseFloat(correctStrokes()) / 5.0 / (parseFloat(getTimerTime()) / 60.0)
        );
    }
    // console.log("wpm", correctStrokes(), getTimerTime());
}

window.addEventListener("keydown", (e) => {
    if (isTimerStated) {
        var charCode = parseInt(e.keyCode);
        if (
            (charCode > 64 && charCode < 91) || // caps
            (charCode > 96 && charCode < 123) || //smalls
            (charCode > 47 && charCode < 58) || //numbers
            charCode === 32 || //space
            charCode === 188 || //comma
            charCode === 186 || //semi colon
            charCode === 190 || //full stop
            charCode === 191 || // forword slash
            charCode === 189 || //dash
            charCode === 222 //apostrophy
                            ) {
            if (quote[currentIndex] === e.key) {
                quoteDisplayElement.childNodes[currentIndex].classList.add("correct");
                quoteDisplayElement.childNodes[currentIndex].classList.remove(
                    "incorrect"
                );
                strokes[currentIndex] = 1;
            } else {
                quoteDisplayElement.childNodes[currentIndex].classList.add("incorrect");
                quoteDisplayElement.childNodes[currentIndex].classList.remove(
                    "correct"
                );
                strokes[currentIndex] = 0;
            }
            calcualtewpm();
            currentIndex++;
            if (currentIndex === quote.length) {
                currentIndex = 0;
                renderNewQuote();
            }
        } 
        else if (charCode === 8) {// 8 is backspace
            if (currentIndex === 0) return;
            currentIndex--;
            quoteDisplayElement.childNodes[currentIndex].classList.remove("correct");
            quoteDisplayElement.childNodes[currentIndex].classList.remove("incorrect");
        } 
        else {
            console.log("not a key");
        }
    }
});

const getRandomQuote = () => {
    return fetch(RANDOM_QUOTE_API_URL)
        .then((response) => response.json())
        .then((data) => data.content);
};

function resetStrokes() {
    for (let i = 0; i < strokes.length; i++) {
        strokes[i] = 0;
    }
}

function correctStrokes() {
    let count = 0;
    strokes.forEach((stroke) => {
        if (stroke) count++;
    });
    return count;
}

const renderNewQuote = async () => {
    quote = await getRandomQuote();
    if (isTimerStated) {
        stopTimer();
        startTimer();
    }
    currentIndex = 0;
    strokes = new Array(quote.length);
    strokes.fill(0);
    quoteDisplayElement.innerHTML = "";
    quote.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.innerText = char;
        quoteDisplayElement.appendChild(charSpan);
    });
};

let startTime;
function startTimer() {
    isTimerStated = true;
    timerElement.innerText = 0;
    startTime = new Date();
    timerID = setInterval(() => {
        timer.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function stopTimer() {
    isTimerStated = false;
    clearInterval(timerID);
}

renderNewQuote();