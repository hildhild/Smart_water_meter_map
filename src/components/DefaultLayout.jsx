import Sidebar from "./Sidebar";
import Map from "./Map";

function DefaultLayout() {

    return (
        <div className="flex">
            <Map/>
            <Sidebar/>
        </div>
    );
}

export default DefaultLayout;