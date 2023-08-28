import { useState } from 'react'

import logo from "../assets/sohamov-logo.png" // site logo
import faBars from "../assets/fa-bars.png" // menu icon
import xmark from "../assets/xmark.png" // menu icon

import "./NavBar.css" // stylesheet


function NavBar() {
    const [showMenu, setShowMenu] = useState(false);

    function toggleMenu(){
        setShowMenu(!showMenu);
    };

    console.log("hi")
    return (
        <div id="navbar">
            <div id="logo-container">
                <img id="logo" src={logo}/>
            </div>
            <div id="toggle-container">
                <a onClick={toggleMenu}><img id="toggle-icon" src={!showMenu ? faBars : xmark} /></a>
            </div>
            <ul onClick={() => setShowMenu(false)} className={showMenu ? "visible" : "hidden"}>
                <li><a className="nav-link" href="#How_it_works">How It Works</a></li>          
                <li><a className="nav-link" href="https://github.com/tigranb2/armenian-dish-classification" target="_blank">Source Code</a></li>
            </ul> 
   
        </div>
    );
};

export default NavBar;