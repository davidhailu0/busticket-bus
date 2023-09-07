import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomMultiSelectCheckBox({selectedSeats,setSelectedSeats,allSeats,availableSeats,error,setError}) {

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSeats(
      typeof value === 'string' ? value.split(',') : value,
    );
    if(value.length===49-parseInt(availableSeats)){
        setError(false)
    }
  };

  return (
    <div>
      {/* <FormControl sx={{ my: 3, width: 300 }}> */}
        <Select
          multiple
          value={selectedSeats}
          onChange={handleChange}
          error={error}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          sx={{width:"522px",my: 1,boxShadow: "0px 0px 10px 0px #00000026",background:"#fff"}}
        >
          {allSeats.map((st) => (
            <MenuItem key={st} value={st} disabled={selectedSeats.length===49-parseInt(availableSeats)}>
                <Checkbox checked={selectedSeats.indexOf(st) > -1} />
                <ListItemText primary={st} />
            </MenuItem>
          ))}
        </Select>
      {/* </FormControl> */}
    </div>
  );
}