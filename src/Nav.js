import { React, Component } from 'reactn';
import "./Nav.css"

class Nav extends Component {
  render() {
    return (
      <div className="side-bar">
        <nav className="side-nav">
          <ul className="nav-list">
            <li className={this.global.nav === "Home" ? "selected-nav" : ""}
              onClick={() => this.setGlobal({ nav: "Home" })}>
              <a>Home</a></li>
            <li className={this.global.nav === "CompoundInterest" ? "selected-nav" : ""}
              onClick={() => this.setGlobal({ nav: "CompoundInterest" })}>
              <a>Compound Interest</a></li>
            <li className={this.global.nav === "Buy vs. Rent" ? "selected-nav" : ""}
              onClick={() => this.setGlobal({ nav: "BuyVsRent" })}>
              <a>Buy vs. Rent</a></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Nav