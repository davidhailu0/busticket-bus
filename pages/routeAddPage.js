import { useState,useEffect } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import {Grid,IconButton,Typography,Box,Button} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "next/image"
import { useMutation,gql } from '@apollo/client';
import jwt from "jsonwebtoken"
import RouteCard from '../components/routeCard';
import SelectComponentWidth from '../components/SelectBox/customSelectWidth';
import AddRouteConfirm from '../components/confirmationDialog';
import oliveLogo from '../Assets/images/oliveLogo.png'
import { places } from '../utils/places';
import Client from "../utils/ApolloServer"
import { ToastContainer} from 'react-toastify';
import RouteDisplayDialog from '../components/routeDisplayModal';
import { NumberOfBusContext } from '../utils/numberOfBusesContext';
import { LocaleLanguage } from '../utils/LanguageContext';
import { languages,translateWord,changeLanguage} from '../utils/languageTranslation';
import Link from "next/link"
import { useRouter } from 'next/router';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCookie } from '../utils/cookies';

const MUTATEBUSCOMPANYUPDATE = gql`
    mutation updateBusCompany($inputID: ID!, $inputBusCompany:BusCompanyUpdateInput!,$activity:CreateActivityLog){
        updateBusCompany(id: $inputID, busCompany:$inputBusCompany,activity:$activity){
            _id
            name
            phoneNumber
            email
        }
    }
`

