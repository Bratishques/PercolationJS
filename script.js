import { sleep, getFirstDim, getSecondDim, shuffle } from "./helpers.js";
import UnionFind from "./unionFind.js";



const button = document.getElementById("start");
const input = document.getElementById("grid-input");
const dataFirst = document.getElementById("calc1")
const dataSecond = document.getElementById("calc2")
const time = document.getElementById("calc3")
const speed = document.getElementById("speed")
const topElem = document.getElementById('top')
const bottom = document.getElementById('bottom')
const targetdiv = document.getElementById("bottom");
const parent = document.getElementById("common-parent");
let gridMemo = input.value





const createColumns = (gridsize) => {
  let string = "";
  for (let i = 0; i < gridsize; i++) {
    string += "1fr ";
  }
  return string;
};


const createGrid = (gridsize) => {
  if (gridsize > 150) {
    alert("The browser will be stuck, please consider redoing this");
    return;
  }
  if (gridsize > 0) {
    topElem.style.width = bottom.style.width = `${gridsize * 45}`
    bottom.innerHTML = `${(gridsize**2) + 1}`
  }
 
      const deleted = document.getElementsByClassName("row-grid");
  
        while (deleted.length) {
          console.log(deleted, deleted.length)
          deleted[deleted.length-1].remove();
      }

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
          newDiv.style.height = `${550/gridsize}px`
          newDiv.innerHTML += `<div class="number" style="width: ${(550/(gridsize))}px; border: 1px solid rgb(131, 178, 240) " id="${j + gridsize * i + 1}"></div>`
        }
        }
        newDiv.style.gridTemplateColumns = createColumns(gridsize);
        parent.insertBefore(newDiv, targetdiv);
      
      
        
    }
    gridMemo = gridsize
  







 
};



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
      await sleep(25000/speed.value**3);
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
