let playingField = document.querySelector('.playing-field');
let censorship = false;
let victoriesInRow = 0;
let timerStarted = false;
let startBtn = document.getElementById('start');
let clickedPair = [];

let names = [
  'abdul', 'pahom', 'peppa', 'pocik', 'ponasenkov', 'bob', 'valakas',
  'nyan', 'zapili', 'spider', 'ozon', 'sidor', 'roger', 'cartman',
  'povar', 'loh', 'beavis', 'creeper', 'chocolate', 'troll', 'nihuya'
];

let pairs = createPairs(names);
addCardsOnField(pairs);


document.addEventListener('click', (ev) => {
  if (ev.target.closest('.card')) {
    checkClickedPair(ev.target.closest('.card'));
  }
  if (ev.target.closest('#start')) {
    createNewGame();
  }
});


function createNewGame() {
  if (timerStarted) return;

  clickedPair = [];
  let cardsInGame = playingField.querySelectorAll('.card');
  cardsInGame.forEach(card => card.classList.remove('card--clicked', 'card--inactive'));
  addCardsOnField(pairs);
  // временно показать карты и скрыть по таймеру
  timerStarted = true;
  setTimeout(() => cardsInGame.forEach(card => card.classList.add('card--clicked')), 10);
  setTimeout(() => {
    cardsInGame.forEach(card => card.classList.remove('card--clicked'));
    timerStarted = false;
  }, 3000);

  // баг, если кликать во время подсказки. Заморозить на это время.



}


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

// создаёт одну html-карточку из переданного имени
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
  let name = censorship ? 'default' : card.dataset.name; 
  let audio = document.createElement('audio');
  audio.src = `sound/${name}.mp3`;
  audio.autoplay = true;
  audio.remove();
  return;
}

// проверки текущей карты
function checkClickedPair(currentCard) {
  // если в массиве первым элементом уже есть этот html-элемент, то не добавлять его
  if (currentCard === clickedPair[0]) {
    return;
  }

  currentCard.classList.add('card--clicked');
  clickedPair.push(currentCard);

  // если в массиве совпали 2 карты
  if (clickedPair.length === 2) {
    if (clickedPair[0].dataset.name === clickedPair[1].dataset.name) {
      clickedPair.forEach(card => card.classList.add('card--inactive'));
      clickedPair = [];
      createSound(currentCard);
    }
  // если кликнул 3 раза, но не было совпадения на предыдущем клике
  } else if (clickedPair.length > 2) {
    clickedPair.forEach(card => card.classList.remove('card--clicked'));
    clickedPair = [];
  }
  return;
}
