var $p = document.querySelector('p.inactive');

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
      var $space = document.createElement('space');
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
