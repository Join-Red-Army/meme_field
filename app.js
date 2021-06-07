let playingField = document.querySelector('.playing-field');
let startBtn = document.getElementById('start');
let clickedPair = [];

let gameSettings = {
  isFrozen: false,             // true - клики по карточкам не работают
  isCensored: false,           // true - только цензурные звуки
  isTimerStarted: false,       // true - заблокировать ряд действий, пока таймер работает
  remainingСardsOnField: null, // сколько осталось неугаданных карт в игре
  totalClicks: 0,              // сколько кликов сделал пользователь за игру
  victoriesInRow: 0,           // победы подряд
  gameStartTime: Date.now(),
  gameEndTime: null, 
};


let names = [                  // наименование изображений, из которых будут созданы карты
  'abdul', 'pahom', 'peppa', 'pocik', 'ponasenkov', 'bob', 'valakas',
  'nyan', 'zapili', 'spider', 'ozon', 'sidor', 'roger', 'cartman',
  'povar', 'loh', 'beavis', 'creeper', 'chocolate', 'troll', 'nihuya'
];

let pairs = createPairs(names);
addCardsOnField(pairs);
gameSettings.isFrozen = true;   // разморозится, когда пользователь сам запустит игру


// обработчики событий
document.addEventListener('click', (ev) => {
  if (ev.target.closest('.card')) {
    if (gameSettings.isFrozen) return;
    checkClickedPair(ev.target.closest('.card'));
  }
  if (ev.target.closest('#start')) {
    createNewGame();
  }
});


function createNewGame() {
  // начать новую игру можно только раз в 5 секунд
  if (gameSettings.isTimerStarted) return;
  // обнуление игровых данных
  gameSettings.remainingСardsOnField = playingField
    .getElementsByClassName('card');
  clickedPair = [];
  gameSettings.totalClicks = 0;

  let cardsInGame = playingField.querySelectorAll('.card');
  cardsInGame.forEach(card => card.classList.remove('card--clicked', 'card--inactive'));
  addCardsOnField(pairs);
  
  // временно показать карты и скрыть по таймеру
  gameSettings.isTimerStarted = true;
  setTimeout(() => {
    cardsInGame.forEach(card => card.classList.add('card--clicked'));
    gameSettings.isFrozen = true;
    }, 10);
  setTimeout(() => {
    cardsInGame.forEach(card => card.classList.remove('card--clicked'));
    gameSettings.isFrozen = false;
    gameSettings.isTimerStarted = false;
  }, 5010);
  // создать переменную Состояние, куда записывать цензуру, таймеры и что-то ещё.
  // старт таймер поменять на заморозку
}


// запуск фоновой музыки
// btn.addEventListener('click', () => {
//   let music = document.createElement('audio');
// music.src = 'music/minecraft.mp3';
// music.autoplay = true;
// document.body.append(music);
// })


// создаёт массив карточек-пар из списка имён
function createPairs(namesList) {
  let cardsPairs = [];
  namesList.forEach(name => {
    cardsPairs.push(createCard(name)); 
    cardsPairs.push(createCard(name));
  });
  return cardsPairs;
}


// создаёт одну html-карточку из переданного имени файла
function createCard(name) {
  let cardWrapper = document.createElement('div');
  cardWrapper.innerHTML = 
  `<div class="card">
      <div class="card__front"></div>
      <div class="card__back">
          <img class="card__img" src="" alt="">
      </div>
  </div>`
  cardWrapper.querySelector('img').src = `img/${name}.jpg`;
  cardWrapper.classList.add('card-wrapper');
  cardWrapper.dataset.name = name;
  cardWrapper.querySelector('.card').dataset.name = name;
  return cardWrapper;
}

// перемешивает массив с карточками и добавляет их на игровое поле
function addCardsOnField(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach(i => playingField.append(i));
}


// создаёт звуковой эффект при найденном совпадении
function createSound(card) {
  let name = gameSettings.isCensored ? 'default' : card.dataset.name; 
  let audio = document.createElement('audio');
  audio.src = `sound/${name}.mp3`;
  audio.autoplay = true;
  audio.remove();
  return;
}


// проверки текущей карты
function checkClickedPair(currentCard) {
  // если в массиве уже есть этот html-элемент, то не добавлять его
  if (currentCard === clickedPair[0]) {
    return;
  }

  currentCard.classList.add('card--clicked');
  clickedPair.push(currentCard);

  // если в массиве совпали 2 карты
  if (clickedPair.length === 2) {
    if (clickedPair[0].dataset.name === clickedPair[1].dataset.name) {
      createSound(currentCard);
      gameSettings.isFrozen = true;

      setTimeout(() => {           // удалить совпавшую пару карт
        clickedPair.forEach(card => card.remove());
        clickedPair = [];
        gameSettings.isFrozen = false;
        if (gameSettings.remainingСardsOnField.length == 0) {
          // окончить игру
          // мб checkEndGame?
        }
      }, 500);
    }

  // если кликнул 3 раза, но не было совпадения на предыдущем клике
  } else if (clickedPair.length > 2) {
    clickedPair.forEach(card => card.classList.remove('card--clicked'));
    clickedPair = [];
  }

  return;
}
