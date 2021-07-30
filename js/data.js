/* exported data */

var data = {
  view: 'typing-game',
  animeAvailable: null
};

// var quoteData = {
//   anime: 'Junjou Romantica',
//   character: 'Akihiko Usami',
//   quote: 'When you fight hard and fail, the regret is easier to get past than the regret of not trying.'
// };

var previousDataJSON = localStorage.getItem('typing-game-local-storage');
if (previousDataJSON !== null) {
  var oldData = JSON.parse(previousDataJSON);
  data = oldData;
}

function storeData(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('typing-game-local-storage', dataJSON);
}

window.addEventListener('beforeunload', storeData);
