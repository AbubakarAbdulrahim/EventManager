import BookingDialog from "../components/BookingDialog";

import EventPlanningDashboard from "../components/EventPlanning";
import SearchBar from "../components/SearchBar";
import BookingProcess from "../components/BookingProcess";
import FlutterwaveDemo from "../components/FlutterDemo";
import SuccessDialog from "../components/SuccessDialog";

export default function LandingPage() {
    return (
      <div>
        <h1>Landing Page</h1>
        <SearchBar/>
        {/* <EventPlanningDashboard/> */}
        <BookingProcess/>
        <SuccessDialog/>
        {/* <FlutterwaveDemo/> */}
        {/* <BookingDialog service={{title:"venue"}}/> */}
      </div>
    );
};
