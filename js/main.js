var $p = document.querySelector('p.quote');
var $webPage = document.querySelector('body');
var $stats = document.querySelector('div.stats');
var $firstForm = document.querySelector('form');
var $secondForm = document.querySelector('div[data-view="typing-game"] > div.row > form');
var $firstInput = document.querySelector('input[list]');
var $secondInput = document.querySelector('div[data-view="typing-game"] > div.row > form > input[list]');
var $animeInfoButton = document.querySelector('button.info');
var $backToGameButton = document.querySelector('button.back-to-game');
var $viewInfo = document.querySelector('div[data-view="anime-info"]');
var $viewTyping = document.querySelector('div[data-view="typing-game"]');
var $infoTitle = document.querySelector('p.font-weight-500');
var $infoImg = document.querySelector('img');
var $infoSynopsis = document.querySelector('p.synopsis');
var $loader = document.querySelector('div.loader').closest('div.row');
var $error = document.querySelector('div.error');
var $networkError = document.querySelector('div.network-error');
var $modalButton = document.querySelector('button.modal-button');
var $modal = document.querySelector('.modal-row');
var currentCharacter = 0;
var seconds = null;
var intervalId = null;

if (data.animeAvailable === null) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://animechan.vercel.app/api/available/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.animeAvailable = xhr.response.sort();
  });
  xhr.send();
}

function animeSelection() {
  var $datalist = document.querySelector('#anime');
  for (var animesIndex = 1; animesIndex < data.animeAvailable.length; animesIndex++) {
    var $option = document.createElement('option');
    $option.setAttribute('value', data.animeAvailable[animesIndex]);
    $datalist.appendChild($option);
  }
}

function createQuote(words) {
  for (var i = 0; i < words.length; i++) {
    var $newWord = document.createElement('span');
    $newWord.className = 'word';
    for (var letterIndex = 0; letterIndex < words[i].length; letterIndex++) {
      var $letter = document.createElement('span');
      $letter.className = 'letter';
      $letter.textContent = words[i][letterIndex];
      $newWord.appendChild($letter);
    }
    var $space = document.createElement('span');
    $space.className = 'letter';
    $space.textContent = ' ';
    $p.appendChild($newWord);
    $p.appendChild($space);
  }
  if (data.view === 'anime-info' && document.querySelectorAll('span.letter').length === data.previousCharacterClassesCounter) {
    $stats.classList.toggle('hidden');
    document.querySelector('p.accuracy').textContent = data.previousAccuracy;
    document.querySelector('p.wpm').textContent = data.previousWPM;
    var $characters = document.querySelectorAll('span.letter');
    for (var c = 0; c < $characters.length; c++) {
      $characters[c].className = data.previousCharacterClasses[c];
    }
  } else {
    var $firstWord = document.querySelector('span.word');
    $firstWord.classList.toggle('active');
    var $firstCharacter = $firstWord.querySelector('span.letter');
    $firstCharacter.classList.toggle('current-character');
  }
}

function gameLoading(event) {
  if (data.view === 'typing-game') {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://animechan.vercel.app/api/random');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function (event) {
      var $anime = document.querySelector('h3.anime');
      var $character = document.querySelector('h3.character');
      $anime.textContent = `Anime: ${xhr.response.anime}`;
      $character.textContent = `Character: ${xhr.response.character}`;
      var wordList = xhr.response.quote.split(' ');
      createQuote(wordList);
      data.quoteData.anime = xhr.response.anime;
      data.quoteData.character = xhr.response.character;
      data.quoteData.quote = xhr.response.quote;
      $viewTyping.classList.toggle('hidden');
    });
    xhr.send();
  } else {
    $infoTitle.textContent = data.animeInfo.title;
    $infoImg.setAttribute('src', data.animeInfo.imgURL);
    $infoSynopsis.textContent = data.animeInfo.synopsis;
    var $anime = document.querySelector('h3.anime');
    var $character = document.querySelector('h3.character');
    $anime.textContent = 'Anime: ' + data.quoteData.anime;
    $character.textContent = 'Character: ' + data.quoteData.character;
    var wordList = data.quoteData.quote.split(' ');
    createQuote(wordList);
    $viewInfo.classList.toggle('hidden');
  }
  $loader.classList.toggle('hidden');
  if (data.firstTime === true) { $modal.classList.toggle('hidden'); }
}

