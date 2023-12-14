import React from "react";
import "./Game.css";

interface Props {
    dispimg: string;
}

 function Square({dispimg}: Props ) {
    return <div className="blockB"> <img src={dispimg} alt="square"/> </div>;
}

export {  Square };
