export const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

export const isMorePoints = (nameValue, score, scores) => scores.some(({name, points}) => {
  if (name === nameValue && score > points) {
    return true;
  }
})
