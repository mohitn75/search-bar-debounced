import React from "react";

export default function Pill(props){
    return(
        <div className="pill" onClick={() => props.onSelectionCancel(props.user)}>
           <img src={props.user.image}></img>
           <span>{props.user.firstName} {props.user.lastName}</span>
           <span>&times;</span>
        </div>
    )
}