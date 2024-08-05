import { GoogleMap, useJsApiLoader, InfoWindowF, MarkerF, PolygonF } from '@react-google-maps/api';
import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import {geojson} from '../data/geojson';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { changeZoom, changeCenter } from '../redux/slices/MapSlice';

const markers = [
    {
        id: 1,
        name: "Đồng hồ 1",
        position: { lat: 10.7002, lng: 106.70221 },
    },
    {
        id: 2,
        name: "Đồng hồ 2",
        position: { lat: 10.82302, lng: 106.62965 },
    },
    {
        id: 3,
        name: "Đồng hồ 3",
        position: { lat: 10.82643, lng: 106.83957 },
    },
    {
        id: 4,
        name: "Đồng hồ 4",
        position: { lat: 10.85989, lng: 106.70927 },
    },
    {
        id: 5,
        name: "Đồng hồ 5",
        position: { lat: 11.03012, lng: 106.58904 },
    }
];


function Map() {
    const center = useSelector(state => state.map.center);
    const zoom = useSelector(state => state.map.zoom);
    const [myLat, setMyLat] = useState(center.lat);
    const [myLng, setMyLng] = useState(center.lng);
    const [activeMarker, setActiveMarker] = useState(null);
    const mapRef = useRef(null);
    const area = useSelector(state => state.area.area);
    const dispatch = useDispatch();

    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY
    })
    const handleMyPositon = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                dispatch(changeZoom(16));
                setMyLat(position.coords.latitude);
                setMyLng(position.coords.longitude);
                dispatch(changeCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }))
            });
        }
    };
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMyLat(position.coords.latitude);
                setMyLng(position.coords.longitude);
            });
        }
    }, []);

    const handleZoomChanged =  useCallback(() => {
        if (mapRef.current) {
            dispatch(changeZoom(mapRef.current.getZoom()));
            dispatch(changeCenter({
                lat: mapRef.current.center.lat(),
                lng: mapRef.current.center.lng()
            }));
        }
    }, []);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
          return;
        }
        setActiveMarker(marker);
    };



    return isLoaded && (<div className='w-[100vw] md:w-[calc(100vw-350px)] h-[100vh] relative'>
        <GoogleMap
            mapContainerStyle={{
                width: "100%",
                height: "100%"
            }}
            center={center}
            zoom={zoom}
            onLoad={map => mapRef.current = map}
            onZoomChanged={handleZoomChanged}
        >
            {
                geojson 
                &&
                geojson.features.filter((feature => (feature.geometry.type == "Polygon" || feature.geometry.type == "MultiPolygon" ))).map((feature, index) => {
                    const coordinates = 
                        feature.geometry.type == "Polygon" 
                        ? 
                        feature.geometry.coordinates[0].map(coord => ({
                            lat: coord[1],
                            lng: coord[0],
                        })) 
                        : 
                        feature.geometry.coordinates.map(coord => coord[0].map((coord) => ({
                            lat: coord[1],
                            lng: coord[0]
                        })));
                    return (
                        feature.properties.name != "Huyện Cần Giờ" 
                        ? 
                        (
                            feature.properties.name == area
                            ?
                            <PolygonF 
                                key={index}
                                className={feature.properties.name}
                                paths={coordinates}
                                options={{
                                    strokeColor: "#F6610A", //viền
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    fillColor: '#ccc', // nền
                                    fillOpacity: 0.3,     
                                }}
                            />
                            :
                            <PolygonF 
                                key={index}
                                className={feature.properties.name}
                                paths={coordinates}
                                options={{
                                    strokeColor: "#F6610A", //viền
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    fillColor: '#2F85D6', // nền
                                    fillOpacity: 0.3,     
                                }}
                            />
                        )
                        :
                        (
                            feature.properties.name == area
                            ?
                            coordinates.map((coord, index) => 
                                <PolygonF 
                                    key={index}
                                    className={feature.properties.name}
                                    paths={coord}
                                    options={{
                                        strokeColor: "#F6610A", //viền
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                        fillColor: '#ccc', // nền
                                        fillOpacity: 0.3,     
                                    }}
                                />
                            ) 
                            :
                            coordinates.map((coord, index) => 
                                <PolygonF 
                                    key={index}
                                    className={feature.properties.name}
                                    paths={coord}
                                    options={{
                                        strokeColor: "#F6610A", //viền
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                        fillColor: '#2F85D6', // nền
                                        fillOpacity: 0.3,     
                                    }}
                                />
                            ) 
                        )
                    );
                })
            }
            {markers.map(({ id, name, position }) => (
                <MarkerF
                    key={id}
                    position={position}
                    onClick={() => handleActiveMarker(id)}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/2482/2482574.png",
                        scaledSize: { width: 30, height: 30 }
                    }}
                >
                    {activeMarker === id ? (
                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                            <div>
                                <p>{name}</p>
                            </div>
                        </InfoWindowF>
                    ) : null}
                </MarkerF>
            ))}
            <MarkerF
                    position={{lat: myLat, lng: myLng}}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/6597/6597982.png",
                        scaledSize: { width: 30, height: 30 }
                    }}
            >
            </MarkerF>
        </GoogleMap>
        <button className='absolute right-[10px] top-[calc(100vh-250px)] bg-white hover:bg-gray-100 w-[40px] h-[40px] rounded-sm grid place-content-center' onClick={handleMyPositon}>
            <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" className='w-[30px] h-[30px]'/>
        </button>
    </div>
        
    )
}

export default Map;