$(document).ready(function() {
    let numCards;
    let cards = [];
    let timer;
    let numAttempts = 0;
    let numMatches = 0;
    let isGameActive = false;
    const gameBoard = $('#game-board');
    
    $('#game-setup').submit(function(e) {
        e.preventDefault();

        const playerName = $('#name').val();
        numCards = parseInt($('#num-cards').val());
        const theme = $('#theme').val();

        if (numCards % 2 !== 0) {
        alert('Number of cards must be even.');
        return;
        }

        if (numCards > 60) {
        alert('Maximum number of cards is 60.');
        return;
        }

        setupGame(playerName, numCards, theme);
        $(this).hide();
        isGameActive = true;
    });

    $(document).on('click', '#restart-btn', function() {
        restartGame();
    });

    $(document).on('click', '#new-game-btn', function() {
        restartGame();
    });

    function setupGame(playerName, numCards, theme) {
        const cardImages = getCardImages(theme);
        cards = generateCardPairs(numCards, cardImages);
        cards = shuffleArray(cards);
        const restartGameBtn = $('<button></button>').attr('id', 'restart-btn').attr('class','btn btn-primary').text('Restart');
        $('#game-info').append(restartGameBtn);
        displayGameBoard();
        startTimer();
    }

    function getCardImages(theme) {
        const cardImages = {
        'animals': ['./images/animals/bat.png', './images/animals/chameleon.png', './images/animals/chick.png', './images/animals/crab.png', './images/animals/crocodile.png', './images/animals/dolphin.png', './images/animals/elephant.png', './images/animals/fish.png', './images/animals/fox.png', './images/animals/frog.png', './images/animals/giraffe.png', './images/animals/hen.png', './images/animals/jellyfish.png', './images/animals/koala.png', './images/animals/lion.png', './images/animals/monkey.png', './images/animals/mouse.png', './images/animals/octopus.png', './images/animals/owl.png', './images/animals/panda.png', './images/animals/peacock.png', './images/animals/penguin.png', './images/animals/seahorse.png', './images/animals/shark.png', './images/animals/sheep.png', './images/animals/sloth.png', './images/animals/snake.png', './images/animals/squirrel.png', './images/animals/tiger.png', './images/animals/toucan.png', './images/animals/turtle.png', './images/animals/whale.png'],
        'tropical': ['./images/tropical/banana.png', './images/tropical/beach-house.png', './images/tropical/bird-of-paradise.png', './images/tropical/boy.png', './images/tropical/butterfly.png', './images/tropical/cactus.png', './images/tropical/chameleon.png', './images/tropical/clownfish.png', './images/tropical/cocktail.png', './images/tropical/coconut-drink.png', './images/tropical/crab.png', './images/tropical/dolphin.png', './images/tropical/dragon-fruit.png', './images/tropical/fish.png', './images/tropical/flamingo.png', './images/tropical/girl.png', './images/tropical/hawaiian-shirt.png', './images/tropical/hibiscus.png', './images/tropical/hummingbird.png', './images/tropical/ice-cream.png', './images/tropical/jellyfish.png', './images/tropical/macaw.png', './images/tropical/mango.png', './images/tropical/mermaid.png', './images/tropical/merman.png', './images/tropical/monstera-leaf.png', './images/tropical/octopus.png', './images/tropical/orchid.png', './images/tropical/palm.png', './images/tropical/papaya.png', './images/tropical/pearl.png', './images/tropical/pelican.png', './images/tropical/popsicle.png', './images/tropical/sand-castle.png', './images/tropical/seagull.png', './images/tropical/sea-horse.png', './images/tropical/shell.png', './images/tropical/starfish.png', './images/tropical/stingray.png', './images/tropical/succulent.png', './images/tropical/sun.png', './images/tropical/sun-umbrella.png', './images/tropical/surfboard.png', './images/tropical/thermometer.png', './images/tropical/toucan.png', './images/tropical/turtle.png', './images/tropical/volcano.png'],
        'wild-west': []
        };

        return cardImages[theme];
    }

    function generateCardPairs(numCards, cardImages) {
        const cardPairs = [];
        const themeLength = cardImages.length;
        const usedImages = [];
    
        for (let i = 0; i < numCards / 2; i++) {
        let randomIndex = Math.floor(Math.random() * themeLength);
        let cardImage = cardImages[randomIndex];
    
        while (usedImages.includes(cardImage)) {
            randomIndex = Math.floor(Math.random() * themeLength);
            cardImage = cardImages[randomIndex];
        }
    
        usedImages.push(cardImage);
    
        const cardPair = {
            id: i,
            img: cardImage,
            isMatched: false,
            isFlipped: false
        };
    
        cardPairs.push(cardPair);
        cardPairs.push({...cardPair});
        }
    
        return cardPairs;
    }
    
    

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    function resizeCards(){
        let cardSize = 160;
        if(cardSize > 10 && cardSize <= 18)
            cardSize = 120;
        else if (numCards > 18 && numCards <= 36)
            cardSize = 100;
        else if (numCards > 38 && numCards <= 50)
            cardSize = 90;
        else if (numCards > 50)
            cardSize = 75;
        
        const numColumns = Math.floor(gameBoard.width() / (cardSize + 20));
        const cardWidth = (gameBoard.width() - (numColumns - 1) * 20) / numColumns;
        
        const style = $('<style>').text(`
            .card {
            width: ${cardWidth}px !important;
            height: ${cardSize}px !important;
            margin: 10px;
            }
        `);
        $('head').append(style);
    }

    function displayGameBoard() {
        gameBoard.empty();
        resizeCards();

        for (let i = 0; i < numCards; i++) {
            const card = $('<div class="card"></div>');
            const cardId = cards[i].id;
            const cardImg = cards[i].img;

            card.attr('data-id', cardId);
            const frontImage = $('<div></div>').addClass('front-image hidden').css('background-image', `url(${cardImg})`);
            const backImage = $('<div></div>').addClass('back-image');
            const cardInner = $('<div></div>').addClass('card-inner').append(frontImage).append(backImage);
            card.append(cardInner);

            card.click(function() {
            if (!isGameActive || $(this).hasClass('matched') || $(this).hasClass('flipped')) {
                return;
            }

            flipCard($(this));
            });

            gameBoard.append(card);
        }
    }
    

    function flipCard(card) {
        card.toggleClass('flipped');

        if ($('.flipped').length === 2) {
            checkForMatch();
            numAttempts++;
            updateAttemptsDisplay();
        }

        // Display front image when card is flipped and hide the back image
        const frontImage = card.find('.front-image');
        frontImage.toggleClass('hidden');
        card.find('.back-image').addClass('hidden');
    }

    function checkForMatch() {
        const flippedCards = $('.flipped');
        const card1 = flippedCards.first();
        const card2 = flippedCards.last();
        const card1Id = card1.attr('data-id');
        const card2Id = card2.attr('data-id');
    
        if (card1Id === card2Id) {
        card1.removeClass('flipped').addClass('matched');
        card2.removeClass('flipped').addClass('matched');
        numMatches++;
        checkForWin();
        } else {
            setTimeout(function() {
                card1.removeClass('flipped');
                card2.removeClass('flipped');
                card1.find('.back-image').toggleClass('hidden');
                card2.find('.back-image').toggleClass('hidden');
                card1.find('.front-image').addClass('hidden');
                card2.find('.front-image').addClass('hidden');
        }, 1000);
        }
    }
    
    
    function checkForWin() {
        if (numMatches === numCards / 2) {
            stopTimer();
            isGameActive = false;
            $('#restart-btn').hide();
            displayGameResult();
        }
        }
        
        function displayGameResult() {
        const gameResult = `Congratulations, you won in ${numAttempts} attempts!`;
        const gameResultDiv = $('<div></div>').text(gameResult);
        const newGameButton = $('<button></button>').attr('id', 'new-game-btn').attr('class','btn btn-primary').text('New Game');
        
        $('#game-info').append(gameResultDiv).append(newGameButton);
        }
        
    
    function restartGame() {
        $('#game-info').empty();
        $('#game-setup').show();
        numAttempts = 0;
        numMatches = 0;
        isGameActive = false;
        clearInterval(timer);
        $('#timer').text('Time: 0 s');
        $('#attempts').text('Attempts: 0');
        $('#game-board').empty();
    }

    function startTimer() {
        let seconds = 0;
        timer = setInterval(function() {
        seconds++;
        $('#timer').text(`Time: ${seconds} s`);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function updateAttemptsDisplay() {
        $('#attempts').text(`Attempts: ${numAttempts}`);
    }

});
  