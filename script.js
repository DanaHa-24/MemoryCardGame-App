$(document).ready(function() {  
});
   
let numCards;
let cards = [];
let timerInterval;
let attemptCount = 1;
let matchCount = 0;
let isGameActive = false;
let isTimerPaused = false;
let seconds = 0;
const gameBoard = $('#game-board');
const restartGameBtn = $('<button></button>').attr('id', 'restart-btn').attr('class','btn btn-primary').text('Restart');
const pauseResumeButton = $('<button></button>').attr('id', 'pause-resume-btn').attr('class', 'btn btn-primary').text('Pause');
const cardImages = {
    'animals': ['./images/animals/bat.png', './images/animals/chameleon.png', './images/animals/chick.png', './images/animals/crab.png', './images/animals/crocodile.png', './images/animals/dolphin.png', './images/animals/elephant.png', './images/animals/fish.png', './images/animals/fox.png', './images/animals/frog.png', './images/animals/giraffe.png', './images/animals/hen.png', './images/animals/jellyfish.png', './images/animals/koala.png', './images/animals/lion.png', './images/animals/monkey.png', './images/animals/mouse.png', './images/animals/octopus.png', './images/animals/owl.png', './images/animals/panda.png', './images/animals/peacock.png', './images/animals/penguin.png', './images/animals/seahorse.png', './images/animals/shark.png', './images/animals/sheep.png', './images/animals/sloth.png', './images/animals/snake.png', './images/animals/squirrel.png', './images/animals/tiger.png', './images/animals/toucan.png', './images/animals/turtle.png', './images/animals/whale.png'],
    'tropical': ['./images/tropical/banana.png', './images/tropical/beach-house.png', './images/tropical/bird-of-paradise.png', './images/tropical/boy.png', './images/tropical/butterfly.png', './images/tropical/cactus.png', './images/tropical/chameleon.png', './images/tropical/clownfish.png', './images/tropical/cocktail.png', './images/tropical/coconut-drink.png', './images/tropical/crab.png', './images/tropical/dolphin.png', './images/tropical/dragon-fruit.png', './images/tropical/fish.png', './images/tropical/flamingo.png', './images/tropical/girl.png', './images/tropical/hawaiian-shirt.png', './images/tropical/hibiscus.png', './images/tropical/hummingbird.png', './images/tropical/ice-cream.png', './images/tropical/jellyfish.png', './images/tropical/macaw.png', './images/tropical/mango.png', './images/tropical/mermaid.png', './images/tropical/merman.png', './images/tropical/monstera-leaf.png', './images/tropical/octopus.png', './images/tropical/orchid.png', './images/tropical/palm.png', './images/tropical/papaya.png', './images/tropical/pearl.png', './images/tropical/pelican.png', './images/tropical/popsicle.png', './images/tropical/sand-castle.png', './images/tropical/seagull.png', './images/tropical/sea-horse.png', './images/tropical/shell.png', './images/tropical/starfish.png', './images/tropical/stingray.png', './images/tropical/succulent.png', './images/tropical/sun.png', './images/tropical/sun-umbrella.png', './images/tropical/surfboard.png', './images/tropical/thermometer.png', './images/tropical/toucan.png', './images/tropical/turtle.png', './images/tropical/volcano.png'],
    'wild-west': ['./images/wild-west/archery.png','./images/wild-west/barrel.png','./images/wild-west/bartender.png','./images/wild-west/bomb.png','./images/wild-west/bonfire.png','./images/wild-west/boot.png','./images/wild-west/cactus.png','./images/wild-west/cowboy.png','./images/wild-west/fang.png','./images/wild-west/farmer.png','./images/wild-west/gold-bars.png','./images/wild-west/horseshoe.png','./images/wild-west/map.png','./images/wild-west/mine.png','./images/wild-west/native-american-boy.png','./images/wild-west/native-american-girl.png','./images/wild-west/pan-flute.png','./images/wild-west/poker-cards.png','./images/wild-west/poncho.png','./images/wild-west/revolver.png','./images/wild-west/rifle.png','./images/wild-west/saddle.png','./images/wild-west/saloon.png','./images/wild-west/sheriff-badge.png','./images/wild-west/sheriff.png','./images/wild-west/signpost.png','./images/wild-west/teepee.png','./images/wild-west/tequila.png','./images/wild-west/wanted.png','./images/wild-west/wheel.png'],
    'bakery': ['./images/bakery/apple-pie.png','./images/bakery/bakery-shop.png','./images/bakery/bakery.png','./images/bakery/basting-brush.png','./images/bakery/boy-baker.png','./images/bakery/bread.png','./images/bakery/brigadeiro.png','./images/bakery/cake-1.png','./images/bakery/cake-2.png','./images/bakery/cake-3.png','./images/bakery/chef.png','./images/bakery/cookie-1.png','./images/bakery/cookie-4.png','./images/bakery/cookie.png','./images/bakery/cookies.png','./images/bakery/croissant.png','./images/bakery/crunch-cake.png','./images/bakery/cupcake-1.png','./images/bakery/cupcake-2.png','./images/bakery/doughnut.png','./images/bakery/gingerbread-man-1.png','./images/bakery/gingerbread-man-2.png','./images/bakery/girl-baker.png','./images/bakery/macarons.png','./images/bakery/menu.png','./images/bakery/mixer.png','./images/bakery/mixing.png','./images/bakery/mould.png','./images/bakery/pancakes.png','./images/bakery/pastry-bag.png','./images/bakery/pastry.png','./images/bakery/recipe-book.png','./images/bakery/rolling-pin.png','./images/bakery/spatula.png','./images/bakery/wafer.png']
    };


