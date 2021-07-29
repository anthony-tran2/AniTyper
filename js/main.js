var $p = document.querySelector('p.inactive');
var $webPage = document.querySelector('body');
var currentCharacter = 0;

function gameLoading(event) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://animechan.vercel.app/api/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $anime = document.querySelector('h3.anime');
    var $character = document.querySelector('h3.character');
    $anime.textContent = `Anime: ${xhr.response.anime}`;
    $character.textContent = `Character: ${xhr.response.character}`;
    var wordList = xhr.response.quote.split(' ');
    for (var i = 0; i < wordList.length; i++) {
      var $newWord = document.createElement('span');
      $newWord.className = 'word';
      for (var letterIndex = 0; letterIndex < wordList[i].length; letterIndex++) {
        var $letter = document.createElement('span');
        $letter.className = 'letter';
        $letter.textContent = wordList[i][letterIndex];
        $newWord.appendChild($letter);
      }
      var $space = document.createElement('span');
      $space.className = 'letter';
      $space.textContent = ' ';
      $p.appendChild($newWord);
      $p.appendChild($space);
    }
    var $firstWord = document.querySelector('span.word');
    $firstWord.classList.toggle('active');
    var $firstCharacter = $firstWord.querySelector('span.letter');
    $firstCharacter.classList.toggle('current-character');
  });
  xhr.send();
}

gameLoading();

$webPage.addEventListener('keydown', function (event) {
  var $characters = document.querySelectorAll('span.letter');
  if (event.key === $characters[currentCharacter].textContent) {
    $characters[currentCharacter].classList.toggle('correct');
    $characters[currentCharacter].classList.toggle('current-character');
    currentCharacter++;
    $characters[currentCharacter].classList.toggle('current-character');
  } else if (event.key === 'Backspace') {
    $characters[currentCharacter].className = 'letter';
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
});

$webPage.addEventListener('keydown', function (event) {
  if (event.key === 'Tab') {
    $p.textContent = '';
    gameLoading();
  }
});

window.addEventListener('keydown', function (event) {
  if (event.key === ' ' && event.target === document.body) {
    event.preventDefault();
  } else if (event.key === 'Tab' && event.target === document.body) {
    event.preventDefault();
  }
});
