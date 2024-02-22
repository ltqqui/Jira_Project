import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button , SmallButton} from './Button/Button';
function App() {
  return (
    <div className="App">
      <Button primary></Button>
      <SmallButton >123</SmallButton>
    </div>
  );
}

export default App;
