export interface IConfig {
  panelWidth: number;
  panelHeight: number;
  cubeTypeCount: number;
  cubeCount: number;
  slotCount: number;
  cubeWidth: number;// 宽高一样
  destroyCount?: number;
}

export interface ICubeInfo {
  coordinate: [number, number];
  cubeTypeKey: number;
  zIndex: number;
  id: string;
  coveredCubes: ICubeInfo[]
}

export interface ICoordinateRange {
  x: [number, number];
  y: [number, number];
}

export interface IResolveBarConfig {
  cubeCount: number;
  destroyCount: number;
}