import logo from './logo.svg';
import * as React from 'react'
import Timer from './Timer'
import TimerContext from './TimerContext'
import {Tab} from "@nextui-org/react";

function TimerItems({children, id}) {
    const {selectedTimer, setSelectedTimer} = React.useContext(TimerContext)
    
    
    const handleSelectingTimer = () => {
        setSelectedTimer(id)
    }
  

  return (
    <div>
      <button 
        style={selectedTimer===id?{backgroundColor:"black", color:"white"}:null}
        onClick={handleSelectingTimer}
      >{children}
      </button>
    </div>
  );
}

export default TimerItems;
