import './App.scss'
import React from 'react'
import {localState} from "../common/LocalState";

const App: React.FC = () => {
  return (<pre>
        {localState}
      </pre>
  )
}

export default App
