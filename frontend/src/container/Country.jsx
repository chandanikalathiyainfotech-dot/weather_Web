import React from "react";
import { CountryStateCityPicker } from 'react-country-state-city-picker'

function Country() {
    const handleSelect = (selection) => {
        console.log(selection.country?.name)
        console.log(selection.state?.name)
        console.log(selection.city?.name)
    }


    return <CountryStateCityPicker onSelect={handleSelect} />
}

export default Country;