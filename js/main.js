const $p = document.querySelector('p.quote');
const $webPage = document.querySelector('body');
const $stats = document.querySelector('div.stats');
const $firstForm = document.querySelector('form.error-selection');
const $firstInput = document.querySelector('input[list]');
const $secondForm = document.querySelector('div[data-view="typing-game"] > div.row > form');
const $secondInput = document.querySelector('div[data-view="typing-game"] > div.row > form > input[list]');
const $animeInfoButton = document.querySelector('button.info');
const $backToGameButton = document.querySelector('button.back-to-game');
const $viewInfo = document.querySelector('div[data-view="anime-info"]');
const $viewTyping = document.querySelector('div[data-view="typing-game"]');
const $infoTitle = document.querySelector('p.font-weight-500');
const $infoImg = document.querySelector('img');
const $infoSynopsis = document.querySelector('p.synopsis');
const $loader = document.querySelector('div.loader').closest('div.row');
const $error = document.querySelector('div.error');
const $modalButton = document.querySelector('button.modal-button');
const $modal = document.querySelector('.modal-row');
let currentCharacter = 0;
let seconds = null;
let intervalId = null;

const animeSelection = () => {
  const $datalist = document.querySelector('#anime');
  for (let i = 1; i < data.animeAvailable.length; i++) {
    const $option = document.createElement('option');
    $option.setAttribute('value', data.animeAvailable[i]);
    $datalist.appendChild($option);
  }
};

const createQuote = words => {
  for (let i = 0; i < words.length; i++) {
    const $newWord = document.createElement('span');
    $newWord.className = 'word';
    for (let letterIndex = 0; letterIndex < words[i].length; letterIndex++) {
      const $letter = document.createElement('span');
      $letter.className = 'letter';
      $letter.textContent = words[i][letterIndex];
      $newWord.appendChild($letter);
    }
    const $space = document.createElement('span');
    $space.className = 'letter';
    $space.textContent = ' ';
    $p.appendChild($newWord);
    $p.appendChild($space);
  }
  if (data.view === 'anime-info' && document.querySelectorAll('span.letter').length === data.previousCharacterClassesCounter) {
    $stats.classList.toggle('hidden');
    document.querySelector('p.accuracy').textContent = data.previousAccuracy;
    document.querySelector('p.wpm').textContent = data.previousWPM;
    const $characters = document.querySelectorAll('span.letter');
    for (let c = 0; c < $characters.length; c++) {
      $characters[c].className = data.previousCharacterClasses[c];
    }
  } else {
    const $firstWord = document.querySelector('span.word');
    $firstWord.className = 'word active';
    const $firstCharacter = $firstWord.querySelector('span.letter');
    $firstCharacter.className = 'letter current-character';
  }
};

const gameLoading = event => {
  if (data.view === 'typing-game') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://animechan.vercel.app/api/random');
    xhr.responseType = 'json';
    xhr.addEventListener('load', event => {
      const $anime = document.querySelector('h3.anime');
      const $character = document.querySelector('h3.character');
      $anime.textContent = `Anime: ${xhr.response.anime}`;
      $character.textContent = `Character: ${xhr.response.character}`;
      const wordList = xhr.response.quote.split(' ');
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
    const $anime = document.querySelector('h3.anime');
    const $character = document.querySelector('h3.character');
    $anime.textContent = 'Anime: ' + data.quoteData.anime;
    $character.textContent = 'Character: ' + data.quoteData.character;
    const wordList = data.quoteData.quote.split(' ');
    createQuote(wordList);
    $viewInfo.classList.toggle('hidden');
  }
  $loader.classList.toggle('hidden');
  if (data.firstTime === true) $modal.classList.toggle('hidden');
};

const clearPage = () => {
  $p.textContent = '';
  currentCharacter = 0;
  clearInterval(intervalId);
  seconds = null;
  intervalId = null;
  $stats.className = 'row stats margin-bottom-stats font-size-36px justify-center hidden';
};

const timer = () => {
  const $characters = document.querySelectorAll('span.letter');
  seconds += 1;
  if (currentCharacter + 1 === $characters.length) {
    clearInterval(intervalId);
    $stats.classList.toggle('hidden');
    const $accuracy = document.querySelector('p.accuracy');
    const $wpm = document.querySelector('p.wpm');
    const $correctCharacters = document.querySelectorAll('span.correct');
    const $incorrectCharacters = document.querySelectorAll('span.incorrect');
    const minutes = seconds / 60;
    const grossWPM = (($characters.length / 5) - $incorrectCharacters.length) / minutes;
    $accuracy.textContent = `${Math.round((($correctCharacters.length + 1) / $characters.length) * 100)}%`;
    if (grossWPM < 0) {
      $wpm.textContent = 0;
    } else {
      $wpm.textContent = `${Math.round(grossWPM)}`;
    }
  }
};

const selectedGenration = anime => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://animechan.vercel.app/api/quotes/anime?title=${encodeURIComponent(anime)}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', event => {
    if (xhr.response.error === 'No related quotes found!') {
      $error.classList.toggle('hidden');
      $firstInput.value = data.selectedAnime;
    } else {
      const selectedQuoteList = xhr.response.length;
      const randomSelectedQuote = xhr.response[Math.floor(Math.random() * selectedQuoteList)];
      const $anime = document.querySelector('h3.anime');
      const $character = document.querySelector('h3.character');
      $secondInput.value = randomSelectedQuote.anime;
      $anime.textContent = `Anime: ${randomSelectedQuote.anime}`;
      $character.textContent = `Character: ${randomSelectedQuote.character}`;
      const wordList = randomSelectedQuote.quote.split(' ');
      createQuote(wordList);
      data.quoteData.anime = randomSelectedQuote.anime;
      data.quoteData.character = randomSelectedQuote.character;
      data.quoteData.quote = randomSelectedQuote.quote;
      $viewTyping.classList.toggle('hidden');
    }
    $loader.classList.toggle('hidden');
  });
  xhr.send();
};

