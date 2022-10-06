class Choujiang {
  private cacheList: Array<any> = [];
  todos: Array<any> = [];
  deleteIndex: number | undefined;

  constructor(list: Array<any>) {
    this.cacheList = list;
  }
  // 抽奖
  choujiang(): any {
    if (this.deleteIndex) {
      this.todos.splice(this.deleteIndex, 1);
    }
    const count = this.todos.length - 1;
    if (count < 0) {
      console.log("所有用户都中过奖了");
      // 重来
      this.todos = [...this.cacheList];
      this.deleteIndex = undefined;
      return this.choujiang();
    }
    const index = Math.round(count * Math.random());
    this.deleteIndex = index;

    console.log(index + "中奖了");

    return this.todos[index];
  }

  // 打乱数据
  getLuanArr() {
    // 上面的回答 md.sort(_ => Math.random() < 0.5 ? 1 : -1)的确更简单
    let i = this.cacheList.length - 1;
    let newSortArr = [];
    while (i >= 0) {
      const item = this.choujiang();
      newSortArr.push(item);
      i--;
    }
    return newSortArr;
  }
}

export default Choujiang