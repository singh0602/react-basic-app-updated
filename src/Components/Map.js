import React from 'react';
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";




const Map = (props) => {

    const libraries=['places'];
    /*const center={
        'lat': 30.9010,
        'lng': 75.8573,
    }*/


    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey:'AIzaSyAkoe98NAkKlGghynXBqFjVdMrYK4RDoOI',
        libraries
    });



    if(loadError) return('<div>error</div>');
    if(!isLoaded) return('<div>Loading Maps...</div>');

    return(




        <div className="google-map-cont">
        <GoogleMap className="google-map" zoom={14} center={props.center} onClick={props.setMarkers} >

            <Marker position={props.marker} />
        </GoogleMap>
        </div>

        );

}

export default Map;