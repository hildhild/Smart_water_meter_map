import { useState } from "react";


function SidebarExample() {
    const [dropdown, setDropdown] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState([]);
    // const toggleDropdown = () => {
    //     setDropdown(!dropdown);
    // }
    // const handleSelectMeter = (e) => {
    //     const value = e.target.value
    //     if (value === 'all' && e.target.checked) {
    //         setSelectedMeter(["1","2","3","4","5"]);
    //     }
    //     else if (value === 'all' && !e.target.checked) {
    //         setSelectedMeter([]);
    //     }
    //     else if (!selectedMeter.includes(value)) {
    //         setSelectedMeter([...selectedMeter, value]);
    //     }
    //     else {
    //         setSelectedMeter(prevState => prevState.filter(item => item !== value));
    //     }
    // }

    return (
        <div className="absolute right-0 w-[350px] h-[100vh] p-[14px] bg-[#2F85D6] hidden md:block overflow-y-auto" onClick={() => setDropdown(false)}>
            <div className="flex py-[15px] border-b-[2px] border-[white] px-[40px]">
                <img src="https://cdn-icons-png.flaticon.com/512/2482/2482574.png" className="w-[50px] h-[50px]"/>
                <div className="text-white font-semibold text-xl ml-[5px] text-center">Bản đồ Đồng hồ nước thông minh</div>
            </div>
            <form className="w-full">
                <div className="text-[white] py-[15px] font-semibold text-[14px]">Khu vực:</div>
                <select name="area" id="area" className="w-full p-[8px] outline-none cursor-pointer" defaultValue={"TP Hồ Chí Minh"}>
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
                    <option value={"Huyện Nhà bè"}>Huyện Nhà bè</option>
                    <option value={"Thành phố Thủ Đức"}>Thành phố Thủ Đức</option>
                </select>
            </form>
            {/* <form className="w-full">
                <div className="text-[white] py-[15px] font-semibold text-[14px]">Đồng hồ:</div>
                <select name="area" id="area" className="w-full p-[8px] outline-none" defaultValue={1}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </form> */}
            {/* <div className="text-[white] py-[15px] font-semibold text-[14px]">Đồng hồ:</div>
            <div className="w-full bg-white grid grid-cols-12 items-center p-[8px] h-[39.2px] cursor-pointer" onClick={(e) => {e.stopPropagation(); toggleDropdown();}}>
                <div className="col-span-11 text-start">{selectedMeter.length == 0 ? "Vui lòng chọn" : selectedMeter.toString()}</div>
                <div className="col-span-1 text-center">v</div>
            </div>
            { 
                dropdown 
                && 
                <div className="absolute top-[285px] bg-white rounded-md w-[calc(100%-28px)] p-[10px] shadow" onClick={(e) => e.stopPropagation()}>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="all" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.length == 5}/></label>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="1" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.includes("1")}/>1</label>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="2" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.includes("2")}/>2</label>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="3" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.includes("3")}/>3</label>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="4" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.includes("4")}/>4</label>
                    <label className="block cursor-pointer hover:bg-[#fafafa] px-[15px]"><input type="checkbox" value="5" className="mr-[10px]" onChange={handleSelectMeter} checked={selectedMeter.includes("5")}/>5</label>
                </div>
            } */}
            <div className="w-full">
                <div className="text-[white] py-[15px] font-semibold text-[14px]">Thông tin số lượng:</div>
                <table className="w-full bg-white border-[1px] border-white">
                    <thead className="bg-[#2F85D6] text-white">
                        <tr className="border-b-[1px] border-[#ccc]">
                            <th colSpan={2}>Đồng hồ 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-[1px] border-[#ccc]">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Diện tích (ha)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                        <tr className="">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Số lượng (đồng hồ)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full bg-white border-[1px] border-white">
                    <thead className="bg-[#2F85D6] text-white">
                        <tr className="border-b-[1px] border-[#ccc]">
                            <th colSpan={2}>Đồng hồ 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-[1px] border-[#ccc]">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Diện tích (ha)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                        <tr className="">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Số lượng (đồng hồ)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full bg-white border-[1px] border-white">
                    <thead className="bg-[#2F85D6] text-white">
                        <tr className="border-b-[1px] border-[#ccc]">
                            <th colSpan={2}>Đồng hồ 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-[1px] border-[#ccc]">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Diện tích (ha)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                        <tr className="">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Số lượng (đồng hồ)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full bg-white border-[1px] border-white">
                    <thead className="bg-[#2F85D6] text-white">
                        <tr className="border-b-[1px] border-[#ccc]">
                            <th colSpan={2}>Đồng hồ 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-[1px] border-[#ccc]">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Diện tích (ha)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                        <tr className="">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Số lượng (đồng hồ)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full bg-white border-[1px] border-white">
                    <thead className="bg-[#2F85D6] text-white">
                        <tr className="border-b-[1px] border-[#ccc]">
                            <th colSpan={2}>Đồng hồ 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b-[1px] border-[#ccc]">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Diện tích (ha)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                        <tr className="">
                            <td className="px-[5px] border-r-[1px] border-[#ccc] w-[70%]">Số lượng (đồng hồ)</td>
                            <td className="px-[5px]">68</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> 
    );
}

export default SidebarExample;