/* exported data */

var data = {
  view: 'typing-game',
  animeAvailable: null,
  firstTime: true,
  quoteData: {
    anime: null,
    character: null,
    quote: null
  },
  animeInfo: {
    title: null,
    imgURL: null,
    synopsis: null
  },
  previousCharacterClasses: [],
  previousCharacterClassesCounter: 0,
  previousAccuracy: null,
  previousWPM: null
};

var previousDataJSON = localStorage.getItem('typing-game-local-storage');
if (previousDataJSON !== null) {
  var oldData = JSON.parse(previousDataJSON);
  if (oldData.view === 'anime-info') { data = oldData; } else {
    data.view = oldData.view;
    data.animeAvailable = oldData.animeAvailable;
    data.firstTime = oldData.firstTime;
  }
}

function storeData(event) {
  if (data.view === 'typing-game') {
    data.quoteData.anime = null;
    data.quoteData.character = null;
    data.quoteData.quote = null;
    data.animeInfo.title = null;
    data.animeInfo.imgURL = null;
    data.animeInfo.title = null;
    data.previousWords = null;
    data.previousSpaces = null;
    data.previousAccuracy = null;
    data.previousWPM = null;
  }
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('typing-game-local-storage', dataJSON);
}

window.addEventListener('beforeunload', storeData);
