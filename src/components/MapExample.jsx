import { GoogleMap, useJsApiLoader, InfoWindowF, MarkerF, PolygonF } from '@react-google-maps/api';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchDistrictBoundaries } from '../services/fetchDistrictBoundaries';
import {geojson} from '../data/geojson';

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


function MapExample() {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [myLat, setMyLat] = useState(0);
    const [myLng, setMyLng] = useState(0);
    const [activeMarker, setActiveMarker] = useState(null);
    const [zoom, setZoom] = useState(10);
    const mapRef = useRef(null);
    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_KEY,
        googleMapsApiKey: import.meta.env.VITE_KEY
    })
    // const [path, setPath] = useState([]);

    const handleMyPositon = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setZoom(16)
                setMyLat(position.coords.latitude);
                setLat(position.coords.latitude);
                setMyLng(position.coords.longitude);
                setLng(position.coords.longitude); 
            });
        }
    };
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMyLat(position.coords.latitude);
                setLat(position.coords.latitude);
                setMyLng(position.coords.longitude);
                setLng(position.coords.longitude); 
            });
        }
        // const localData = localStorage.getItem("googleMapPolygonF");
        // if (localData) {
        //     const parsedData = JSON.parse(localData);
        //     setPath(parsedData);
        // }
        // const loadData =  async () => {
        //     const data = await fetchDistrictBoundaries();
        //     setRanhgioi(data);
        // }
        // loadData();
    }, []);

    // console.log(1, ranhgioi)
    
    // const addPointToPath = (e) => {
    //     setActiveMarker(null);
    //     try {
    //         const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    //         setLat(e.latLng.lat());
    //         setLng(e.latLng.lng());
    //         const mergedData = [...path, latLng];
    //         setPath(mergedData);
    //         localStorage.setItem("googleMapPolygonF", JSON.stringify(mergedData));
    //     } catch (error) {
    //         console.error("addPointToPath error", error);
    //     }
    // };
    
    // const removeItem = (index) => {
    //     const arr = [...path];
    //     arr.splice(index, 1);
    //     setPath(arr);
    //     setLat(arr[index].lat);
    //     setLng(arr[index].lng);
    //     localStorage.setItem("googleMapPolygonF", JSON.stringify(arr));
    // };
    

    // const handleActiveMarker = (marker) => {
    //     if (marker === activeMarker) {
    //       return;
    //     }
    //     setActiveMarker(marker);
    // };

    const handleZoomChanged =  useCallback(() => {
        if (mapRef.current) {
            setZoom(mapRef.current.getZoom());
            setLat(mapRef.current.center.lat());
            setLng(mapRef.current.center.lng());
        }
    }, []);



    return isLoaded && (<div className='w-[100vw] md:w-[calc(100vw-350px)] h-[100vh] relative'>
        <GoogleMap
            mapContainerStyle={{
                width: "100%",
                height: "100%"
            }}
            center={{
                lat: lat,
                lng: lng
            }}
            zoom={zoom}
            // onClick={addPointToPath}
            onLoad={map => mapRef.current = map}
            onZoomChanged={handleZoomChanged}
        >
            {geojson &&
                geojson.features.filter((feature => feature.geometry.type == "Polygon")).map((feature, index) => {
                    const coordinates = feature.geometry.coordinates[0].map(coord => ({
                        lat: coord[1],
                        lng: coord[0],
                }));
                return <PolygonF 
                        key={index}
                        paths={coordinates}
                        options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            backgroundColor: "#000"
                        }}
                    />;
            })}
            {/* <PolygonF
                path={path}
                options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                }}
            /> */}
            {/* {path.map((item, i) => (
                <MarkerF 
                    key={i} 
                    position={item} 
                    onClick={() => removeItem(i)} 
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/0/619.png",
                        scaledSize: { width: 10, height: 10 }
                      }} 
                />
            ))} */}
            {markers.map(({ id, name, position }) => (
                <MarkerF
                    key={id}
                    position={position}
                    onClick={() => handleActiveMarker(id)}
                    icon={{
                        url:"https://cdn-icons-png.flaticon.com/512/2482/2482574.png",
                        scaledSize: { width: 50, height: 50 }
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

    // return (
    //     <div className="w-[100vh] md:w-[calc(100vw-350px)] relative h-[100vh]">
    //         {/* <form className=" absolute top-[14px] left-[14px] border-solid border-[1px]">
    //             <input type="text" placeholder="Tìm kiếm khu vực" className="h-[40px] py-[6px] px-[11px] w-[290px]"></input>
    //             <input type="submit" className="h-[40px]  py-[6px] px-[11px] border-l-[1px] border-solid bg-[#F8F9FA] hover:bg-[#ccc] cursor-pointer" value="Tìm"/>
    //         </form>
    //         <div className="absolute top-[14px] right-[14px] flex">
    //             <button className="bg-white w-[90px] px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc] font-semibold text-[16px]">Bản đồ</button>
    //             <button className="bg-white w-[90px] px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc] font-semibold text-[16px]">Vệ tinh</button>
    //         </div>
    //         <div className="absolute bottom-[14px] bg-[transparent] flex justify-center">
    //             <button className="bg-white px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc]">Nhà vườn</button>
    //             <button className="bg-white px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc]">Doanh nghiệp</button>
    //             <button className="bg-white px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc]">Hội quán</button>
    //             <button className="bg-white px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc]">VietGAP</button>
    //             <button className="bg-white px-[17px] border-solid border-[1px] h-[40px] hover:bg-[#ccc]">GlobalGAP</button>
    //         </div> */}
    //         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244.97009116156732!2d106.65587932161434!3d10.771315919177122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f8845992961%3A0xdfbce149533bb973!2zQ8O0bmcgdHkgQ-G7lSBwaOG6p24gVmlldG5hbSBCbG9ja2NoYWlu!5e0!3m2!1svi!2s!4v1721961065836!5m2!1svi!2s" width="100%" height="100%" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="border-0"></iframe>
    //         {/* <iframe  src="https://www.google.com/maps/d/embed?mid=1PYTR6x9RC5RHsxH5rYDGv60nEM15AUE&ehbc=2E312F&noprof=1" width="100%" height="100%" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="border-0"></iframe> */}
    //         {/* <GoogleMap
    //             defaultZoom={10}
    //             defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
    //             className="w-full h-full"
    //         >

    //         </GoogleMap> */}
    //     </div> 
    // )
    
}

export default MapExample;