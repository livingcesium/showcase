import logo from '../logo.svg';
import Link from 'react-router-dom';
import { useState } from 'react';
// Style from './Nav.css';
import Portfolio from './Portfolio';
import FlexWrap from './Styling';

const navClicks = [Logo, DropPortfolio]; // Add navbar link/button components here to have them rendered
const displayOption = 'flex'; // In case this changes in the future

function Logo() {
    return (
      <img src={logo} alt="logo" className="nav-icon"/>
    );
}

/**
* @param {function} toggleDrop - function to toggle the portfolio drop down
* @returns {JSX.Element} - interactable component that toggles the portfolio drop down
**/
function DropPortfolio({folioAnim, changeFolio}) {
    const handleFolio = (anim) => () => changeFolio(anim);
    const isDropped = folioAnim === 'drop';
    const whenRaised = (anim) => isDropped ? () => {/*do nothing*/} : handleFolio(anim);
    return (

        <img
        src={logo}
        alt="drop folio"
        onMouseEnter={whenRaised('peek')}
        onMouseLeave={whenRaised('')}
        onClick={isDropped ? handleFolio(''): handleFolio('drop')}
        className="nav-icon"
        />
    );
}

function Interactions(onClicks) {
    return (
        <div className="nav-interactions">
        {navClicks.map((Clickable, index) => <FlexWrap key={index} children={<Clickable {...onClicks}/>}/>)}
        </div>
    );
}

function Navbar() {
    const [folioAnim, setAnim] = useState("");
    return (
        <div>
        <div className="nav">
            <Interactions folioAnim={folioAnim} changeFolio={setAnim}/>
        </div>

        {/* Portfolio drops down from behind navbar */}
        <Portfolio anim={folioAnim} dropLength={"60vh"} peekLength={"2vh"}/>
        </div>
    );
}

export default Navbar;