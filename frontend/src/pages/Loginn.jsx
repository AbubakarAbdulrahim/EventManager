import { Container } from "@mui/material";
import { Box } from "@mui/material";


export default function Login() {
  return (
    <Container sx={{display: "flex", justifyContent: "center", alignItems:'center', bgcolor: "#03304320", p:0, minWidth:'100%', minHeight:'100vh', m:0}}>
      <Box sx={{display: "flex", justifyContent: "center", alignItems:'center', flexDirection:'column', p:3, height:'100%', bgcolor:'#fff'}}>
        <img src="/logo.png"/>
        <h1>Welcome Back!</h1>
        

      </Box>
    </Container>
  );
    
};
