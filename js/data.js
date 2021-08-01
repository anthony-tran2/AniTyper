/* exported data */

var data = {
  view: 'typing-game',
  animeAvailable: null,
  quoteData: {
    anime: null,
    character: null,
    quote: null
  }
};

var quoteTemp = {
  anime: 'Junjou Romantica',
  character: 'Akihiko Usami',
  quote: 'When you fight hard and fail, the regret is easier to get past than the regret of not trying.'
};

var previousDataJSON = localStorage.getItem('typing-game-local-storage');
if (previousDataJSON !== null) {
  var oldData = JSON.parse(previousDataJSON);
  if (oldData.view === 'anime-info') { data = oldData; }
}

function storeData(event) {
  if (data.view === 'anime-info') {
    data.quoteData.anime = document.querySelector('h3.anime').textContent;
    data.quoteData.character = document.querySelector('h3.character').textContent;
    data.quoteData.quote = document.querySelector('p.quote').textContent;
  } else if (data.view === 'typing-game') {
    data.quoteData.anime = null;
    data.quoteData.character = null;
    data.quoteData.quote = null;
  }
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('typing-game-local-storage', dataJSON);
}

window.addEventListener('beforeunload', storeData);
