import { useState } from "react";
import { Container } from "@mui/material";
import DrawerAppBar from "../../components/DrawerAppBar";
import SearchBar from "../../components/SearchBar";
import LabelBottomNavigation from "../../components/LabelBottomNavigation";
import EventPlanningDashboard from "../../components/EventPlanningDashboard";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
    return (
      <div className="container">
      <DrawerAppBar setSearchTerm ={setSearchTerm} />

      <EventPlanningDashboard searchTerm={searchTerm} />

      <LabelBottomNavigation/>

      </div>
    );

};
