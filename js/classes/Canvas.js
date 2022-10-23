const element = document.querySelector('canvas');
const context = element.getContext('2d');
const width = parseInt(element.width);
const height = parseInt(element.height);

export default {
  element,
  context,
  width,
  height,  
};

