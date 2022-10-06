import { IResolveBarConfig, ICubeInfo } from '../type';

class ResolveBar {
  private cubeCount;
  private destroyCount;
  private keyCount: Map<number, number>;
  private slotArr: ICubeInfo[];
  constructor(config: IResolveBarConfig) {
    this.cubeCount = config.cubeCount;
    this.destroyCount = config.destroyCount;
    this.keyCount = new Map();
    this.slotArr = [];
  }

  add(cube: ICubeInfo) {
    if (this.slotArr.length >= this.cubeCount) {
      return;
    }

    const findKeyCount = this.keyCount.get(cube.cubeTypeKey) || 0;

    if (findKeyCount >= this.destroyCount - 1) {
      const index = this.slotArr.findIndex(item => item.cubeTypeKey === cube.cubeTypeKey);

      this.slotArr.splice(index, findKeyCount);

      this.keyCount.set(cube.cubeTypeKey, 0);
    } else {
      const lastIndex = this.slotArr.map(item => item.cubeTypeKey).lastIndexOf(cube.cubeTypeKey);
      if (lastIndex > -1) {
        this.slotArr.splice(lastIndex + 1, 0, cube);
      } else {
        this.slotArr.push(cube);
      }

      this.keyCount.set(cube.cubeTypeKey, findKeyCount + 1);
    }

    return this.slotArr
  }
}

export default ResolveBar;