import { useState } from "react"
import {Box,Typography,Grid,ThemeProvider,createTheme,Button} from "@mui/material"
import jwt from "jsonwebtoken"
import { useRouter } from "next/router"
import { gql } from "@apollo/client"
import SideBar from "../../components/sidebar"
import ManagementAppbar from "../../components/ManagementAppbar"
import { LocaleLanguage } from "../../utils/LanguageContext";
import EmployeeCard from "../../components/employeeCard"
import Modal from "../../components/modal"
import client from "../../utils/ApolloServer"
import { translateWord } from "../../utils/languageTranslation"

const customTheme = createTheme({
    palette:{
        primary:{
           main:"#629460" 
        }
    }
})

const Employees = ({locale,employees,token})=>{
    const [drawerState,setDrawerState] = useState(false) 
    const [openModal,setOpenModal] = useState(false)
    const [employeeID,setEmployeeID] = useState("")
    const [employeeName,setEmployeeName] = useState("")
    const [employeeRole,setEmployeeRole] = useState("")
    const [employeePhone,setEmployeePhone] = useState([])
    const [employeePlateNumber,setEmployeePlateNumber] = useState("")
    const router = useRouter()

    const openModalOnClick = (name,role,phoneNumber,plateNumber)=>{
        setEmployeeName(name)
        setEmployeeRole(role)
        setEmployeePhone(phoneNumber)
        setEmployeePlateNumber(plateNumber)
        setOpenModal(true)
    }

    const goToAddNewEmployeePage = ()=>{
        router.push("employees/createNew")
    }

    return (<ThemeProvider theme={customTheme}>
    <LocaleLanguage.Provider value={{locale,token}}>
        <ManagementAppbar setDrawerState={setDrawerState} role={token.role}/>
        <SideBar drawerState={drawerState} companyName={token.name} role={token.role}/>
        <Box onClick={()=>setDrawerState(false)} sx={{display:{xs:drawerState?"block":"none",md:"none"},position:"fixed",top:"0",right:"0",bottom:"0",height:"100vh",width:"115vh",background:"rgba(0,0,0,0.5)",zIndex:"99"}}></Box>
        <Box sx={{ml:{md:"20vw"},pt:"7rem",px:{md:"2rem",xs:"1rem"},background:"#F5F5F5",height:"100vh",mb:"1rem",pl:5}}>
        <Box sx={{ml:{md:5,xs:2},display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Typography variant="h4" sx={{fontWeight:"700"}}>{translateWord(locale,"Staff")}</Typography>
            <Button variant="outlined" sx={{textTransform:"none",width:{md:"160px",xs:"120px"}}} onClick={goToAddNewEmployeePage}>{translateWord(locale,"Add New Employee")}</Button>
        </Box>
            <Box sx={{display:"grid",gridTemplateColumns:{md:"auto auto auto",xs:"auto"},justifyContent:{md:"normal",xs:"center"},rowGap:5}}>
                {employees.map((obj)=>{
                    if(token["role"]==="BUS COMPANY"){
                        return <EmployeeCard key={obj._id} name={obj.name} role={obj.role} phoneNumber={obj.phoneNumber} busPlate={obj.plateNumber} id={obj._id} openModal={()=>openModalOnClick(obj.name,obj.role,obj.phoneNumber,obj.plateNumber)}/>
                    }
                    if(obj.role!=="TRIP MANAGER"||(obj.role==="TRIP MANAGER"&&obj.phoneNumber[0]===token["phoneNumber"]))
                    return <EmployeeCard key={obj._id} name={obj.name} role={obj.role} phoneNumber={obj.phoneNumber} busPlate={obj.plateNumber} id={obj._id} openModal={()=>openModalOnClick(obj.name,obj.role,obj.phoneNumber,obj.plateNumber)}/>
                })}
            </Box>
            <Modal open={openModal} setOpen={setOpenModal} employeeName={employeeName} employeePhone={employeePhone} employeeRole={employeeRole} employeeBusNumber={employeePlateNumber} employeeID={employeeID}/>
        </Box>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    );
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req,res} = ctx
    const token = req["cookies"]['token']
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    if(!token){
        return {
            redirect:{
                destination:"/",
                permanent: false
            }
        };
    }
    const tokenDecoded = jwt.verify(token,process.env.JWT_KEY)
    if(tokenDecoded.role!=="BUS COMPANY"&&tokenDecoded.role!=="TRIP MANAGER"){
        return {
            redirect:{
                destination:"/",
                permanent:false
            }
        };
    }
    const data = await client.query({
            query:gql`
            query allEmployeeOfTheBus($busCompanyId:ID!){
                allEmployeeOfTheBus(busCompanyId:$busCompanyId){
                    _id
                    name
                    phoneNumber
                    role
                    plateNumber
                }
            }`,variables:{
                busCompanyId:tokenDecoded._id
            }
    })
    return {
        props:{locale:nextLocale||locale,
            employees:data["data"]["allEmployeeOfTheBus"],
            token:tokenDecoded
        }
    }
}

export default Employees