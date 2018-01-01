function Main() {
    var userSign = askUserSign();
    var aiSign = setAiSign(userSign);
    startGame(userSign, aiSign);
}

function startGame(userSign, aiSign) {
    var userTurn = false;
    var possibleWins = "123-456-789-147-258-369-159-357".split("-");
    // Initial movement
    var currentAiWin = selectRandomWin(possibleWins);
    console.log("First win:", currentAiWin);
    // Decide a random order in which the ai will select the cells
    var winOrder = shuffle(currentAiWin.split(""));
    console.log("Current order:", winOrder);
    var movementsDone = 1;
    // A 1 Mhz clock (?
    var mainLoop = setInterval(function () {
        if (!userTurn) {
            // First see if the current win was removed from the possible wins
            if (possibleWins.indexOf(currentAiWin) === -1) {
                // Check if there are possible wins remaining
                if (possibleWins.length !== 0) {
                    console.log("possible win blocked, changing to a new one");
                    currentAiWin = selectRandomWin(possibleWins);
                    console.log("New win:", currentAiWin);
                    winOrder = shuffle(currentAiWin.split(""));
                    console.log("New win order:", winOrder);
                    movementsDone = 1;
                } else {
                    console.log("No more wins available");
                    currentAiWin = undefined;
                    // There are no more possible wins
                    // just randomize the play
                    console.log(getAvailableCells());
                }
            }
            console.log(movementsDone);
            console.log(currentAiWin);
            makeAiPlay(aiSign, winOrder);
            movementsDone++;
            userTurn = !userTurn;
            getUserPlay(userSign, function (userPlay) {
                possibleWins = removePossibleWin(possibleWins, userPlay);
                userTurn = !userTurn;
            });
        }
    }, 1);
}

function getAvailableCells() {
    var available = [];
    for (var i = 1; i <= 9; i++) {
        var cell = getCell(i);
        if (cell.html() === "") {
            available.push(cell);
        }
    }
    return available;
}

function makeAiPlay(sign, order) {
    var playDone = false;
    for (var i = 0; i < order.length; i++) {
        var cell = getCell(Number(order[i]));
        if (cell.html() === "" && !playDone) {
            console.log("Making movement to cell", order[i]);
            cell.html(sign);
            playDone = true;
        }
    }
    return playDone;
}

// Kudos: https://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setAiSign(userSign) {
    if (userSign === "X") {
        return "O";
    }
    return "X";
}

function getCell(number) {
    var gameCells = u(".game-cell");
    for (var i = 0; i < gameCells.nodes.length; i++) {
        var gameCell = u(gameCells.nodes[i]);
        if (Number(gameCell.data("cell-num")) === number) {
            return gameCell;
        }
    }
}

function selectRandomWin(possibleWins) {
    return possibleWins[Math.floor(Math.random() * possibleWins.length)];
}

function removePossibleWin(possibleWins, move) {
    var indexes = [];
    var i;
    // get the indexes of the possible win that clashes with the user move
    for (i = 0; i < possibleWins.length; i++) {
        if (possibleWins[i].indexOf(move) !== -1) {
            indexes.push(i);
        }
    }
    // Now remove those possible wins
    var removed = 0;
    for (i = 0; i < indexes.length; i++) {
        possibleWins.splice(indexes[i], 1);
        removed++;
        if (i !== indexes.length - 1) {
            indexes[i + 1] -= removed;
        }
    }
    return possibleWins;
}

function removeClickEvents() {
    for (var i = 1; i <= 9; i++) {
        var cell = getCell(i);
        cell.off("click");
    }
}

function getUserPlay(userSign, callback) {
    console.log("Your turn user");
    for (var i = 1; i <= 9; i++) {
        var cell = getCell(i);
        // Add a click event to all cells
        cell.on("click", function (e) {
            var target = u(e.target);
            if (target.html() === "") {
                target.html(userSign);
                var lastUserMove = target.data("cell-num");
                removeClickEvents();
                callback(lastUserMove);
            }
        });
    }
}

function askUserSign() {
    var sign = prompt("What sign will you use? (X or O)").toUpperCase();
    while (!(sign === "X" || sign === "O")) {
        sign = prompt("What sign will you use? (X or O)").toUpperCase();
    }
    return sign;
}

// Run Main function
(function() {
    Main();
})();