import { Container } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppBar";
import SearchBar from "../components/SearchBar";
import LabelBottomNavigation from "../components/LabelBottomNavigation";

export default function Dashboard() {
    return (
      <div className="container">
        <DrawerAppBar/>
      <Container sx={{p:3}}>
        <div className="search">
          {/* <SearchBar/> */}
        </div>
      </Container>

      <LabelBottomNavigation/>

      </div>
    );

};