const RouteAddPage = ({locale,routeList,selectedRoutes,categorizedRoutes,token,numberOfBuses})=>{
    const [selectedRoute,setSelectedRoute] = useState("")
    const [selectedDestinations,setSelectedDestinations] = useState(categorizedRoutes)
    const [selectedRouteError,setSelectedRouteError] = useState(false)
    const [selectedCheckBox,setSelectedCheckBox] = useState(selectedRoutes.map(({_id})=>_id))
    const [newSelectedRoute,setNewSelectedRoute] = useState([])
    const [openFinishModal,setOpenFinishModal] = useState(false)
    const [openSelected,setOpenSelected] = useState(false)
    const [destinations,setDestinations] = useState(places[locale].filter(({name})=>name!=="Addis Ababa").filter(({name})=>!selectedRoutes.find(({departure,destination})=>departure===name||destination===name)))
    const [updateBusCompany] = useMutation(MUTATEBUSCOMPANYUPDATE)
    const [language,setLanguage] = useState(null)
    const [getCookie,setCookie,removeCookie] = useCookie()
    const router = useRouter()

    useEffect(()=>{
        const reduced = routeList.reduce((result,current)=>{
            if(current["departure"]===selectedRoute||current["destination"]===selectedRoute){
                return [...result,...current["subRoutes"],{_id:current["_id"],departure:current["departure"],subRoutes:current["subRoutes"],destination:current["destination"]}]
            }
            return result;
        },[])
        const filtered = destinations.filter(({name})=>name!=="Addis Ababa").filter(({name})=>!reduced.find(({destination})=>destination===name&&destination!==selectedRoute))
        setDestinations(filtered)
    },[selectedRoute])

    const customTheme = createTheme({
        palette:{
            primary:{
                main:"#629460",
            },
        }
    })

    const openLanguage = (event)=>{
        setLanguage(event.currentTarget)
    }
    
    const closeLanguage = ()=>{
        setLanguage(null)
    }

    const changeSelectedLanguage = (locale)=>{
        changeLanguage(locale,setCookie)
        closeLanguage()
    }

    const updateBusCompanyRoute = async()=>{
        await updateBusCompany({variables:{
            inputID:token._id,
            inputBusCompany:{
                routes:selectedCheckBox
            },
            activity:{
                companyId:token._id,
                name:token.accountName
            }
        }})
        setOpenFinishModal(true)
    }

    const handleSelectedRoute = (e)=>{
        setDestinations(places[locale].filter(({name})=>name!=="Addis Ababa"))
        setSelectedRouteError(false)
        setSelectedRoute(e.target.value)
    }

    const removeTheSelectedRoute = ()=>{
        if(selectedDestinations[selectedRoute]&&selectedDestinations[selectedRoute].length!==0){
            const filtered = destinations.filter(({name})=>name!=="Addis Ababa").filter(({name})=>name!==selectedRoute)
            setSelectedRoute("")
            setNewSelectedRoute([])
            setDestinations(filtered)
            setOpenFinishModal(close)
        }
       
    }

    const openSelectedOnClick = ()=>{
        setOpenSelected(true)
    }
    return (<ThemeProvider theme={customTheme}>
    <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
    />
    <LocaleLanguage.Provider value={{locale,token}}>
    <NumberOfBusContext.Provider value={{id:token._id,numberOfBuses,selectedDestinations,setSelectedDestinations,updateBusCompany,selectedRoute,selectedCheckBox,setSelectedCheckBox,setNewSelectedRoute}}>
    <Grid container sx={{fontFamily:"Open Sans"}}>
        <Grid item md={11} xs={11} sx={{pl:{md:10,xs:4},pt:"30px"}}>
            <Image src={oliveLogo.src} height={50} width={63}/>
        </Grid>
        <Grid item md={1} xs={1} sx={{display:"flex",justifyContent:"center",pt:"30px",pr:{md:0,xs:"1rem"}}}>
            <IconButton onClick={openLanguage}>
                <LanguageIcon sx={{color:"#629460"}}/>
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={language}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(language)}
              onClose={closeLanguage}
            >
              {languages.map(({lang,locale}) => {
                if(getCookie("NEXT_LOCALE")!==locale)
                return (
                <MenuItem key={lang} onClick={()=>changeSelectedLanguage(locale)}>
                  <Link href={router.asPath} locale={locale}><Typography textAlign="center">{lang}</Typography></Link>
                </MenuItem>
              )
              }
              )}
            </Menu>
        </Grid>
        <Grid item md={12} sx={{pl:{md:10,xs:4}}} mt="3rem">
            <Typography sx={{fontWeight:"700",fontSize:"24px",lineHeight:"43.58px"}}>{translateWord(locale,"Add Routes")}</Typography>
            <Typography sx={{color:"#A3A3A3"}}>{translateWord(locale,"Select routes that your company provides services to.")}</Typography>
            <Box sx={{display:"flex",flexDirection:{md:"row",xs:"column"},justifyContent:"space-between",alignItems:{md:"center",xs:"start"}}}>
                <SelectComponentWidth label={"Select Routes"} value={selectedRoute} setValue={handleSelectedRoute} error={selectedRouteError} setError={setSelectedRouteError} options={destinations}/>
                {selectedCheckBox.length!==0&&<Button variant='outlined' sx={{width:"197px",height:"60px",fontFamily:"Open Sans",textTransform:"none",mr:10}} onClick={openSelectedOnClick}>{translateWord(locale,"View Route Added")}</Button>}
            </Box>
            <Typography sx={{color:"#A3A3A3"}} mt={"0.5rem"}>{translateWord(locale,"Routes")}</Typography>
            
            <Box sx={{display:"grid",rowGap:2,height:"40vh",mr:5,overflowY:"auto"}}>
                {
                    routeList.reduce((result,current)=>{
                        if(current["departure"]===selectedRoute||current["destination"]===selectedRoute){
                            return [...result,...current["subRoutes"],{_id:current["_id"],departure:current["departure"],subRoutes:current["subRoutes"],destination:current["destination"]}]
                        }
                        return result;
                    },[]).map(rt=>{
                    return <RouteCard key={rt[0]} departure={rt["departure"]} destination={rt["destination"]} id={rt["_id"]} subRoutes={rt["subRoutes"]}/>})
                }
            </Box>
        </Grid>
        <Grid item md={12} sx={{display:"flex",justifyContent:"end",pr:17}}>
            {newSelectedRoute.length!==0&&<Button variant='contained' sx={{width:"197px",height:"60px",fontFamily:"Open Sans",fontSize:"24px",lineHeight:"33px",fontWeight:"bold",textTransform:"none"}} onClick={updateBusCompanyRoute}>{translateWord(locale,"Add")}</Button>}
        </Grid>
    </Grid>
    <AddRouteConfirm open={openFinishModal} setOpen={setOpenFinishModal} destination={selectedRoute} selectedDestinations={selectedDestinations} addAnotherCallBack={removeTheSelectedRoute}/>
    <RouteDisplayDialog open={openSelected} setOpen={setOpenSelected}/>
    </NumberOfBusContext.Provider>
    </LocaleLanguage.Provider>
    </ThemeProvider>
    )
}

