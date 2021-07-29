/* exported data */

var data = {
  view: 'typing-game',
  selectedAnime: ''
};

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