window.addEventListener('load', event => {
  const $networkError = document.querySelector('div.network-error');
  const updateOnlineStatus = event => {
    if (navigator.onLine === true) {
      $loader.className = 'row justify-center margin-top-selection';
      $networkError.className = 'row justify-center network-error hidden';
      if (data.animeAvailable === null) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://animechan.vercel.app/api/available/anime');
        xhr.responseType = 'json';
        xhr.addEventListener('load', function () {
          data.animeAvailable = xhr.response.sort();
          animeSelection();
          if (!data.selectedAnime) gameLoading(); else selectedGenration(data.selectedAnime);
        });
        xhr.send();
      } else {
        animeSelection();
        if (!data.selectedAnime) gameLoading(); else selectedGenration(data.selectedAnime);
      }
    } else {
      $loader.className = 'row justify-center margin-top-selection hidden';
      $viewTyping.className = 'container hidden';
      $viewInfo.className = 'container hidden';
      $error.className = 'container error hidden';
      $networkError.classList.toggle('hidden');
    }
  };
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

$p.addEventListener('click', () => {
  document.querySelector('#gameInput').focus();
});

document.querySelector('#gameInput').addEventListener('keydown', e => {
  e.preventDefault();
});

document.querySelector('.no-styling').addEventListener('click', () => {
  clearPage();
  $loader.className = 'row justify-center margin-top-selection';
  $viewTyping.className = 'container hidden';
  $viewInfo.className = 'container hidden';
  data.view = 'typing-game';
  if (!data.selectedAnime) {
    gameLoading();
  } else {
    selectedGenration(data.selectedAnime);
  }
});

$webPage.addEventListener('keydown', event => {
  const $characters = document.querySelectorAll('span.letter');
  if ($characters.length !== currentCharacter + 1 && event.target !== $secondInput && event.target !== $firstInput) {
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
      const $currentWord = $characters[currentCharacter].closest('span.word');
      $currentWord.className = 'word active';
    }
  }
  if (event.key === 'Tab') {
    clearPage();
    $loader.className = 'row justify-center margin-top-selection';
    $viewTyping.className = 'container hidden';
    $viewInfo.className = 'container hidden';
    data.view = 'typing-game';
    if (!data.selectedAnime) {
      gameLoading();
    } else {
      selectedGenration(data.selectedAnime);
    }
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

$secondForm.addEventListener('submit', event => {
  event.preventDefault();
  $viewTyping.classList.toggle('hidden');
  $loader.classList.toggle('hidden');
  clearPage();
  const currentSelectedAnime = $secondInput.value;
  data.selectedAnime = $secondInput.value;
  if (currentSelectedAnime !== '') {
    selectedGenration(currentSelectedAnime);
    $secondInput.value = '';
  } else {
    clearPage();
    $viewTyping.className = 'container hidden';
    $viewInfo.className = 'container hidden';
    data.view = 'typing-game';
    gameLoading();
  }
});

$firstForm.addEventListener('submit', event => {
  event.preventDefault();
  $loader.classList.toggle('hidden');
  $error.classList.toggle('hidden');
  clearPage();
  const currentSelectedAnime = $firstInput.value;
  data.selectedAnime = $firstInput.value;
  if (currentSelectedAnime !== '') {
    selectedGenration(currentSelectedAnime);
    $secondInput.value = '';
  } else {
    clearPage();
    $viewTyping.className = 'container hidden';
    $viewInfo.className = 'container hidden';
    data.view = 'typing-game';
    gameLoading();
  }
});

$animeInfoButton.addEventListener('click', () => {
  $viewTyping.classList.toggle('hidden');
  $loader.classList.toggle('hidden');
  data.previousCharacterClassesCounter = 0;
  data.previousCharacterClasses = [];
  const $characters = document.querySelectorAll('span.letter');
  for (let i = 0; i < $characters.length; i++) {
    if ($characters[i].className !== 'letter') {
      data.previousCharacterClasses.push($characters[i].className);
      data.previousCharacterClassesCounter++;
    }
  }
  data.previousAccuracy = document.querySelector('p.accuracy').textContent;
  data.previousWPM = document.querySelector('p.wpm').textContent;
  data.view = 'anime-info';
  const anime = data.quoteData.anime;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(anime)}&page=1`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', event => {
    for (let i = 0; i < xhr.response.results.length; i++) {
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

$backToGameButton.addEventListener('click', () => {
  $viewInfo.classList.toggle('hidden');
  $viewTyping.classList.toggle('hidden');
  data.view = 'typing-game';
});

$modalButton.addEventListener('click', event => {
  $modal.classList.toggle('hidden');
  data.firstTime = false;
});
