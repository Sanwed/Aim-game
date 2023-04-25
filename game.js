const INTERVAL_TIMEOUT = 1000;
const MIN_CIRCLE_SIZE = 10;
const MAX_CIRCLE_SIZE = 60;
const CIRCLE_COLORS = [
  'linear-gradient(90deg, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)',
  'linear-gradient(90deg, #de0c00 0%, #d62f24 47%, #ff6f65 100%)',
  'linear-gradient(90deg, #a0ff78 0%, #3eff34 47%, #2bff00 100%)',
  'linear-gradient(90deg, #ffe653 0%, #ffe53f 47%, #ffff00 100%)',
  'linear-gradient(90deg, #da83ff 0%, #ff24e5 47%, #ad00ff 100%)'
];
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

const screens = document.querySelectorAll('.screen');
const menuScreen = document.querySelector('#menu-screen');
const settingsScreen = document.querySelector('#level-settings-screen');
const startBtn = document.querySelector('#start');
const timeList = document.querySelector('#time-list');
const timerBlock = document.querySelector('.timer');
const timer = document.querySelector('#time');
const board = document.querySelector('#board');
const modeInput = document.querySelector('#no-misses');
const speedRange = document.querySelector('.range-speed');
const speedValue = document.querySelector('.range-speed-value');

const leaderboardList = document.querySelector('.leaderboard__list');
const nameInput = document.querySelector('#name');

let time = 0;
let score = 0;
let missClicks = 0;

let circleDisappearTime = 1000;
speedValue.textContent = speedRange.value;

speedRange.addEventListener('change', () => {
  circleDisappearTime = speedRange.value;
  speedValue.textContent = speedRange.value;
})

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

const createRandomCircle = () => {
  const circle = document.createElement('div');
  const size = getRandomNumber(MIN_CIRCLE_SIZE, MAX_CIRCLE_SIZE);
  const {width, height} = board.getBoundingClientRect();
  const x = getRandomNumber(size, width - size);
  const y = getRandomNumber(size, height - size);

  circle.classList.add('circle');
  circle.style.top = `${x}px`;
  circle.style.left = `${y}px`;
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.background = getRandomArrayElement(CIRCLE_COLORS);

  board.append(circle);
};

const removeCircle = () => {
  const circle = document.querySelector('.circle');
  circle.remove();
}

const decreaseTime = () => {
  if (time === 0) {
    finishGame();
  } else {
    let current = --time;
    if (current < 10) {
      current = `0${current}`;
    }
    timer.innerText = `00:${current}`;
  }
};

const handleMissClick = () => {
  removeCircle();
  createRandomCircle();
  missClicks++;

  if (modeInput.checked && missClicks > 0) {
    finishGame();
  }
}

let intervalId;
let circleRemove;
const startGame = () => {
  board.innerHTML = '';
  timerBlock.classList.remove('hidden');
  score = 0;
  missClicks = 0;

  createRandomCircle();
  circleRemove = setInterval(handleMissClick, circleDisappearTime);

  if (time === 60) {
    timer.innerText = `01:00`;

  } else {
    timer.innerText = `00:${time}`;
  }

  intervalId = setInterval(decreaseTime, INTERVAL_TIMEOUT);
};

const scores = [];

const addToLeaderboard = () => {
  leaderboardList.innerHTML = '';

  scores.push({
    name: nameInput.value,
    points: score
  });

  const sortedScores = scores.sort((a, b) => b.points - a.points);

  sortedScores.forEach((score) => {
    const leaderboardItem = document.createElement('li');
    leaderboardItem.classList.add('leaderboard__item');
    leaderboardItem.innerHTML = `<span class="leaderboard__name">${score.name}</span>`
    leaderboardList.append(leaderboardItem);
  })
}

const finishGame = () => {
  if (modeInput.checked && missClicks === 0) {
    addToLeaderboard();
    nameInput.value = '';
  }

  timerBlock.classList.add('hidden');
  board.innerHTML = `<h1>Счёт: <span class="primary">${score}</span></h1>
                     <h1>Промахи: <span class="primary">${missClicks}</span></h1`;

  clearInterval(intervalId);
  clearInterval(circleRemove);
  setTimeout(() => {
    screens.forEach((screen) => screen.classList.remove('up'));
  }, 3000);
};

startBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  menuScreen.classList.add('up');
});

const isUsernameCorrect = () => nameInput.value !== '' &&
  nameInput.value.length >= MIN_USERNAME_LENGTH &&
  nameInput.value.length <= MAX_USERNAME_LENGTH &&
  !scores.some(({name}) => name === nameInput.value);

timeList.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('time-btn')) {
    if (isUsernameCorrect()) {
      time = parseInt(evt.target.dataset.time);
      settingsScreen.classList.add('up');
      startGame();
    } else {
      // errorMessage.classList.remove('hidden');

      // setTimeout(() => {
      //   errorMessage.classList.add('hidden');
      // }, 3000);
    }
  }
});

board.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('circle')) {
    clearInterval(circleRemove);
    circleRemove = setInterval(handleMissClick, circleDisappearTime);
    score++;
    removeCircle();
    createRandomCircle();
  } else {
    missClicks++;
  }
});