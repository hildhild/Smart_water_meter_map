import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeArea } from "../redux/slices/AreaSlice";
import { geojson } from "../data/geojson";
import { changeCenter, changeZoom } from "../redux/slices/MapSlice";
import { areaImage } from "../data/areaImage";
import { waterMeter } from "../data/waterMeter";
import Select from 'react-select';

function Sidebar() {
    const area = useSelector(state => state.area.area);
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

    return (
        <div className="absolute right-0 w-[350px] h-[100vh] p-[14px] bg-[#EBFAFF] hidden md:block overflow-y-auto">
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
            <form className="w-full mb-[15px]">
                <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Khu vực:</div>
                {/* <select name="area" id="area" className="w-full p-[8px] outline-none cursor-pointer border-[#2F85D6] border-[1px]" value={area} onChange={handleChangeArea}>
                    <option value={"TP Hồ Chí Minh"}>TP Hồ Chí Minh</option>
                    <option value={"Quận 1"}>Quận 1</option>
                    <option value={"Quận 3"}>Quận 3</option>
                    <option value={"Quận 4"}>Quận 4</option>
                    <option value={"Quận 5"}>Quận 5</option>
                    <option value={"Quận 6"}>Quận 6</option>
                    <option value={"Quận 7"}>Quận 7</option>
                    <option value={"Quận 8"}>Quận 8</option>
                    <option value={"Quận 10"}>Quận 10</option>
                    <option value={"Quận 11"}>Quận 11</option>
                    <option value={"Quận 12"}>Quận 12</option>
                    <option value={"Quận Tân Bình"}>Quận Tân Bình</option>
                    <option value={"Quận Bình Tân"}>Quận Bình Tân</option>
                    <option value={"Quận Bình Thạnh"}>Quận Bình Thạnh</option>
                    <option value={"Quận Tân Phú"}>Quận Tân Phú</option>
                    <option value={"Quận Gò Vấp"}>Quận Gò Vấp</option>
                    <option value={"Quận Phú Nhuận"}>Quận Phú Nhuận</option>
                    <option value={"Huyện Bình Chánh"}>Huyện Bình Chánh</option>
                    <option value={"Huyện Hóc Môn"}>Huyện Hóc Môn</option>
                    <option value={"Huyện Cần Giờ"}>Huyện Cần Giờ</option>
                    <option value={"Huyện Củ Chi"}>Huyện Củ Chi</option>
                    <option value={"Huyện Nhà Bè"}>Huyện Nhà Bè</option>
                    <option value={"Thành phố Thủ Đức"}>Thành phố Thủ Đức</option>
                </select> */}
                <Select
                    defaultValue={{value: "TP Hồ Chí Minh", label: "TP Hồ Chí Minh"}}
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
    );
}

export default Sidebar;