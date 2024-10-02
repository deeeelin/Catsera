import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ViewCoursesPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  //const [courses, setCourses] = useState(Courses); 


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };



  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  
  //const ongoingCourses = courses.filter(course => course.completionStatus !== 2);
  //const completedCourses = courses.filter(course => course.completionStatus === 2);

  const [pathView, setPathView] = useState([]);

    // Get the full URL of the current page
  const fullUrl = window.location.href;

  // Get the query string part of the URL (starting with '?')
  const queryString = window.location.search;

  // If you need to access individual query parameters, you can use URLSearchParams
  const urlParams = new URLSearchParams(queryString);

  // To get a specific parameter by name (e.g., 'id')
  const idParam = urlParams.get('id'); // Replace 'id' with the actual parameter name you're looking for

  useEffect(() => {
  
    const fetchListData = async (data) => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getLearningPathList/testid/${data}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetch result:', data);
            resolve(data); // Resolve the promise with the fetched data
          })
          .catch(error => {
            console.error('Fetch error:', error);
            reject(error); // Reject the promise with the error
          });
      });
    };
  
  
      fetchListData(idParam).then(detail => {
        setPathView(detail.data.items);
          console.log(pathView)
        });
 
  
  }, []);

  useEffect(() => {
  
    console.log(pathView)
 
  
  }, [pathView]);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Learning Path</Typography>

        {/* <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button> */}
      </Stack>

      <Card>
        {/*<UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        /> */}


        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'courseName' },
                  { id: 'company', label: 'courseRating' },
                  { id: 'role', label: 'difficulty' },
                  { id: 'isVerified', label: 'university' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {pathView.map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.courseId.courseName}
                      role={row.courseId.difficultyLevel}
                      status={row.courseId.status}
                      company={row.courseId.courseRating}
                      avatarUrl={row.avatarUrl}
                      isVerified={row.courseId.university}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      courseUrl={row.courseUrl}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

      </Card>
    </Container>
  );
}