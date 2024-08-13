import { GoogleMap, useJsApiLoader, InfoWindowF, MarkerF, PolygonF, PolylineF } from '@react-google-maps/api';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {geojson} from '../data/geojson';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { changeZoom, changeCenter } from '../redux/slices/MapSlice';
import { changeArea } from '../redux/slices/AreaSlice';
import { waterMeter as markers } from '../data/waterMeter';

const waterPipelineCoordinates = [
    { lat: 10.800400, lng: 106.667789},
    { lat: 10.799821, lng: 106.6748162 },
    { lat: 10.805398, lng: 106.678027},
    { lat: 10.808258, lng: 106.673684},
    { lat: 10.808157, lng: 106.673502},
    {lat: 10.807814, lng: 106.673938    },
    {lat: 10.807786, lng: 106.673896},
    {lat: 10.808121, lng: 106.673452},
    {lat: 10.808008, lng: 106.673250},





    // Thêm các tọa độ khác nếu cần
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
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        language: "vi"
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

    const handleClickPolygon = (areaName) => {
        setActiveMarker(null);
        const points = geojson.features.filter((feature => (feature.geometry.type == "Point" && feature.properties["@relations"])));
        const point = points.find((feature => (feature.properties["@relations"][0].reltags.name == areaName))).geometry.coordinates;
        dispatch(changeArea(areaName));
        dispatch(changeCenter({
            lat: point[1],
            lng: point[0]
        }));
        if (areaName.slice(0, 4) != "Quận") {
            dispatch(changeZoom(11));
        }
        else {
            dispatch(changeZoom(13));
        }
    } 

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
            {/* Phân vùng */}
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
                                    strokeColor: "#FD573A", //viền
                                    strokeOpacity: 1,
                                    strokeWeight: 1.6,
                                    fillColor: '#ccc', // nền
                                    fillOpacity: 0.5,     
                                }}
                                onClick={() => handleClickPolygon(feature.properties.name)}
                            />
                            :
                            <PolygonF 
                                key={index}
                                className={feature.properties.name}
                                paths={coordinates}
                                options={{
                                    strokeColor: "#FD573A", //viền
                                    strokeOpacity: 1,
                                    strokeWeight: 1.6,
                                    fillColor: '#2F85D6', // nền
                                    fillOpacity: 0.3,     
                                }}
                                onClick={() => handleClickPolygon(feature.properties.name)}
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
                                        strokeColor: "#FD573A", //viền
                                        strokeOpacity: 1,
                                        strokeWeight: 1.6,
                                        fillColor: '#ccc', // nền
                                        fillOpacity: 0.5,     
                                    }}
                                    onClick={() => handleClickPolygon(feature.properties.name)}
                                />
                            ) 
                            :
                            coordinates.map((coord, index) => 
                                <PolygonF 
                                    key={index}
                                    className={feature.properties.name}
                                    paths={coord}
                                    options={{
                                        strokeColor: "#FD573A", //viền
                                        strokeOpacity: 1,
                                        strokeWeight: 1.6,
                                        fillColor: '#2F85D6', // nền
                                        fillOpacity: 0.3,     
                                    }}
                                    onClick={() => handleClickPolygon(feature.properties.name)}
                                />
                            ) 
                        )
                    );
                })
            }
            {/* Đồng hồ nước */}
            {(area == "TP Hồ Chí Minh" ? markers : markers.filter(marker => marker.area == area)).map(({ id, name, position, value, area }) => (
                <MarkerF
                    key={id}
                    position={position}
                    onClick={() => handleActiveMarker(id)}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/2482/2482574.png",
                        scaledSize: { width: 30, height: 30 }
                    }}
                >
                    {
                        activeMarker === id 
                        ? 
                        (
                            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                <div>
                                    <p><strong>Tên: </strong>{name}</p>
                                    <p><strong>Lượng nước: </strong>{value}(m<sup>3</sup>)</p>
                                    <p><strong>Khu vực: </strong>{area}</p>
                                </div>
                            </InfoWindowF>
                        ) 
                        : 
                        null
                    }
                </MarkerF>
            ))}
            {/* Đường ống nước */}
            <PolylineF
                path={waterPipelineCoordinates}
                options={{strokeColor: "#e60be6", //viền
                    strokeOpacity: 1,
                    strokeWeight: 2,}}
            />
            {/* Vị trí của tôi */}
            <MarkerF
                    position={{lat: myLat, lng: myLng}}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/6597/6597982.png",
                        scaledSize: { width: 30, height: 30 }
                    }}
            >
            </MarkerF>
        </GoogleMap>
        <button className='absolute right-[10px] top-[calc(100vh-250px)] bg-white hover:bg-gray-100 w-[40px] h-[40px] rounded-sm grid place-content-center hover:opacity-80' onClick={handleMyPositon}>
            <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" className='w-[30px] h-[30px]'/>
        </button>
    </div>
        
    )
}

export default Map;