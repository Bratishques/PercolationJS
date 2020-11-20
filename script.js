let idArray = [];
let entryArray = [];

//helpers :)

const getSecondDim = (number, gridsize) => {
  if (number % gridsize === 0) {
    return gridsize - 1
  }
  else return (number % gridsize) - 1
}

const getFirstDim = (number, gridsize) => {
  if (number === gridsize ** 2) {
    return gridsize - 1;
  } 

  if (number % gridsize === 0) {
    return Math.floor(number / gridsize) - 1
  }
  
  
  else return Math.floor(number / gridsize);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function shuffle(array) {
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

//Class itself

class UnionFind {
  constructor(gridsize) {
    this.size = gridsize * gridsize;
    this.ids = [0];
    this.lvls = [1];
    this.opens = [];
    for (let i = 1; i <= this.size; i++) {
      this.ids.push(i);
      this.lvls.push(1);
    }
    this.ids.push(this.size + 1);
    this.lvls.push(1);
    this.virtGrid = [];
    for (let i = 0; i < gridsize; i++) {
      const arr = [];
      for (let j = 0; j < gridsize; j++) {
        arr.push(gridsize * i + j + 1);
      }
      this.virtGrid.push(arr);
    }

    console.log(this.virtGrid);
  }

  root(i) {
    while (this.ids[i] !== i) {
      this.ids[i] = this.ids[this.ids[i]];
      i = this.ids[i];
    }
    return i;
  }

  open(i) {
    this.opens.push(i);
  }

  isOpen(i) {
    if (this.opens.indexOf(i) > -1) {
      return true;
    }
    return false;
  }

  union(i, j) {
    let firstRoot = this.root(i);
    let secondRoot = this.root(j);
    if (firstRoot === secondRoot) return;
    if (this.lvls[firstRoot] < this.lvls[secondRoot]) {
      this.ids[firstRoot] = secondRoot;
      this.lvls[secondRoot] += this.lvls[firstRoot];
    } else {
      this.ids[secondRoot] = firstRoot;
      this.lvls[firstRoot] += this.lvls[secondRoot];
    }
  }
  connected(i, j) {
    return this.root(i) === this.root(j);
  }
}

const createColumns = (gridsize) => {
  let string = "";
  for (let i = 0; i < gridsize; i++) {
    string += "1fr ";
  }
  return string;
};
const topElem = document.getElementById('top')
const bottom = document.getElementById('bottom')

const createGrid = (gridsize) => {
  if (gridsize > 70) {
    alert("The browser will be stuck, please consider redoing this");
    return;
  }
  const deleted = document.getElementsByClassName("row-grid");
  if (deleted.length) {
    while (deleted.length) {
      deleted[0].remove();
    }
  }
 if (gridsize > 0) {
  topElem.style.width = bottom.style.width = `${gridsize * 45}`
  bottom.innerHTML = `${(gridsize**2) + 1}`
}


  const targetdiv = document.getElementById("beforeGrid");
  const parent = document.getElementById("common-parent");
  for (let i = 0; i < gridsize; i++) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("row-grid");
    for (let j = 0; j < gridsize; j++) {
      if (gridsize < 15) {
      newDiv.innerHTML += `<div class="number" id="${j + gridsize * i + 1}">${
        j + gridsize * i + 1
      }</div>`;
    }
    else {
      newDiv.style.height = `${500/gridsize}px`
      console.log(600/gridsize)
      newDiv.innerHTML += `<div class="number" style="width: ${(500/(gridsize))}px; border: 1px solid rgb(131, 178, 240) " id="${j + gridsize * i + 1}"></div>`
    }
    }
    newDiv.style.gridTemplateColumns = createColumns(gridsize);
    parent.insertBefore(newDiv, targetdiv);
  }
};

const button = document.getElementById("start");
const input = document.getElementById("grid-input");
const dataFirst = document.getElementById("calc1")
const dataSecond = document.getElementById("calc2")
const time = document.getElementById("calc3")
const speed = document.getElementById("speed")

button.addEventListener("click", () => {
  createGrid(input.value)
  input.disabled = true
  button.disabled = true
  const elements = document.getElementsByClassName("number");
  for (let i = 0; i < input.value ** 2; i++) {
    elements[i].classList.add("closed");
  }
  const gridsize = input.value;
  const grid = new UnionFind(gridsize);
  console.log(grid.virtGrid)

  const rNumbers = [];
  for (let i = 1; i <= grid.size; i++) {
    rNumbers.push(i);
  }
  shuffle(rNumbers);
  const openSite = (number) => {
    
    const cell = document.getElementById(`${number}`);
    cell.classList.remove("closed");
    cell.classList.add("open");
    grid.open(number);
    const firstDim = getFirstDim(number, gridsize);
    const secondDim = getSecondDim(number, gridsize);
    if (firstDim === 0) {

      grid.union(0,number)
    }
    if (firstDim === gridsize - 1) {

      grid.union(grid.size + 1, number)
    }

    const checkAndConnect = (i, j) => {
      if ((grid.virtGrid[i])) {
        if (grid.virtGrid[i][j]) {
          if (grid.isOpen(grid.virtGrid[i][j])) {
            grid.union(grid.virtGrid[i][j],number);
          }
        }
      }
    };
    checkAndConnect(firstDim - 1, secondDim);
    checkAndConnect(firstDim + 1, secondDim);
    checkAndConnect(firstDim, secondDim - 1);
    checkAndConnect(firstDim, secondDim + 1);
  };

  const openSites = async (array) => {
    let count = 0
    for (let i = 0; i < grid.size; i++) {
      openSite(array[i]);
      count++
      dataFirst.innerHTML=`The amount of open cells ${count}/${grid.size}`
      dataSecond.innerHTML = `k = ${count/grid.size}`
      if (grid.connected(0, gridsize ** 2 + 1)) {
        await sleep(800/speed.value)
        input.disabled = false
        button.disabled = false
        console.log(array[i])
        for (let i = 1; i <= grid.size; i++) {
            if (!grid.connected(0,i) && !grid.connected(i, grid.size + 1)) {
            const element = document.getElementById(`${i}`)
            element.classList.add('path')
          }

        }
        console.log(grid.lvls)

        return
      };
      await sleep(800/speed.value);
    }
  };

  const countTime = async () => {
    let timer = 0
    while (!grid.connected(0, gridsize ** 2 + 1)) {
      await sleep(50)
      timer += 50
      time.innerHTML = `Time running: ${(timer/1000).toFixed(2)}`
    }
  }
  countTime()
  openSites(rNumbers);
});

input.addEventListener("input", (e) => {
  createGrid(e.target.value);
});

createGrid(input.value);