function clearPage() {
  $p.textContent = '';
  currentCharacter = 0;
  clearInterval(intervalId);
  seconds = null;
  intervalId = null;
  $stats.className = 'row stats margin-bottom-stats font-size-36px justify-center hidden';
}

function timer() {
  var $characters = document.querySelectorAll('span.letter');
  seconds += 1;
  if (currentCharacter + 1 === $characters.length) {
    clearInterval(intervalId);
    $stats.classList.toggle('hidden');
    var $accuracy = document.querySelector('p.accuracy');
    var $wpm = document.querySelector('p.wpm');
    var $correctCharacters = document.querySelectorAll('span.correct');
    var $incorrectCharacters = document.querySelectorAll('span.incorrect');
    var minutes = seconds / 60;
    var grossWPM = (($characters.length / 5) - $incorrectCharacters.length) / minutes;
    $accuracy.textContent = `${Math.round((($correctCharacters.length + 1) / $characters.length) * 100)}%`;
    $wpm.textContent = `${Math.round(grossWPM)}`;
  }
}

window.addEventListener('load', function (event) {
  function updateOnlineStatus(event) {
    if (navigator.onLine === true) {
      $loader.className = 'row justify-center margin-top-selection';
      $networkError.className = 'row justify-center network-error hidden';
      animeSelection();
      gameLoading();
    } else {
      $loader.className = 'row justify-center margin-top-selection hidden';
      $viewTyping.className = 'container hidden';
      $viewInfo.className = 'container hidden';
      $error.className = 'container error hidden';
      $networkError.classList.toggle('hidden');
    }
  }

  updateOnlineStatus();

  window.addEventListener('online', updateOnlineStatus);

  window.addEventListener('offline', updateOnlineStatus);
});

$webPage.addEventListener('keydown', function (event) {
  var $characters = document.querySelectorAll('span.letter');
  if ($characters.length !== currentCharacter + 1 && event.target !== $secondInput) {
    if (event.key === $characters[currentCharacter].textContent) {
      $characters[currentCharacter].classList.toggle('correct');
      $characters[currentCharacter].classList.toggle('current-character');
      currentCharacter++;
      $characters[currentCharacter].classList.toggle('current-character');
    } else if (event.key === 'Backspace' && (currentCharacter + 1 !== $characters.length && currentCharacter !== 0)) {
      $characters[currentCharacter].className = 'letter';
      if ($characters[currentCharacter].textContent !== ' ') {
        $characters[currentCharacter].closest('span.word').className = 'word';
      }
      currentCharacter--;
      $characters[currentCharacter].className = 'letter current-character';
    } else if (event.key.length < 2) {
      $characters[currentCharacter].classList.toggle('incorrect');
      $characters[currentCharacter].classList.toggle('current-character');
      currentCharacter++;
      $characters[currentCharacter].classList.toggle('current-character');
    }
    if ($characters[currentCharacter].textContent !== ' ') {
      var $currentWord = $characters[currentCharacter].closest('span.word');
      $currentWord.className = 'word active';
    }
  }
  if (event.key === 'Tab') {
    clearPage();
    $loader.className = 'row justify-center margin-top-selection';
    $viewTyping.className = 'container hidden';
    $viewInfo.className = 'container hidden';
    data.view = 'typing-game';
    gameLoading();
  }
  if (event.key === ' ' && event.target === document.body) {
    event.preventDefault();
  } else if (event.key === 'Tab' && event.target === document.body) {
    event.preventDefault();
  }
  if (currentCharacter === 1) {
    intervalId = setInterval(timer, 1000);
  }
});

