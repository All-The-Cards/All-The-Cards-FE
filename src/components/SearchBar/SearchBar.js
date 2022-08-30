import React from 'react'
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import { OutlinedInput } from "@mui/material";
import { BorderAllRounded } from '@mui/icons-material';

const SearchBar = () => {

  return (

    <div className="SearchBar">
        <OutlinedInput
            id="outlined-adornment"
            type="search"
            placeholder="Search..."
            size="small"
            fullWidth={true}
            sx={{
                bgcolor: "white",
                borderRadius: 25,
                height: 35,
                sm:{
                    
                }
            }}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton aria-label="search" size="small">
                        <SearchIcon fontSize="small"/>
                    </IconButton>
                </InputAdornment>
            }
        />
    </div>

)}

export default SearchBar