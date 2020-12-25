import { React, Component } from 'reactn';
import Nav from "./Nav.js"
import Home from "./Home.js"
import CompoundInterest from "./compound-interest/CompoundInterest.js"
import "./App.css"
import './data.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.setGlobal({
      nav: "Home"
    })
  }

  render() {
    return (
      <div className="app-container">
        <Nav />

        <div className="main">
          {
            {
              "Home": <Home />,
              "CompoundInterest": <CompoundInterest />
            }[this.global.nav]
          }
        </div>
      </div>
    );
  }
}

export default App;
