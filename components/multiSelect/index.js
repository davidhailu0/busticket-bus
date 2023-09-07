import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
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

export default function CustomMultiSelectCheckBox({selectedDestinations,setDestinations,destinations}) {

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDestinations(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ my: 3, width: 300 }}>
        <InputLabel>Select Your Destinations</InputLabel>
        <Select
          multiple
          value={selectedDestinations}
          onChange={handleChange}
          input={<OutlinedInput label="Select Your Destination" />}
          renderValue={(selected) => {
            const translated = selected.map(slected=>{
                const foundPlace = destinations.find(obj=>obj["name"]===slected)
                return foundPlace[slected]
            })
            return translated.join(', ')}}
          MenuProps={MenuProps}
          sx={{width:"760px",boxShadow: "0px 0px 10px 0px #00000026"}}
        >
          {destinations.map((route) => (
            <MenuItem key={route["name"]} value={route["name"]}>
                <Checkbox checked={selectedDestinations.indexOf(route["name"]) > -1} />
                <ListItemText primary={route[route["name"]]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}