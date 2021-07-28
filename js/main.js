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
      var $newWord = document.createElement('word');
      for (var wordIndex = 0; wordIndex < wordList[i].length; wordIndex++) {
        var $letter = document.createElement('letter');
        $letter.textContent = wordList[i][wordIndex];
        $newWord.appendChild($letter);
      }
      var $space = document.createElement('letter');
      $space.textContent = ' ';
      $p.appendChild($newWord);
      $p.appendChild($space);
      var $firstWord = document.querySelector('word');
      $firstWord.className = ('active');
      var $firstCharacter = $firstWord.querySelector('letter');
      $firstCharacter.className = ('current-character');
    }
  });
  xhr.send();
}

gameLoading();

$webPage.addEventListener('keydown', function (event) {
  var $characters = document.querySelectorAll('letter');
  if (event.key === $characters[currentCharacter].textContent) {
    $characters[currentCharacter].className = 'correct';
    currentCharacter++;
    $characters[currentCharacter].className = 'current-character';
  } else if (event.key === 'Backspace') {
    $characters[currentCharacter].className = '';
    currentCharacter--;
    $characters[currentCharacter].className = 'current-character';
  } else if (event.key.length < 2) {
    $characters[currentCharacter].className = 'incorrect';
    currentCharacter++;
    $characters[currentCharacter].className = 'current-character';
  }
  if ($characters[currentCharacter].textContent !== ' ') {
    var $currentWord = $characters[currentCharacter].closest('word');
    $currentWord.className = 'active';
  }
});
