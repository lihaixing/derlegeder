import React, { useEffect, useRef, useState } from 'react';
import Pig from './main';
import './App.css';
import { ICubeInfo } from './type';
import IconList from './components/icons';
import cn from 'classnames';

const bodyWidth = document.body.clientWidth;
const defaultConfig = {
  cubeTypeCount: 15,
  cubeCount: 60,
  slotCount: 7,
  destroyCount: 3,
  cubeWidth: Math.floor(bodyWidth / (bodyWidth > 750 ? 20 : 8))
}

function App() {
  const app = useRef<any>(null);
  const pig = useRef<Pig | null>(null);
  const stepCount = useRef(0);
  const [cubesInfo, setCubesInfo] = useState<ICubeInfo[]>([]);
  const [slotCubesInfo, setSlotCubesInfo] = useState<ICubeInfo[]>([]);

  const onMountApp = (ele: HTMLDivElement) => {
    app.current = ele;
  }

  const newPig = () => {
    setCubesInfo([])
    setSlotCubesInfo([])
    stepCount.current = 0;
    if (app.current) {
      pig.current = new Pig({
        panelWidth: app.current.clientWidth,
        panelHeight: app.current.clientHeight,
        cubeWidth: defaultConfig.cubeWidth,
        cubeTypeCount: defaultConfig.cubeTypeCount,
        cubeCount: defaultConfig.cubeCount,
        slotCount: defaultConfig.slotCount,
        destroyCount: defaultConfig.destroyCount
      });

      pig.current.on('updatePanelCubes', (cubes: ICubeInfo[]) => {
        setCubesInfo([...cubes]);
      });

      pig.current.on('updateSlotCubes', (cubes: ICubeInfo[]) => {
        setSlotCubesInfo([...cubes]);
      });

      pig.current.drawPanel()
    }
  }



  useEffect(() => {
    newPig();
    return () => {
      pig.current?.removeAllListener()
    }
  }, [])

  const onClickCube = (item: ICubeInfo, event: any) => {
    if (item.coveredCubes.length > 0) {
      return;
    }
    stepCount.current++;
    pig.current?.removeCube(item.id);
  }

  useEffect(() => {
    if (slotCubesInfo.length === defaultConfig.slotCount) {
      alert('挑战失败，点击确认重新开始');
      newPig()
    }

    if (stepCount.current === defaultConfig.cubeCount && cubesInfo.length === 0 && slotCubesInfo.length === 0) {
      alert('恭喜通关，点击确认再重新玩')
      newPig()
    }

  }, [cubesInfo, slotCubesInfo])

  return (
    <div className="container">
      <div className="App" ref={onMountApp} style={{ height: `calc(100% - ${defaultConfig.cubeWidth + 20}px)` }}>
        {
          cubesInfo.map((item: ICubeInfo) => {
            return <div key={item.id} onClick={(event) => onClickCube(item, event)} className={cn("item", item.coveredCubes.length > 0 && 'cover')} style={{ width: defaultConfig.cubeWidth, height: defaultConfig.cubeWidth, left: item.coordinate[0] - defaultConfig.cubeWidth / 2, top: item.coordinate[1] - defaultConfig.cubeWidth / 2, zIndex: item.zIndex }}>
              {
                renderIconList(item.cubeTypeKey, item.coveredCubes.length > 0, { fontSize: defaultConfig.cubeWidth })
              }
            </div>
          })
        }
      </div>
      <div className="footer">
        <div className="bar" style={{ width: defaultConfig.slotCount * defaultConfig.cubeWidth, height: defaultConfig.cubeWidth }}>
          {
            slotCubesInfo.map((item: ICubeInfo) => {
              return <div key={item.id} className={cn("slot-item")} style={{ width: defaultConfig.cubeWidth, height: defaultConfig.cubeWidth }}>
                {
                  renderIconList(item.cubeTypeKey, false, { fontSize: defaultConfig.cubeWidth })
                }
              </div>
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;

const renderIconList = (i: number, isCover: boolean, style: any) => {
  const Icon = IconList[i];
  const colorProps = isCover ? { twoToneColor: "rgba(0,0,0)" } : {};
  return <Icon style={style} {...colorProps} />
}
