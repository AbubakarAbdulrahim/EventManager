// import BookingDialog from "../components/BookingDialog";

import EventPlanningDashboard from "../components/EventPlanning";
import SearchBar from "../components/SearchBar";
import BookingProcess from "../components/BookingProcess";



export default function LandingPage() {
    return (
      <div>
        <h1>Landing Page</h1>
        <SearchBar/>
        {/* <EventPlanningDashboard/> */}
        <BookingProcess/>
        
        {/* <BookingDialog open={true} service={{ id: 1, name: 'Catering', price: 500 }}/> */}
        {/* <ErrorDialog open={true}  title={"Registration failed"}/> */}

        {/* <FlutterwaveDemo/> */}
        {/* <BookingDialog service={{title:"venue"}}/> */}
      </div>
    );
};
