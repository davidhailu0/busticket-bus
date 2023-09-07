import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {Box,FormControl,Tooltip} from '@mui/material'

export default function SelectComponent({label,value,setValue,error,options,disabled}){

    return(<Box sx={{display:"inline-block",width:{md:"760px",xs:"320px"},mr:"2.5rem",my:1.5,borderColor:"white"}}>
            <FormControl fullWidth>
            <Tooltip title={error?"Please Enter a valid "+label:""}>
            <Select
            id={`${label.replace(" ","")}_id`}
            name={label}
            value={value}
            placeholder={label}
            onChange={setValue}
            error={error}
            disabled={disabled}
            sx={{
                boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
                width:{md:"522px",xs:"320px"},
                color: "grey",
                background:"white"
              }}
            >
            {//eslint-disable-next-line
            options.map((val)=>(<MenuItem key={val["name"]} value={val["name"]}>
                      {val[val["name"]]}
                </MenuItem>))}
            </Select>
            </Tooltip>
            </FormControl>
        </Box>);
}
