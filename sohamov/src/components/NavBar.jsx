import logo from "../assets/sohamov-logo.png"

import './NavBar.css' // stylesheet

function NavBar() {
    //console.log("rendered this")
    return (
        <div id="navbar">
            <div id="logo-container">
                <img id="logo" src={logo}/>
            </div>
            <ul>
                <li><a href="#How_it_works">How It Works</a></li>
                <li><a href="https://github.com/tigranb2/armenian-dish-classification" target="_blank">Source Code</a></li>
            </ul>
        </div>
    );
};

export default NavBar;