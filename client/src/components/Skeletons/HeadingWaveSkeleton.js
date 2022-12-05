import React from 'react';
import {Skeleton} from '@mui/material';

const HeadingWaveSkeleton = () => {
  return (
    <Skeleton variant='text'
                animation='wave'
                height='78px'
                width='98%'
                sx={{m:'-15px 0 0 1%'}}
     />
  )
}

export default HeadingWaveSkeleton