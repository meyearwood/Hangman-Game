// Wait until document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Array of Words
    var wordsArr = [
        'BEACH',
        'SUN',
        'SAND',
        'VACATION',
        'TAN',
        'SUNSCREEN',
        'SUNBURN',
        'OCEAN',
        'POOL',
        'SWIM',
        'FLOAT',
        'BOAT',
        'FISH',
        'SHARK',
        'HOTDOGS',
        'BOARDWALK',
        'SNORKLING',
        'POPSICLE',
        'PICNIC',
    ];
    // Obj of Valid Letters
    var lettersObj = {
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
        E: 'E',
        F: 'F',
        G: 'G',
        H: 'H',
        I: 'I',
        J: 'J',
        K: 'K',
        L: 'L',
        M: 'M',
        N: 'N',
        O: 'O',
        P: 'P',
        Q: 'Q',
        R: 'R',
        S: 'S',
        T: 'T',
        U: 'U',
        V: 'V',
        W: 'W',
        X: 'X',
        Y: 'Y',
        Z: 'Z',
    };
    // Array of letters guessed
    var lettersGuessed = [];
    // Count of letters guessed Correctly
    var lettersGuessedCorrectly = 0;
    // Max Guesses
    var maxGuesses = 7;
    // # of guesses left
    var remainingGuesses = maxGuesses;
    // # of wins
    var wins = 0;
    // # of losses
    var losses = 0;
    // Variable for setting word used in a round of hangman
    var currentWord;
    // Game Message Variable
    var gameMessage;
    // Track if game is in progress
    var gameStarted = false;
    // Initial Game Message Value
    var defaultGameMessage = 'Press any key to get started!';
    // You Lost Message
    var youLostMessage = 'You Lose! Press any key to play again.';
    // You Won Message
    var youWonMessage = 'You\'re a Winner! Press any key to play again.';
    // Message DOM
    var messageDOM = document.getElementById('game-message');
    // Letters Container DOM
    var lettersContainerDOM = document.getElementById('letters-container');
    // Used Letters Container DOM
    var usedLettersContainerDOM = document.getElementById('used-letters-container__inner');
    // Wins DOM
    var winsDOM = document.getElementById('stats-wins');
    // Losses DOM
    var lossesDOM = document.getElementById('stats-losses');
    // Remaining Guesses DOM
    var remainingGuessesDOM = document.getElementById('stats-guesses-remaining');

    // Function for initializing the game
    function init() {
        // Set up keyboard event listener
        document.addEventListener('keypress', handleKeyUpEvent);
        // Set up game message
        setGameMessage();
        generateRandomWord();
        // Set stats defaults
        winsDOM.innerHTML = wins;
        lossesDOM.innerHTML = losses;
        remainingGuessesDOM.innerHTML = remainingGuesses;

    }

    // Function for handling keyup event
    function handleKeyUpEvent(event) {
        // console.log('%c %s', 'background-color: black; color: white; font-size: 16px; font-weight: bold;', 'onkeypress: ', event.key);
        // See if the game has already started.
        // If not, start the game.
        // Otherwise, track the keys
        if (!gameStarted) {
            gameStarted = true;
            setGameMessage();
        } else {
            trackLetterGuessed(event.key);
        }
    }

    // Function for tracking letters guessed
    function trackLetterGuessed(letter) {
        var letterUpperCase = letter.toUpperCase();
        // Check to see if letter is valid.
        var isValidLetter = validateLetterUsed(letter);
        var dashElements = document.getElementsByClassName('letters-container__dash');

        // console.log('isValidLetter: ', isValidLetter);
        // console.log('dashElements: ', dashElements);

        if (isValidLetter) {
            // Check to see if they have already used this letter.
            var letterAlreadyUsed = lettersGuessed.indexOf(letter) > -1;

            if (!letterAlreadyUsed) {
                // Check to see if letter exists in the current word.
                var correctGuess = currentWord.indexOf(letterUpperCase) > -1;

                // If it exists in current word:
                if (correctGuess) {
                    // - Show in dashes.
                    for (var i = 0; i < currentWord.length; i++) {
                        // Do check to only show correct letter
                        // console.log('Is this letter: ', currentWord[i] === letterUpperCase);
                        if (currentWord[i] === letterUpperCase) {
                            dashElements[i].innerHTML = currentWord[i];
                        }
                    }
                    // - Update # of letters Guessed Correctly.
                    // For every occurence of the letter, update count.
                    for (var i = 0; i < currentWord.length; i++) {
                        if (currentWord[i] === letterUpperCase) {
                            lettersGuessedCorrectly += 1;
                        }
                    }
                    console.log('lettersGuessedCorrectly: ', lettersGuessedCorrectly);
                    console.log('game over? ', lettersGuessedCorrectly === currentWord.length);
                    // - Check if they have guessed the word:
                    // -- If yes, game is over (win).
                    if (lettersGuessedCorrectly === currentWord.length) {
                        gameOver(true);
                    }
                    // If it does not exist in current word:
                } else {
                    // Update available guesses remaining.
                    updateRemainingGuesses();
                    // - Check available guesses remaining.
                    // -- If there are no guesses remaining, game is over (lose).
                    if (remainingGuesses === 0) {
                        gameOver(false);
                    }
                }

                // Update Letters Used.
                if (gameStarted) {
                    updateLettersGuessed(letter);
                }
            }
        }
    }

    // Function for updating letters guessed
    function updateLettersGuessed(letter) {
        if (!!letter) {
            lettersGuessed.push(letter);
        }

        var lettersGuessedString = lettersGuessed.join(' ');
        usedLettersContainerDOM.innerHTML = lettersGuessedString;
    }

    // Function for validating letter used in guess.
    function validateLetterUsed(letter) {
        var uppercaseLetter = letter.toUpperCase(); // 'A'
        // Compare to see if letter exists in lettersObj.
        return uppercaseLetter === lettersObj[uppercaseLetter]; // lettersObj['A']
    }

    // Function for generating random word
    function generateRandomWord() {
        var numberOfWords = wordsArr.length;
        var randomIdx = Math.floor(Math.random() * numberOfWords);
        var randomWord = wordsArr[randomIdx];

        // Check to see if there is a currentWord.
        // - If yes, call myself to try generating another new word.
        if (!!currentWord && (currentWord === randomWord)) {
            generateRandomWord();
            // - If no, set up the new word.
        } else {
            // console.log('randomIdx: ', randomIdx);
            currentWord = wordsArr[randomIdx];
            console.log('currentWord: ', currentWord);
            // Now that we have a word, create the dashes in the UI.
            generateDashes();
        }
    }

    // Function for generating dashes in UI.
    function generateDashes() {
        for (var i = 0; i < currentWord.length; i++) {
            // Get the letter in the current word at this index.
            var letter = currentWord[i];
            // Create DOM element
            var dashDOM = document.createElement('div');
            // Add 'letters-container__dash' class to element.
            dashDOM.classList.add('letters-container__dash');
            // Add new dash to letters container DOM
            lettersContainerDOM.appendChild(dashDOM);
        }
    }

    // Function for Updating Wins
    function updateWins() {
        wins += 1;
        winsDOM.innerHTML = wins;
    }

    // Function for Updating Losses
    function updateLosses() {
        losses += 1;
        lossesDOM.innerHTML = losses;
    }

    // Function for Updating Remaining Guesses
    function updateRemainingGuesses(reset) {
        if (reset) {
            remainingGuesses = maxGuesses;
            remainingGuessesDOM.innerHTML = remainingGuesses;
        } else {
            remainingGuesses -= 1;
            remainingGuessesDOM.innerHTML = remainingGuesses;
        }
    }

    // Function for Dealing with Game Ending
    function gameOver(didWin) {
        // console.log('game over called: ', didWin);
        // Update message
        setGameMessage(didWin);

        // If they won:
        if (didWin) {
            // - Update Wins count
            updateWins();
            // If they lose:
        } else {
            // - Update Losses count
            updateLosses();
        }

        // Reset Remaining Guesses
        updateRemainingGuesses(true);
        // Reset gameStarted
        gameStarted = false;
        // Reset letters guessed correctly count
        lettersGuessedCorrectly = 0;
        // Reset letters guessed
        resetLettersGuessed();
        // Reset the word for a new game
        resetWord();
    }

    // Function for resetting word for a new game.
    function resetWord() {
        // First, remove all the dashes
        while (lettersContainerDOM.hasChildNodes()) {
            lettersContainerDOM.removeChild(lettersContainerDOM.firstChild);
        }
        // Next, Generate new word.
        generateRandomWord();
    }

    // Function for resetting Letters Guessed
    function resetLettersGuessed() {
        lettersGuessed = [];
        updateLettersGuessed();
    }

    // Function for setting the game message
    function setGameMessage(didWin) {
        // Check if this is first time
        var firstTime = !gameStarted && (wins === 0) && (losses === 0);

        // Set up first Time message
        if (firstTime) {
            gameMessage = defaultGameMessage;
            // Check if game has started and no win status provided.
            // Means game is in progress.
        } else if (gameStarted && didWin === undefined) {
            gameMessage = 'Good Luck!';
            // Check if game has started and they did win.
        } else if (gameStarted && didWin) {
            gameMessage = youWonMessage;
            // Check if game has started and they did not win.
        } else if (gameStarted && !didWin) {
            gameMessage = youLostMessage;
        }

        messageDOM.innerHTML = gameMessage;
    }

    // Initialize Game
    init();
});
