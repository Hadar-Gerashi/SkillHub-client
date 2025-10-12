import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch } from 'react-redux';

import { checkboxAdd, checkboxRemove } from '../../features/cartSlice.js';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//קומפוננטה של האם הקורס נבחר בעגלת הקניות
export default function IsChecked({ course, checked, dis }) {
    const [isChecked, setIsChecked] = useState(checked);
    let dispatch = useDispatch()

    const handleClick = () => {
        setIsChecked(prevChecked => !prevChecked);
        if (isChecked) {
            dispatch(checkboxRemove(course._id))

        }
        else {
            dispatch(checkboxAdd(course._id))

        }
    };

    return (
        <div>
            <Checkbox
                {...label}
                checked={isChecked}
                onChange={handleClick}
                sx={{
                    color: "black",
                    '&.Mui-checked': {
                        color: 'black',
                    },
                }}
                disabled={dis}
            />
        </div>
    );
}
