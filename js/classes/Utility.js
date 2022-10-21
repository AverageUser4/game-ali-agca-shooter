const randomInteger = (min = 0, max = 100, negative = false) => {
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  return negative && randomInteger(0, 1) ? -random : random;
}

export default {
  randomInteger
};