import { IConfig, ICubeInfo, ICoordinateRange } from '../type';
import Choujiang from './choujiang';
import ResolveBar from './resolveBar';
import EventEmitter from '../utils/eventEmitter'
class Panel extends EventEmitter {
  private panelWidth;
  private panelHeight;
  private cubeTypeCount;
  private cubeCount;
  private slotCount;
  private cubeWidth; // 宽高
  private destroyCount;

  // 自定义数据
  private cubesInfo: ICubeInfo[] = []; // 小方块详细信息
  private coordinateRange: ICoordinateRange;
  private slot: ResolveBar;

  constructor(config: IConfig) {
    super();
    this.panelWidth = config.panelWidth;
    this.panelHeight = config.panelHeight;
    this.cubeTypeCount = config.cubeTypeCount;
    this.cubeCount = config.cubeCount;
    this.slotCount = config.slotCount;
    this.cubeWidth = config.cubeWidth;
    this.destroyCount = config.destroyCount || 3;

    if (this.cubeCount % this.destroyCount !== 0) {
      throw new Error('cubeCount必须可以被destroyCount整除');
    }


    // 坐标范围
    this.coordinateRange = {
      x: [this.cubeWidth / 2, this.panelWidth - this.cubeWidth / 2],
      y: [this.cubeWidth / 2, this.panelHeight - this.cubeWidth / 2],
    }

    this.slot = new ResolveBar({
      cubeCount: this.slotCount,
      destroyCount: this.destroyCount
    })
  }

  public removeCube(id: string) {
    const currentCubeIndex = this.cubesInfo.findIndex(item => item.id === id);
    if (currentCubeIndex === -1) {
      throw new Error('找不到当前id')
    }

    const currentCube = this.cubesInfo[currentCubeIndex]
    if (currentCube.coveredCubes.length > 0) {
      throw new Error('当前cube被覆盖，不能移除')
    }

    this.cubesInfo.splice(currentCubeIndex, 1);

    this.cubesInfo.forEach(item => {
      const findCubeIndex = item.coveredCubes.findIndex(item => item.id === id);
      if (findCubeIndex > -1) {
        item.coveredCubes.splice(findCubeIndex, 1)
      }
    })

    this.emit('updatePanelCubes', this.cubesInfo);

    const slotArr = this.slot.add(currentCube);

    this.emit('updateSlotCubes', slotArr)
  }

  public drawPanel() {

    const cubeTypeKeyArr = this.calcCubeTypeKey();

    for (let i = 0; i < this.cubeCount; i++) {
      const randomX = this.coordinateRange.x[0] + Math.random() * (this.coordinateRange.x[1] - this.coordinateRange.x[0]);
      const randomY = this.coordinateRange.y[0] + Math.random() * (this.coordinateRange.y[1] - this.coordinateRange.y[0]);
      const cubeTypeKey = cubeTypeKeyArr[i];
      const id = Math.random().toString();

      const currentCube: ICubeInfo = {
        id,
        zIndex: i,
        coordinate: [randomX, randomY],
        cubeTypeKey,
        coveredCubes: []
      };

      this.calcCoveredCubes(currentCube);

      this.cubesInfo.push(currentCube);
    }

    this.emit('updatePanelCubes', this.cubesInfo);
  }

  private calcCubeTypeKey() {
    // 可以放多少组
    const groupCount = Math.floor(this.cubeCount / this.destroyCount);
    // 每种类型放多少组
    const groupCountOfPerType = Math.floor(groupCount / this.cubeTypeCount);

    const averageCubeTypeKeyArr = new Array(groupCountOfPerType * this.cubeTypeCount * this.destroyCount);

    for (let i = 0; i < this.cubeTypeCount; i++) {
      const start = i * this.destroyCount * groupCountOfPerType;
      const end = start + this.destroyCount * groupCountOfPerType;
      averageCubeTypeKeyArr.fill(i, start, end);
    }

    console.log('averageCubeTypeKeyArr', averageCubeTypeKeyArr)
    // 还剩多少组可以放, 剩下的随机放
    const leftGroupCount = groupCount % this.cubeTypeCount;

    const cubeTypeArr = Array.from(new Array(this.cubeTypeCount), (item, index) => index);

    const leftCubeTypeKeyArr = new Array(leftGroupCount * this.destroyCount);
    const choujiang = new Choujiang(cubeTypeArr);
    for (let i = 0; i < leftGroupCount; i++) {
      let key = choujiang.choujiang();
      const start = i * this.destroyCount;
      const end = start + this.destroyCount;
      leftCubeTypeKeyArr.fill(key, start, end);
    }

    console.log('leftCubeTypeKeyArr', leftCubeTypeKeyArr)

    const finalCubeTypeKeyArr = [...averageCubeTypeKeyArr, ...leftCubeTypeKeyArr].sort(() => {
      return Math.random() < 0.5 ? 1 : -1
    })

    console.log('finalCubeTypeKeyArr', finalCubeTypeKeyArr)
    return finalCubeTypeKeyArr;
  }

  private calcCoveredCubes(currentCube: ICubeInfo) {
    const { coordinate } = currentCube;
    this.cubesInfo.forEach(item => {
      if (this.isCover(coordinate, item.coordinate)) {
        item.coveredCubes.push(currentCube)
      }
    })
  }

  private isCover(coordinate2: [number, number], coordinate1: [number, number]) {
    const dx = Math.abs(coordinate2[0] - coordinate1[0]) - this.cubeWidth;
    const dy = Math.abs(coordinate2[1] - coordinate1[1]) - this.cubeWidth;

    return dx < 0 && dy < 0
  }

}
export default Panel;