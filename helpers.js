export const getSecondDim = (number, gridsize) => {
    if (number % gridsize === 0) {
      return gridsize - 1
    }
    else return (number % gridsize) - 1
  }
  
  export const getFirstDim = (number, gridsize) => {
    if (number === gridsize ** 2) {
      return gridsize - 1;
    } 
  
    if (number % gridsize === 0) {
      return Math.floor(number / gridsize) - 1
    }
    
    
    else return Math.floor(number / gridsize);
  };
  
  export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  
  export function shuffle(array) {
    var i = array.length,
      j = 0,
      temp;
  
    while (i--) {
      j = Math.floor(Math.random() * (i + 1));
  
      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  
    return array;
  }