function handleGameSetupSubmit(e) {
    e.preventDefault();
    
    const playerName = $('#name').val();
    numCards = parseInt($('#num-cards').val());
    const theme = $('#theme').val();
    const speed = $('#speed').val();
    
    if (numCards % 2 !== 0) {
        alert('Number of cards must be even.');
        return;
    }
    
    if (numCards > 60) {
        alert('Maximum number of cards is 60.');
        return;
    }
    
    setupGame(playerName, numCards, theme, speed);
    $(this).hide();
    isGameActive = true;
}
    
$('#game-setup').submit(handleGameSetupSubmit);
      

$(document).on('click', '#restart-btn', function() {
    restartGame();
    
});

$(document).on('click', '#new-game-btn', function() {
    restartGame();
});

$(document).on('click', '#pause-resume-btn', function() {
    if (isTimerPaused) {
        resumeTimer();
        pauseResumeButton.text('Pause');
    } else {
        pauseTimer();
        pauseResumeButton.text('Resume');
    }
});

function setupGame(playerName, numCards, theme, speed) {
    const cardImages = getCardImages(theme);
    cards = generateCardPairs(numCards, cardImages);
    cards = shuffleArray(cards);
    
    $('#game-info').show();
    $('#timer').text('Time 00:00');
    startTimer();

    $('#game-info').append(restartGameBtn);
    $('#game-info').append(pauseResumeButton);
    displayGameBoard(); 
}

function getCardImages(theme) {
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
    if(numCards > 10 && numCards <= 18)
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
    // Check if the card is already flipped or matched
    if (card.hasClass('flipped') || card.hasClass('matched') || $('.flipped').length === 2) {
        return;
    }
    
    card.toggleClass('flipped');
    
    if ($('.flipped').length === 2) {
        // Disable click events on other cards until the match is checked
        $('.card').not('.flipped').off('click');
        checkForMatch();
        attemptCount++;
        updateAttemptsDisplay();
    }
    playAudio('flip-sound');
    
    // Display front image when card is flipped and hide the back image
    const frontImage = card.find('.front-image');
    frontImage.toggleClass('hidden');
    card.find('.back-image').addClass('hidden');
}
  
function setSpeed(){
    if (speed === 'Noraml')
        return 700;
    if (speed === 'Fast')
        return 500;
    else return 1000;
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
        playAudio('match-sound');
        matchCount++;
        checkForWin();
    } else {
        setTimeout(function() {
            card1.removeClass('flipped');
            card2.removeClass('flipped');
            card1.find('.back-image').toggleClass('hidden');
            card2.find('.back-image').toggleClass('hidden');
            card1.find('.front-image').addClass('hidden');
            card2.find('.front-image').addClass('hidden');
        }, setSpeed(speed));
    }
    
    // Re-enable click events on all cards for further matching
    $('.card').not('.matched').on('click', function() {
    flipCard($(this));
    });
}

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    audio.currentTime = 0;
    audio.play();
}
    
function checkForWin() {
    if (matchCount === numCards / 2) {
        setTimeout(playAudio('win-sound'),1000);
        stopTimer();
        isGameActive = false;
        $('#restart-btn').hide();
        $('#pause-resume-btn').hide();
        displayGameResult();
    }
}
    
function displayGameResult() {
    let gameResult;
    if (attemptCount > 1){
        gameResult = `Congratulations, you won in ${attemptCount} attempts!`;
    } 
    else{
        gameResult = `Congratulations, you won in ${attemptCount} attempt!`;
    }
    const gameResultDiv = $('<div></div>').attr('id','result-info').text(gameResult);
    const newGameButton = $('<button></button>').attr('id', 'new-game-btn').attr('class','btn btn-primary').text('New Game');
    
    $('#game-info').append(gameResultDiv).append(newGameButton);
    $('#pause-resume-btn').remove();
}

function startTimer() {
    timerInterval = setInterval(function() {
        if(!isTimerPaused)
            seconds++;
        $('#timer').text(`Time: ${formatTime(seconds)}`);
    }, 1000);
}

function stopTimer() {
    isTimerPaused = true;
    clearInterval(timerInterval);
}

function updateAttemptsDisplay() {
    $('#attempts').text(`Attempts: ${attemptCount}`);
}

function pauseTimer() {
    isTimerPaused = true;
    clearInterval(timerInterval);
    $('.card').off('click');
    
}

function resumeTimer() {
    isTimerPaused = false;
    startTimer();
    $('.card').on('click', function() {
        flipCard($(this));
        });
}

/*function resetTimer() {
    clearInterval(timerInterval);
    $("#timer").text("00:00");
}
*/

function resetVariables() {
    attemptCount = 1;
    matchCount = 0;
    seconds = 0;
    isGameActive = false;
    pauseResumeButton.text('Pause');
    isTimerPaused = false;
}
  
function clearElements() {
$('#game-info').hide();
$('#result-info').hide();
$('#game-board').empty();
$('#result-info').remove();
$('#new-game-btn').remove();
$('#pause-resume-btn').remove();
}

function setupEventHandlers() {
$('#game-setup').submit(handleGameSetupSubmit);
}
  
function restartGame() {
    resetVariables();
    clearElements();
    clearInterval(timerInterval);
    $('#game-setup').show();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}
  

  

