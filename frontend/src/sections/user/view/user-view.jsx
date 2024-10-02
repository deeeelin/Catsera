import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { faker } from '@faker-js/faker';
import { users } from 'src/_mock/user';

import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Chip,
  TextField,
  Avatar,
  Button
} from '@mui/material';
import { Checkbox } from '@mui/material';

import AppCurrentSubject from '../individual-capability-metrics';
import AppOrderTimeline from '../learning-achievement-timeline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import CardHeader from '@mui/material/CardHeader';
import Scrollbar from 'src/components/scrollbar';
import { emptyRows, applyFilter, getComparator } from '../utils';




const titles = [
  "Newbie Learner", "Enthusiastic Beginner", "Eager Explorer","Proficient Practitioner","Expert Achiever",
];


export default function UserView() {
  const userInfo = {
    name: 'John Doe',
    gender: 'Male',
    age: 30,
    education: 'Bachelor',
    skills: ['eat', 'sleep'],
    imageUrl: 'https://media.vogue.com.tw/photos/60c9b54610c774902e0403c0/1:1/w_960,c_limit/不愛我就拉倒照片1.jpeg' // Replace with actual image URL
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [progress, setProgress] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newTopic, setNewTopic] = useState('');

  // first
  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [firstDialogInput, setFirstDialogInput] = useState('');

  // second
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [secondDialogChoices, setSecondDialogChoices] = useState({});

  // first
  const handleFirstDialogInput = (event) => {
    setFirstDialogInput(event.target.value);
  };

  // open first
  const handleFirstDialogOpen = () => {
    setOpenFirstDialog(true);
  };

  


  const sendTag = (tag) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3080/dbuser/getQ1options/${tag}`)
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

  const sendTopic = (topictag) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3080/dbuser/getQ2options/testid/${topictag}`)
        .then(response => {
          if (!response.ok) {
            console.log(topictag)
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
  
  const handleFirstDialogClose = async () => {
    setOpenFirstDialog(false);
  
    if (firstDialogInput && !tags.includes(firstDialogInput)) {
      try {
        const data = await sendTag(firstDialogInput);
  
        // Split the received data into subjects using '/'
        const subjects = data.data.split(' / ')[1].split(', ').map(subject => subject.trim());
        
        // Create an object with initial state values for each subject
        const initialState = {};
        subjects.forEach(subject => {
          // Remove all characters except A-Z and a-z
          const sanitizedSubject = subject.replace(/\./g, '');
          initialState[sanitizedSubject] = false;
        });
  
        // Set the secondDialogChoices state with the initial state
        setSecondDialogChoices(initialState);
        setNewTopic(data.data.split(' / ')[0])
        openSecondDialogAfterFirst();
      } catch (error) {
        // Handle errors here if needed
      }
    }
  };
  
  const openSecondDialogAfterFirst = () => {
    
    setOpenSecondDialog(true);
  };

  // second
  const handleSecondDialogChoiceChange = (event) => {
    setSecondDialogChoices(prevChoices => ({
      ...prevChoices,
      [event.target.name]: event.target.checked
    }));
  };
  

  // second
  const handleSecondDialogClose = async () => {
    {/* const newTags = [firstDialogInput, ...Object.keys(secondDialogChoices).filter(choice => secondDialogChoices[choice])];
    setTags(currentTags => [...currentTags, ...newTags]);
    setFirstDialogInput('');
    resetSecondDialogChoices();
  setOpenSecondDialog(false); */}

  const newTags = Object.keys(secondDialogChoices).filter(choice => secondDialogChoices[choice]);
  setTags(currentTags => [...currentTags, ...newTags]);
  resetSecondDialogChoices();
  setOpenSecondDialog(false);

  console.log(newTags)
  console.log(newTopic)

  const tagsString = newTags.join(',');

  const result = `${newTopic}.${tagsString}`;

  try {
    const data = await sendTopic(result);
  } catch (error) {
    // Handle errors here if needed
  }

  };

  
  
  const resetSecondDialogChoices = () => {
    setSecondDialogChoices({});
  };

  const [completedCourses, setCompletedCourses] = useState([
    { id: 1, title: "Introduction to JavaScript", date: "2022-01-15", rating: 4.5 },
    { id: 2, title: "Advanced CSS Techniques", date: "2022-02-20", rating: 4.7 },
    
  ]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNoteChange = (id, note) => {
    const updatedCourses = completedCourses.map(course =>
      course.id === id ? { ...course, note } : course
    );
    setCompletedCourses(updatedCourses);
  };

  const handleDeleteTag = (tagToDelete) => {
    console.log(tagToDelete)
    setTags(tags.filter(tag => tag !== tagToDelete));
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3080/dbuser/removeTag/testid/${tagToDelete}`)
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

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInput, setDialogInput] = useState('');

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogInput = (event) => {
    setDialogInput(event.target.value);
  };

  const handleAddTag = () => {
    if (dialogInput && !tags.includes(dialogInput)) {
      setTags([...tags, dialogInput]);
      setDialogInput('');
    }
    handleDialogClose();
  };

  const calculateTitle = () => {
    const level = Math.floor(completedCourses.length / 5);
    return titles[Math.min(level, titles.length - 1)];
  };


  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');


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

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

 
  const handleAddNote = () => {
    const newNote = { title: newNoteTitle, content: newNoteContent };
    setNotes([...notes, newNote]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  
    const fetchListData = async () => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getCoursesStatus/testid`)
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

    const fetchData = async (id) => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbtest/course/${id}`)
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

    const fetchUserData = async (id) => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getCoursesStatus/testid`)
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

    const fetchTags = async () => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getTags/testid`)
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

    useEffect(() => {
      fetchListData().then(detail => {
        // Create an array of promises using fetchData for each item
        const promises = detail.data.map(item => fetchData(item.courseId));
        console.log(promises)
        // Wait for all fetchData promises to resolve
        Promise.all(promises)
          .then(results => {
            setProgress(results); // Update the progress state with the results
          })
          .catch(error => {
            console.error('Error in promises:', error);
          });
      }).catch(error => {
        console.error('Error in fetchListData:', error);
      });
    }, []);

    useEffect(() => {
      fetchTags().then(detail => {
        // Create an array of promises using fetchData for each item
        console.log(detail.data.flat())
        setTags(detail.data.flat())
      }).catch(error => {
        console.error('Error in fetchListData:', error);
      });
    }, []);
 
    useEffect(() => {
      console.log(progress)
    }, [progress]);


    


  return (
    <Container>
      <Card sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Avatar src={userInfo.imageUrl} sx={{ width: 90, height: 90, mr: 2 }} />
          <Box>
            <Typography variant="h6">{userInfo.name}</Typography>
            <Typography variant="body2">Gender: {userInfo.gender}</Typography>
            <Typography variant="body2">Age: {userInfo.age}</Typography>
            <Typography variant="body2">Education: {userInfo.education}</Typography>
            <Typography variant="body2">Title: {calculateTitle()}</Typography>
            <Box sx={{ mt: 1 }}>
              {userInfo.skills.map((skill, index) => (
                <Chip key={index} label={skill} sx={{ mr: 0.5 }} />
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ m: 2 }}>
          <Typography variant="h6">Your Tags:</Typography>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              sx={{ m: 0.5 }}
            />
          ))}
          <Box sx={{ mt: 2 }}>
            {/* <TextField
              size="small"
              label="New Tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              sx={{ mr: 1 }}
          />*/}
            {/*<Button variant="contained" onClick={handleDialogOpen}>
              Add Tag
            </Button>*/}
            <Button variant="contained" onClick={handleFirstDialogOpen}>
              Add Tag
            </Button>
          </Box>
        </Box>
      </Card>

      <Dialog open={openFirstDialog} onClose={handleFirstDialogClose}>
        <DialogTitle>Add Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>Please describe what you want to learn:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-tag-name"
            label="New Tag"
            type="text"
            fullWidth
            value={firstDialogInput}
            onChange={handleFirstDialogInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFirstDialogClose}>Cancel</Button>
          <Button onClick={handleFirstDialogClose}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSecondDialog} onClose={handleSecondDialogClose}>
        <DialogTitle>Choose Subjects</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
            {Object.keys(secondDialogChoices).map(language => (
              <TableRow key={language}>
                <TableCell component="th" scope="row">
                  <Typography sx={{ fontSize: '1.1rem' }}>{language}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Checkbox
                    checked={secondDialogChoices[language]}
                    onChange={handleSecondDialogChoiceChange}
                    name={language}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }} // 调整 Checkbox 的大小
                  />
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSecondDialogClose}>Cancel</Button>
          <Button onClick={handleSecondDialogClose}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>add tag</DialogTitle>
        <DialogContent>
          <DialogContentText>Please describe what you want to learn：</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-tag-name"
            label="label"
            type="text"
            fullWidth
            value={dialogInput}
            onChange={handleDialogInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>取消</Button>
          <Button onClick={handleAddTag}>添加</Button>
        </DialogActions>
      </Dialog>

      {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Individual Capability Metrics"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Science and Technology', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Medical and Agricultural', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Humanities', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}



        <Card sx={{ mt: 4, mb: 2 }}>
        {/* */}
      </Card>

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
                  { id: 'name', label: 'Course Name' },
                  { id: 'company', label: 'Course Rating' },
                  { id: 'role', label: 'Difficulty' },
                  { id: 'isVerified', label: 'University' },
                ]}
              />
              <TableBody>
                {progress.map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.data.courseName}
                      role={row.data.difficultyLevel}
                      status={row.data.status}
                      company={row.data.courseRating}
                      avatarUrl={row.avatarUrl}
                      isVerified={row.data.university}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      courseUrl={row.courseUrl}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={progress.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Card sx={{ mt: 4, mb: 2 }}>
        {/* */}
      </Card>
      
        {/* <Card sx={{ mt: 4, mb: 4 }}>
        <CardHeader title="Notes" />
        <Box sx={{ p: 2 }}>
          <TextField
            label="Note Title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Note Content"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddNote}>
            Add Note
          </Button>
        </Box>
        {notes.map((note, index) => (
          <Box key={index} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">{note.title}</Typography>
            <Typography variant="body1">{note.content}</Typography>
          </Box>
        ))}
      </Card> */}
  

      <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Learning achievement Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                'Newbie Learner',
                'Enthusiastic Beginner',
                'Eager Explorer',
                'Proficient Practitioner',
                'Expert Achiever',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
    </Container>
  );
}
