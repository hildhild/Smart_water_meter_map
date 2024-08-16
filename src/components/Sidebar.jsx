import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeArea } from "../redux/slices/AreaSlice";
import { geojson } from "../data/geojson";
import { changeCenter, changeZoom } from "../redux/slices/MapSlice";
import { areaImage } from "../data/areaImage";
import { waterMeter } from "../data/waterMeter";
import Select from 'react-select';
import { changeValue, changePath, changeType, toggleMeasure } from "../redux/slices/MeasureSlice";

function Sidebar() {
    const area = useSelector(state => state.area.area);
    const measure = useSelector(state => state.measure.measure);
    const measureValue = useSelector(state => state.measure.value);
    const measureType = useSelector(state => state.measure.type);
    const dispatch = useDispatch();

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

    const handleResetPath = () => {
        dispatch(changePath([]));
        dispatch(changeValue(0));
    }

    const handleChangeMeasureType = (e) => {
        dispatch(changePath([]));
        dispatch(changeValue(0));
        dispatch(changeType(e.value));
    }

    const handleMeasure = () => {
        if (measure) {
            dispatch(changeType("Khoảng cách"));
            dispatch(changePath([]));
            dispatch(changeValue(0));
        }
        dispatch(toggleMeasure());
    }

    return (
        <div className="absolute right-0 w-0 md:w-[350px] h-[100vh] p-[14px] bg-[#EBFAFF] hidden md:block overflow-y-auto">
            <div className="py-[15px] border-b-[2px] border-[#2F85D6]">
                <div className="flex px-[10px] pb-[20px]">
                    <div className="flex items-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/2482/2482574.png" className="w-[100px]"/>
                    </div>
                    <div className="ml-[5px] w-full">
                        <div className="text-start italic text-xl text-[#FD573A] font-bold">Bản đồ</div>
                        <div className="text-[#2F85D6] text-center text-3xl font-bold">Đồng hồ nước thông minh</div>
                    </div>
                </div>
                <div className="text-right text-[14px]"><strong>Địa bàn:</strong> Thành phố Hồ Chí Minh</div>
            </div>
            {
                ! measure
                ?
                <div>
                    <form className="w-full mb-[15px]">
                        <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Khu vực:</div>
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
                    </form>
                    <div className="w-full">
                        <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Thống kê:</div>
                        <table className="w-full bg-white border-[1px] border-[#2F85D6]">
                            <tbody>
                                <tr className="border-b-[1px] border-[#2F85D6]">
                                    <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[60%]">Số lượng (đồng hồ)</td>
                                    <td className="px-[5px]">{area == "TP Hồ Chí Minh"? waterMeter.length :waterMeter.filter(item => item.area == area).length}</td>
                                </tr>
                                <tr className="">
                                    <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[60%]">Tổng lượng nước (m<sup>3</sup>)</td>
                                    <td className="px-[5px]">{area == "TP Hồ Chí Minh" ? waterMeter.reduce((total, currentMeter) => (total + currentMeter.value), 0) : waterMeter.filter(item => item.area == area).reduce((total, currentMeter) => (total + currentMeter.value), 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="absolute bottom-[14px] right-0 w-full flex justify-center ">
                        <img src={areaImage[area]} className="w-[calc(100%-28px)] h-[180px] object-cover rounded-2xl"/>
                    </div>
                </div>
                :
                <div>
                    <div className="text-[#FD573A] pt-[15px]"><strong>Hướng dẫn: </strong>Nhấp vào bản đồ để thêm vào con đường của bạn</div>
                    <form className="w-full mb-[15px]">
                        <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Tùy chọn:</div>
                        <Select
                            defaultValue={{value: "Khoảng cách", label: "Khoảng cách"}}
                            value={{value: measureType, label: measureType}}
                            onChange={handleChangeMeasureType}
                            styles={{control: (styles) => ({ ...styles, borderColor: '#2F85D6', borderRadius: "0px", '&:hover': {borderColor: 'blue'},}),}}
                            options={[
                                {value: "Khoảng cách", label: "Khoảng cách"},
                                {value: "Diện tích", label: "Diện tích"},
                            ]}
                        />
                    </form>
                    {
                        measureType == 'Khoảng cách'
                        ?
                        <div>
                            <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Khoảng cách:</div>
                            <table className="w-full bg-white border-[1px] border-[#2F85D6]">
                                <tbody>
                                    <tr className="border-b-[1px] border-[#2F85D6]">
                                        <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[60%]">{(measureValue < 1) ? (measureValue*1000).toFixed(2) : measureValue.toFixed(2)} {(measureValue < 1) ? <p className="inline-block">m</p> : <p className="inline-block">km</p>}</td>
                                        <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[40%] text-center"><button className="font-semibold hover:text-[#FD573A]" onClick={handleResetPath}>Reset</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        :
                        <div>
                            <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Diện tích:</div>
                            <table className="w-full bg-white border-[1px] border-[#2F85D6]">
                                <tbody>
                                    <tr className="border-b-[1px] border-[#2F85D6]">
                                        <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[60%]">{(measureValue < 1000000) ? (measureValue).toFixed(2) : (measureValue/1000000).toFixed(2)} {(measureValue < 1000000) ? <p className="inline-block">m<sup>2</sup></p> : <p className="inline-block">km<sup>2</sup></p>}</td>
                                        <td className="px-[5px] border-r-[1px] border-[#2F85D6] w-[40%] text-center"><button className="font-semibold hover:text-[#FD573A]" onClick={handleResetPath}>Reset</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    <button className="font-semibold w-full bg-[#2F85D6] text-white mt-[30px] rounded-md p-[5px] hover:opacity-80" onClick={handleMeasure}>Thoát</button>
                </div>
            }
        </div> 
    );
}

export default Sidebar;