import React, { useState, useEffect } from "react";
import { MdOutlineWebAsset } from "react-icons/md";
import { PiWebcamFill } from "react-icons/pi";

function Country() {

    return (
        <div style={{ padding: '40px' }}>
            <div className="grid grid-cols-12 mt-10 ml-20">
                <div className="col-span-2">
                    <div className="servicebox">
                        <div className="icone">
                            <span><PiWebcamFill /></span>
                        </div>
                        <div className="infobox">
                            <div className="titile">
                                Web Designing
                            </div>
                            <div className="text">
                                <h3>1963</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shape">
                <svg viewBox="0 0 450 420">
                    <path
                        className="outer-ring"
                        d="
                            M 190 20
                            C 90 -5, 5 65, 15 125
                            C 20 175, 85 225, 115 290
                            C 155 390, 230 420, 320 375
                            C 400 335, 465 250, 420 190
                            C 370 130, 280 90, 190 20
                            Z
                        "
                    />
                </svg>
            </div>
        </div>
    );
}

export default Country;
