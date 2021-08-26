allPrizes = document.getElementsByClassName("prize");
pointerIndex = -1;
clockwisePrizes = [allPrizes[0], allPrizes[3], allPrizes[5], allPrizes[6], allPrizes[7], allPrizes[4], allPrizes[2], allPrizes[1]]

function rotateWheel() {
    timeStamps = buildArray();
    currentIndex = 0;
    currentSteps = 1;
    spin = setInterval(animate, 150);
    finishedSpin = false;
    function animate() {
        if (finishedSpin) {
            clearInterval(spin);
        } else if (currentIndex === timeStamps.length - 1 && currentSteps === timeStamps[currentIndex]) {
            finishedSpin = true;
            prizeText = clockwisePrizes[pointerIndex].getElementsByTagName("p")[0].innerHTML;
            prizeImage = clockwisePrizes[pointerIndex].getElementsByTagName("img")[0].src;
            prizeTextElement = document.getElementById("prize-content");
            prizeImageElement = document.getElementById("prize-image");
            prizeWindow = document.getElementsByClassName("prize-window")[0];
            prizeImageElement.src = prizeImage;
            prizeTextElement.innerHTML = prizeText;
            prizeWindow.className = "prize-window show";
        } else if (currentSteps === timeStamps[currentIndex]) {
            movePrize();
            currentIndex++;
            currentSteps = 1;
        } else {
            currentSteps++;
        }
    }
}

function getText(prize) {
    return prize.innerHTML;
}

function reset() {
    for (i = 0; i < allPrizes.length; i++) {
        allPrizes[i].className = "prize";
    }
    pointerIndex = -1;
}

function movePrize() {
    if (pointerIndex === -1) {
        pointerIndex = 0;
    } else {
        clockwisePrizes[pointerIndex].className = "prize";
        pointerIndex++;
    }
    if (pointerIndex === allPrizes.length) {
        pointerIndex = 0;
    }
    clockwisePrizes[pointerIndex].className = "prize chosen";
}

function buildArray() {
    timeStamps = new Array();
    let i = 0;
    let step = 8;
    let finalPrize = Math.random() * 20;
    for (i = 0; i < 3; i++) {
        timeStamps[i] = step;
        step /= 2;
    }
    for (; i < 30 + finalPrize; i++) {
        timeStamps[i] = 1;
    }
    for (; i < 34 + finalPrize; i++) {
        timeStamps[i] = step;
        step *= 2;
    }
    return timeStamps;
}

lottery = document.getElementsByClassName("lottery")[0];
if (lottery) {
    lottery.addEventListener("click",
        rotateWheel
    )
}