export const getServerSideProps = async(ctx)=>{
    const {locale,req} = ctx;
    const nextLocale = req["cookies"]['NEXT_LOCALE']
    const token = req["cookies"]['token']
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
            permanent: false
          }
        };
    }

    const busCompany = await Client.query({
        query:gql`
        query busCompany($id:ID!){
            busCompany(id:$id){
                numberOfBuses
                routes{
                    departure
                }
            }
        }`,variables:{
            id:tokenDecoded._id
        }
    })
    const data = await Client.query({
        query:gql`query routes{
                routes{
                        _id
                        departure
                        destination
                        subRoutes{
                            _id
                            departure
                            destination
                            subRoutes{
                                _id
                                destination
                                departure
                            }
                        }
                    }
                }
            `
    })

    const routes = await Client.query({
        query:gql`
        query allRoutesOfBusCompany($busCompanyId:ID!){
            allRoutesOfBusCompany(busCompanyId:$busCompanyId){
                _id
                departure
                destination
                subRoutes{
                    _id
                    departure
                    destination
                    subRoutes{
                        _id
                        destination
                        departure
                    }
                }
            }
        }`,variables:{
            busCompanyId:tokenDecoded._id
        }
    })
    const categorizedRoutes = {}
    for(let rt of routes["data"]["allRoutesOfBusCompany"]){
        if(rt["subRoutes"].length===0){
            const foundedInSubroute = routes["data"]["allRoutesOfBusCompany"].find(({subRoutes})=>subRoutes.find(({destination})=>rt["destination"]===destination))
            if(foundedInSubroute){
                if(categorizedRoutes[foundedInSubroute["destination"]]){
                    categorizedRoutes[foundedInSubroute["destination"]] = [...categorizedRoutes[foundedInSubroute["destination"]],rt]
                }
                else{
                    categorizedRoutes[foundedInSubroute["destination"]] = [rt]
                }
            }
            else{
                categorizedRoutes[rt["destination"]] = [rt]
            }
        }
        else{
            const foundedInSubroute = routes["data"]["allRoutesOfBusCompany"].find(({subRoutes})=>subRoutes.find(({destination})=>rt["subRoutes"][0]["destination"]===destination))
            if(foundedInSubroute["subRoutes"].length>rt["subRoutes"].length){
                categorizedRoutes[foundedInSubroute["destination"]] = [...foundedInSubroute["subRoutes"],foundedInSubroute]
                if(foundedInSubroute["destination"]!==rt["destination"]){
                    delete categorizedRoutes[rt["destination"]]
                }
            }
            else{
                categorizedRoutes[rt["destination"]] = [...rt["subRoutes"],rt]
                if(foundedInSubroute["destination"]!==rt["destination"]){
                    delete categorizedRoutes[foundedInSubroute["destination"]]
                }
            }
        }
    }
    let newObj = {}
        Object.assign(newObj,categorizedRoutes)
        Object.keys(categorizedRoutes).map((ky)=>{
            delete newObj[ky]
            const foundedOther = Object.values(newObj).findIndex(arr=>arr.find(obj=>obj["destination"]===ky))
            if(foundedOther>=0){
                delete categorizedRoutes[ky]
            }
            Object.assign(newObj,categorizedRoutes)
        })
    return {props:{locale:nextLocale||locale,
            routeList:data['data']["routes"],
            selectedRoutes:routes["data"]["allRoutesOfBusCompany"],
            categorizedRoutes,
            numberOfBuses:busCompany["data"]["busCompany"]["numberOfBuses"],
            token:tokenDecoded
        }}
  }
export default RouteAddPage;