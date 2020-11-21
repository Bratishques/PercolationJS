export default class UnionFind {
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

