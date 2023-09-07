import { Button } from "@mui/material";
import { createTheme,ThemeProvider } from "@mui/material";

const customThemeBtn = createTheme({
    palette:{
        primary:{
            main:"#768463"
        }
    }
})

const ContainedButton = ({children,onClick,width="150px",height="40px",fontSize="16px",lineHeight="27.24px",mr="1.3rem",mt=0})=>{
    return <ThemeProvider theme={customThemeBtn}>
        <Button
        variant='contained'
        onClick={onClick}
        sx={{width,textTransform:"none",height,fontWeight:700,fontFamily:"poppins",ml:"0.5rem",mr,mt,
        fontSize,
        lineHeight   
    }}
    >
        {children}
    </Button>
  </ThemeProvider>
}

export default ContainedButton;