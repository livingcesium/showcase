function Portfolio({anim, dropLength, peekLength}){
    let heightStyle;
    switch(anim){
        case 'drop':
            heightStyle = {height:dropLength}
            break
        case 'peek':
            heightStyle = {height:peekLength}
            break
        default:
            anim = ''
            heightStyle = {height: "0"}
            break
    }
    return (
        <div style={heightStyle} className={"portfolio " + anim}>
        portfolio
        </div>
    );
}

export default Portfolio;