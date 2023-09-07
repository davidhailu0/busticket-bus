import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box} from '@mui/material'


export default function EditSelectComponent({value,setValue,options}){
    const changeValue = (val)=>{
        setValue(val.target.value)
    }
    return(<Box sx={{display:"inline-block",width:{md:"522px",xs:"100%"},mr:"2.5rem",my:1.5,borderColor:"white"}}>
            <Select
            value={value}
            onChange={changeValue}
            sx={{
                boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                width:"522px",
                color: "grey",
                background:"white",
                '.MuiOutlinedInput-notchedOutline': {
                  border:"solid 1px grey",
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border:"solid 1px grey",
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border:"solid 1px grey",
                },
                '.MuiSvgIcon-root ': {
                  fill: "grey !important",
                }
              }}
            >
            {//eslint-disable-next-line
            options.map((val)=>(<MenuItem key={val} value={val}>
                      {val}
                </MenuItem>))}
            </Select>
        </Box>);
}