$secondForm.addEventListener('submit', function (event) {
  event.preventDefault();
  $viewTyping.classList.toggle('hidden');
  $loader.classList.toggle('hidden');
  clearPage();
  var xhr = new XMLHttpRequest();
  var selectedAnime = $secondInput.value;
  xhr.open('GET', `https://animechan.vercel.app/api/quotes/anime?title=${encodeURIComponent(selectedAnime)}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.response.error === 'No related quotes found!') {
      $error.classList.toggle('hidden');
    } else {
      var selectedQuoteList = xhr.response.length;
      var randomSelectedQuote = xhr.response[Math.floor(Math.random() * selectedQuoteList)];
      var $anime = document.querySelector('h3.anime');
      var $character = document.querySelector('h3.character');
      $anime.textContent = `Anime: ${randomSelectedQuote.anime}`;
      $character.textContent = `Character: ${randomSelectedQuote.character}`;
      var wordList = randomSelectedQuote.quote.split(' ');
      createQuote(wordList);
      data.quoteData.anime = randomSelectedQuote.anime;
      data.quoteData.character = randomSelectedQuote.character;
      data.quoteData.quote = randomSelectedQuote.quote;
      $viewTyping.classList.toggle('hidden');
    }
    $loader.classList.toggle('hidden');
  });
  xhr.send();
  $secondInput.value = '';
});

$firstForm.addEventListener('submit', function (event) {
  $loader.classList.toggle('hidden');
  $error.classList.toggle('hidden');
  event.preventDefault();
  clearPage();
  var xhr = new XMLHttpRequest();
  var selectedAnime = $firstInput.value;
  xhr.open('GET', `https://animechan.vercel.app/api/quotes/anime?title=${encodeURIComponent(selectedAnime)}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.response.error === 'No related quotes found!') {
      $error.classList.toggle('hidden');
      $firstInput.value = '';
    } else {
      var selectedQuoteList = xhr.response.length;
      var randomSelectedQuote = xhr.response[Math.floor(Math.random() * selectedQuoteList)];
      var $anime = document.querySelector('h3.anime');
      var $character = document.querySelector('h3.character');
      $anime.textContent = `Anime: ${randomSelectedQuote.anime}`;
      $character.textContent = `Character: ${randomSelectedQuote.character}`;
      var wordList = randomSelectedQuote.quote.split(' ');
      createQuote(wordList);
      data.quoteData.anime = randomSelectedQuote.anime;
      data.quoteData.character = randomSelectedQuote.character;
      data.quoteData.quote = randomSelectedQuote.quote;
      $viewTyping.classList.toggle('hidden');
    }
    $loader.classList.toggle('hidden');
  });
  xhr.send();
  $firstInput.value = '';
});

$animeInfoButton.addEventListener('click', function () {
  $viewTyping.classList.toggle('hidden');
  $loader.classList.toggle('hidden');
  data.previousCharacterClassesCounter = 0;
  data.previousCharacterClasses = [];
  var $characters = document.querySelectorAll('span.letter');
  for (var i = 0; i < $characters.length; i++) {
    if ($characters[i].className !== 'letter') {
      data.previousCharacterClasses.push($characters[i].className);
      data.previousCharacterClassesCounter++;
    }
  }
  data.previousAccuracy = document.querySelector('p.accuracy').textContent;
  data.previousWPM = document.querySelector('p.wpm').textContent;
  data.view = 'anime-info';
  var anime = data.quoteData.anime;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(anime)}&page=1`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    for (var i = 0; i < xhr.response.results.length; i++) {
      if (xhr.response.results[i].title === anime) {
        data.animeInfo.title = xhr.response.results[i].title;
        data.animeInfo.imgURL = xhr.response.results[i].image_url;
        data.animeInfo.synopsis = xhr.response.results[i].synopsis;
        break;
      } else {
        data.animeInfo.title = xhr.response.results[0].title;
        data.animeInfo.imgURL = xhr.response.results[0].image_url;
        data.animeInfo.synopsis = xhr.response.results[0].synopsis;
      }
    }
    $infoTitle.textContent = data.animeInfo.title;
    $infoImg.setAttribute('src', data.animeInfo.imgURL);
    $infoSynopsis.textContent = data.animeInfo.synopsis;
    $viewInfo.classList.toggle('hidden');
    $loader.classList.toggle('hidden');
  });
  xhr.send();
});

$backToGameButton.addEventListener('click', function () {
  $viewInfo.classList.toggle('hidden');
  $viewTyping.classList.toggle('hidden');
  data.view = 'typing-game';
});

$modalButton.addEventListener('click', function (event) {
  $modal.classList.toggle('hidden');
  data.firstTime = false;
});
