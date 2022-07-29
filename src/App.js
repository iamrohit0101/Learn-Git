import './App.css';
import { BrowserRouter, Routes, Route,} from 'react-router-dom'

import UserLogin from './myComponents/UserLogin';
import UserRegister from './myComponents/UserRegister'
import NavBar from './myComponents/NavBar';
import About from './myComponents/About';
import AboutAdmin from './myComponents/AboutAdmin';


import React, { Component } from 'react'
import Rohit from './myComponents/Rohit';

export default class App extends Component {

  constructor(){
    super();
    this.state={
        loginStatus:false
    }
  }
  render() {
    return (
      <div className='App'>

      <BrowserRouter>
            <NavBar />
            <Routes>

              <Route exact path="/" element={<UserLogin key="home"/>} />
              <Route exact path="/UserLogin" element={<UserLogin key="login" />} />
              <Route exact path="/UserRegister" element={<UserRegister key="register" />} />
              <Route exact path="/About" element={<About key="about" />} />
              <Route exact path="/AboutAdmin" element={<AboutAdmin key="aboutadmin" />} />
              <Route exact path="/Rohit" element={<Rohit key="rohit" />} />

              
            </Routes>
        </BrowserRouter>
        
      </div>
    )
  }
}



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
