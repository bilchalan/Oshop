import React from 'react';
import {Box} from '@mui/material';
import noentry from '../../images/restricted.svg';

const Unauthorized = () => {
  return (
    <Box sx={{textAlign:'center'}}>
        <img src={noentry} alt='unauthorized' width={450}/>
    </Box>
  )
}

export default Unauthorized