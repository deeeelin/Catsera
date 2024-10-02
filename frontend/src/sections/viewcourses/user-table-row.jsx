import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  company,
  role,
  isVerified,
  status,
  handleClick,
  courseUrl, 
}) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate(); 

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleComplete = () => {
    setOpen(null);
    // send database complete request
    console.log('send complete')
  };

  const handleNameClick = () => {
    window.open(courseUrl, '_blank'); // 在新标签页中打开链接
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}


        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap onClick={handleNameClick} style={{ cursor: 'pointer' }}>
              {name}
            </Typography>
          </Stack>
        </TableCell>


        <TableCell>{company}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>{isVerified}</TableCell>

        



        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleComplete} disabled={status==='active'}>

          <Iconify icon="eva:checkmark-circle-outline" sx={{ mr: 2, color: status === 'active' ? 'success.main' : ''}} />
          {status === 'active' ? 'Completed' : 'Finish'}
        </MenuItem>

      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  courseUrl: PropTypes.string, 
};