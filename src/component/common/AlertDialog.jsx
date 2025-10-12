import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

//קומפוננטה להודעה למשתמש אם הוא בטוח שהוא רוצה למחוק משהו מסוים
export default function AlertPopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'delete-popover' : undefined;

  return (
    <React.Fragment>
      <DeleteOutlinedIcon
        onClick={handleClick}
        sx={{ cursor: 'pointer' }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>
          Are you sure? You can't undo this action afterwards.
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '8px' }}>

          <Button onClick={handleClose} sx={{ color: "black" }}>
            Cancel
          </Button>

          <Button onClick={props.deleted} color="error" autoFocus>
            Delete
          </Button>

        </div>
      </Popover>
    </React.Fragment>
  );
}
