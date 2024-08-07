import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeArea } from "../redux/slices/AreaSlice";
import { geojson } from "../data/geojson";
import { changeCenter, changeZoom } from "../redux/slices/MapSlice";
import { areaImage } from "../data/areaImage";
import { waterMeter } from "../data/waterMeter";

function Sidebar() {
    const area = useSelector(state => state.area.area);
    const dispatch = useDispatch();

    const handleChangeArea = (e) => {
        if (e.target.value != "TP Hồ Chí Minh"){
            const points = geojson.features.filter((feature => (feature.geometry.type == "Point" && feature.properties["@relations"])));
            const point = points.find((feature => (feature.properties["@relations"][0].reltags.name == e.target.value))).geometry.coordinates;
            dispatch(changeArea(e.target.value));
            dispatch(changeCenter({
                lat: point[1],
                lng: point[0]
            }));
            if (e.target.value.slice(0, 4) != "Quận") {
                dispatch(changeZoom(11));
            }
            else {
                dispatch(changeZoom(13));
            }
        }
        else {
            dispatch(changeArea(e.target.value));
            dispatch(changeCenter({lat: 10.762622, lng: 106.660172}));
            dispatch(changeZoom(10));
        }
    }

    return (
        <div className="absolute right-0 w-[350px] h-[100vh] p-[14px] bg-[#ECFBFF] hidden md:block overflow-y-auto">
            <div className="py-[15px] border-b-[2px] border-[#2F85D6]">
                <div className="flex px-[30px] pb-[30px]">
                    <img src="https://cdn-icons-png.flaticon.com/512/2482/2482574.png" className="w-[50px] h-[50px]"/>
                    <div className="text-[#2F85D6] font-semibold text-xl ml-[5px] text-center">Bản đồ Đồng hồ nước thông minh</div>
                </div>
                <div className="text-right text-[14px]"><strong>Địa bàn:</strong> Thành phố Hồ Chí Minh</div>
            </div>
            <form className="w-full mb-[15px]">
                <div className="text-[#2F85D6] py-[15px] font-semibold text-[14px]">Khu vực:</div>
                <select name="area" id="area" className="w-full p-[8px] outline-none cursor-pointer border-[#2F85D6] border-[1px]" value={area} onChange={handleChangeArea}>
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
                </select>
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