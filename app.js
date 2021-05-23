let playingField = document.querySelector('.playing-field');
let namesList = [
  'abdul', 'pahom', 'peppa', 'pocik', 'ponasenkov', 'bob', 'valakas',
  'nyan', 'zapili', 'spider', 'ozon', 'sidor', 'roger', 'cartman',
  'povar', 'loh', 'beavis', 'creeper', 'chocolate', 'troll', 'nihuya'
];

let clickedPair = [];


btn.addEventListener('click', () => {
  let music = document.createElement('audio');
music.src = 'music/minecraft.mp3';
music.autoplay = true;
document.body.append(music);
})

// создать пары-карточки из списка имён, перемешать и добавить на игровое поле
addCardsOnField(createPairs(namesList));

// обработчики событий
document.addEventListener('click', (ev) => {
  if (ev.target.closest('.card-wrapper')) {
    let currentCard = ev.target.closest('.card');

    if (currentCard.classList.contains('card--inactive')) {
      return;
    }

    currentCard.classList.add('card--clicked');
    if (currentCard !== clickedPair[0]) {
      clickedPair.push(currentCard);
    }
    

    if (clickedPair.length === 2) {
      if (clickedPair[0].dataset.name === clickedPair[1].dataset.name) {
        // играть музыку
        let audio = document.createElement('audio');
        audio.src = `sound/${clickedPair[0].dataset.name}.mp3`;
        audio.autoplay = true;
        clickedPair[0].append(audio);
        clickedPair[0].classList.add('card--inactive');
        clickedPair[1].classList.add('card--inactive');
        clickedPair = [];
        return;
      }
    }
    if (clickedPair.length > 2) {
      clickedPair.forEach(card => card.classList.remove('card--clicked'));
      clickedPair = [];
    }
  }
})




// функция создаёт карточку
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

// функция для перемешивания карт: максимум не включается, минимум включается
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// функция возвращает массив карточек-пар для игры
function createPairs(namesList) {
  let cardsPairs = [];
  namesList.forEach(name => {
    cardsPairs.push(createCard(name)); 
    cardsPairs.push(createCard(name));
  });
  return cardsPairs;
}

// функция перемешивает карточки и добавляет их на игровое поле
function addCardsOnField(cards) {
  shuffle(cards).forEach(i => playingField.append(i));
}

function createSound(target) {
  
}