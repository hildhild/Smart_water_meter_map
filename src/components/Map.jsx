import { GoogleMap, useJsApiLoader, InfoWindowF, MarkerF, PolygonF, PolylineF } from '@react-google-maps/api';
import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import {geojson} from '../data/geojson';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { changeZoom, changeCenter } from '../redux/slices/MapSlice';
import { changeArea } from '../redux/slices/AreaSlice';
import { waterMeter as markers } from '../data/waterMeter';
import Select from 'react-select';
import { changePath, changeType, changeValue, toggleMeasure } from '../redux/slices/MeasureSlice';

// const waterPipelineCoordinates = [
//     { lat: 10.800400, lng: 106.667789},
//     { lat: 10.799821, lng: 106.6748162 },
//     { lat: 10.805398, lng: 106.678027},
//     { lat: 10.808258, lng: 106.673684},
//     { lat: 10.808157, lng: 106.673502},
//     {lat: 10.807814, lng: 106.673938    },
//     {lat: 10.807786, lng: 106.673896},
//     {lat: 10.808121, lng: 106.673452},
//     {lat: 10.808008, lng: 106.673250},
//     // Thêm các tọa độ khác nếu cần
// ];

function haversineDistance(latlng1, latlng2) {
    const R = 6371; // Bán kính Trái Đất theo km
    const dLat = (latlng2.lat - latlng1.lat) * (Math.PI / 180);
    const dLng = (latlng2.lng - latlng1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latlng1.lat * (Math.PI / 180)) *
        Math.cos(latlng2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function Map() {
    const center = useSelector(state => state.map.center);
    const zoom = useSelector(state => state.map.zoom);
    const [myLat, setMyLat] = useState(center.lat);
    const [myLng, setMyLng] = useState(center.lng);
    const [activeMarker, setActiveMarker] = useState(null);
    const mapRef = useRef(null);
    const area = useSelector(state => state.area.area);
    const dispatch = useDispatch();
    const measurePath = useSelector(state => state.measure.path);
    const measure = useSelector(state => state.measure.measure);
    const measureValue = useSelector(state => state.measure.value);
    const measureType = useSelector(state => state.measure.type);

    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        language: "vi",
    })

    const handleChangeArea = (e) => {
        if (e.value != "TP Hồ Chí Minh"){
            const points = geojson.features.filter((feature => (feature.geometry.type == "Point" && feature.properties["@relations"])));
            const point = points.find((feature => (feature.properties["@relations"][0].reltags.name == e.value))).geometry.coordinates;
            dispatch(changeArea(e.value));
            dispatch(changeCenter({
                lat: point[1],
                lng: point[0]
            }));
            if (e.value.slice(0, 4) != "Quận") {
                dispatch(changeZoom(11));
            }
            else {
                dispatch(changeZoom(13));
            }
        }
        else {
            dispatch(changeArea(e.value));
            dispatch(changeCenter({lat: 10.762622, lng: 106.660172}));
            dispatch(changeZoom(10));
        }
    }

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

    const handleMapClick = (event) => {
        if (measure) {
            const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            const newPath = [...measurePath, newPoint];
            if (measureType == 'Khoảng cách'){
                if (measurePath.length > 0) {
                    const lastPoint = measurePath[measurePath.length - 1];
                    const newDistance = haversineDistance(lastPoint, newPoint);
                    dispatch(changeValue(measureValue + newDistance));
                }
            }
            dispatch(changePath(newPath));
            if (measureType == 'Diện tích'){
                const google = window.google;
                dispatch(changeValue(google.maps.geometry.spherical.computeArea(newPath.map(coord => new google.maps.LatLng(coord.lat, coord.lng)))));
            }
        }
    };

    const handleMeasure = () => {
        if (measure) {
            dispatch(changeType("Khoảng cách"));
            dispatch(changePath([]));
            dispatch(changeValue(0));
        }
        dispatch(toggleMeasure());
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
            onClick={handleMapClick}
        >
            {/* Phân vùng */}
            {
                ! measure
                &&
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
            {/* <PolylineF
                path={waterPipelineCoordinates}
                options={{strokeColor: "#e60be6", //viền
                    strokeOpacity: 1,
                    strokeWeight: 2,}}
            /> */}
            {/* Vị trí của tôi */}
            <MarkerF
                    position={{lat: myLat, lng: myLng}}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/6597/6597982.png",
                        scaledSize: { width: 30, height: 30 }
                    }}
            >
            </MarkerF>
            {
                measure 
                && 
                (
                measureType == 'Khoảng cách'
                ?
                <Fragment>
                    {measurePath.map((path, index) => <MarkerF key={index} position={{lat: path.lat, lng: path.lng}} icon={{ url:"https://cdn-icons-png.flaticon.com/512/5632/5632543.png", scaledSize: { width: 20, height: 20 }}}/>)}
                    <PolylineF path={measurePath} options={{strokeColor: "#0000FF", strokeOpacity: 1, strokeWeight: 2,}} />
                </Fragment>
                :
                <Fragment>
                    {measurePath.map((path, index) => <MarkerF key={index} position={{lat: path.lat, lng: path.lng}} icon={{ url:"https://cdn-icons-png.flaticon.com/512/5632/5632543.png", scaledSize: { width: 20, height: 20 }}}/>)}
                    <PolygonF path={measurePath} options={{strokeColor: "#0000FF", strokeOpacity: 1, strokeWeight: 2,}} />
                </Fragment>
                )
            }
        </GoogleMap>
        <button className='absolute right-[10px] top-[calc(100vh-250px)] bg-white hover:bg-gray-100 w-[40px] h-[40px] rounded-sm grid place-content-center hover:opacity-80' onClick={handleMyPositon}>
            <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" className='w-[30px] h-[30px]'/>
        </button>
        {
            measure
            ?
            <button className='absolute right-[10px] top-[calc(100vh-300px)] bg-white hover:bg-gray-100 w-[40px] h-[40px] rounded-sm grid place-content-center hover:opacity-80 border-[#FD573A] border-[4px] text-white' onClick={handleMeasure}>
                <img src="https://cdn-icons-png.flaticon.com/512/1150/1150852.png" className='w-[30px] h-[30px]'/>
            </button>
            :
            <button className='absolute right-[10px] top-[calc(100vh-300px)] bg-white hover:bg-gray-100 w-[40px] h-[40px] rounded-sm grid place-content-center hover:opacity-80' onClick={handleMeasure}>
                <img src="https://cdn-icons-png.flaticon.com/512/1150/1150852.png" className='w-[30px] h-[30px]'/>
            </button>
        }
        
        <div className="absolute w-[200px] left-[10px] top-[10px] block md:hidden">
            <Select
                defaultValue={{value: "TP Hồ Chí Minh", label: "TP Hồ Chí Minh"}}
                value={{value: area, label: area}}
                onChange={handleChangeArea}
                styles={{control: (styles) => ({ ...styles, borderColor: '#2F85D6', borderRadius: "0px", '&:hover': {borderColor: 'blue'},}),}}
                options={[
                    {value: "TP Hồ Chí Minh", label: "TP Hồ Chí Minh"},
                    {value: "Quận 1", label: "Quận 1"},
                    {value: "Quận 3", label: "Quận 3"},
                    {value: "Quận 4", label: "Quận 4"},
                    {value: "Quận 5", label: "Quận 5"},
                    {value: "Quận 6", label: "Quận 6"},
                    {value: "Quận 7", label: "Quận 7"},
                    {value: "Quận 8", label: "Quận 8"},
                    {value: "Quận 10", label: "Quận 10"},
                    {value: "Quận 11", label: "Quận 11"},
                    {value: "Quận 12", label: "Quận 12"},
                    {value: "Quận Tân Bình", label: "Quận Tân Bình"},
                    {value: "Quận Bình Tân", label: "Quận Bình Tân"},
                    {value: "Quận Bình Thạnh", label: "Quận Bình Thạnh"},
                    {value: "Quận Tân Phú", label: "Quận Tân Phú"},
                    {value: "Quận Gò Vấp", label: "Quận Gò Vấp"},
                    {value: "Quận Phú Nhuận", label: "Quận Phú Nhuận"},
                    {value: "Huyện Bình Chánh", label: "Huyện Bình Chánh"},
                    {value: "Huyện Hóc Môn", label: "Huyện Hóc Môn"},
                    {value: "Huyện Cần Giờ", label: "Huyện Cần Giờ"},
                    {value: "Huyện Củ Chi", label: "Huyện Củ Chi"},
                    {value: "Huyện Nhà Bè", label: "Huyện Nhà Bè"},
                    {value: "Thành phố Thủ Đức", label: "Thành phố Thủ Đức"},
                ]}
            />
        </div>
    </div>
    )
}

export default Map;