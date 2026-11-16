import React, { useState, useEffect } from "react";
import { MdOutlineWebAsset } from "react-icons/md";
import { PiWebcamFill } from "react-icons/pi";
import { FaArrowDown } from "react-icons/fa6";


function Country({ onDownload }) {

    return (
        <>
            <div className="imagesfit">
                {/* <div className="circle"></div> */}
                <div className="image img1">
                    <img src="../../public/image/i1.png" alt="" />
                </div>

                <div className="image img2">
                    <img src="../../public/image/i1.png" alt="" />
                </div>

                <div className="image img3">
                    <img src="../../public/image/i1.png" alt="" />
                </div>

                <div className="image img4">
                    <img src="../../public/image/i1.png" alt="" />
                </div>
            </div>

            <div className="banner">
                <div className="banner-img">
                    <div className="arrow-icon">
                        <FaArrowDown />
                    </div>
                </div>
            </div>

             <div class="slanted-lines"></div>

        </>
    );
}

export default Country;


