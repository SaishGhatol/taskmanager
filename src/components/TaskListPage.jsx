import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Checkbox, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar,
  Alert,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { 
  Phone as CallIcon, 
  Email as EmailIcon, 
  Event as MeetingIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { fetchTasks, markTaskAsComplete } from '../api/taskApi';
import CreateTaskModal from './CreateTaskModal';

const TaskListPage = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filters
  const [filters, setFilters] = useState({
    taskType: '',
    dueDate: '',
    assignedTo: '',
    priority: ''
  });
  
  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await fetchTasks();
        setTasks(response);
        setFilteredTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load tasks. Please try again later.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, []);
  
  // Apply filters whenever filters state changes
  useEffect(() => {
    const applyFilters = () => {
      let result = [...tasks];
      
      if (filters.taskType) {
        result = result.filter(task => task.type === filters.taskType);
      }
      
      if (filters.priority) {
        result = result.filter(task => task.priority === filters.priority);
      }
      
      if (filters.assignedTo) {
        result = result.filter(task => task.assignedTo === filters.assignedTo);
      }
      
      if (filters.dueDate) {
        const today = new Date().setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        switch(filters.dueDate) {
          case 'today':
            result = result.filter(task => {
              const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
              return dueDate === today;
            });
            break;
          case 'tomorrow':
            result = result.filter(task => {
              const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
              return dueDate === tomorrow.setHours(0, 0, 0, 0);
            });
            break;
          case 'thisWeek':
            result = result.filter(task => {
              const dueDate = new Date(task.dueDate);
              return dueDate >= today && dueDate < nextWeek;
            });
            break;
          default:
            break;
        }
      }
      
      setFilteredTasks(result);
    };
    
    applyFilters();
  }, [filters, tasks]);
  
  // Handle filters change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset page to 0 when filters change
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle task checkbox click
  const handleTaskCheckboxClick = (task) => {
    setSelectedTask(task);
    setOpenConfirmDialog(true);
  };
  
  // Handle confirmation dialog close
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedTask(null);
  };
  
  // Handle mark task as complete
  const handleMarkAsComplete = async () => {
    try {
      await markTaskAsComplete(selectedTask.id);
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task.id === selectedTask.id ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      
      setSnackbar({
        open: true,
        message: 'Task marked as complete successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error marking task as complete:', error.message);

      setSnackbar({
        open: true,
        message: 'Failed to mark task as complete. Please try again.',
        severity: 'error'
      });
    } finally {
      handleCloseConfirmDialog();
    }
  };
  
  // Handle create new task button click
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  
  // Handle create task modal close
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };
  
  // Handle add new task to the list
  const handleAddNewTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setSnackbar({
      open: true,
      message: 'Task created successfully!',
      severity: 'success'
    });
  };
  
  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Render task type icon
  const renderTaskTypeIcon = (type) => {
    switch (type) {
      case 'call':
        return <CallIcon fontSize="small" />;
      case 'email':
        return <EmailIcon fontSize="small" />;
      case 'meeting':
        return <MeetingIcon fontSize="small" />;
      default:
        return null;
    }
  };
  
  // Render priority chip with appropriate icon and color
  const renderPriorityChip = (priority) => {
    let color, icon, chipProps = {};
    
    switch (priority.toLowerCase()) {
      case 'high':
        color = 'error';
        icon = <KeyboardDoubleArrowUpIcon fontSize="small" />;
        chipProps = { sx: { TextColor: '#d32f2f' } };
        break;
      case 'medium':
        color = 'warning';
        icon = <KeyboardDoubleArrowUpIcon fontSize="small" />;
        chipProps = { sx: { backgroundColor: '#f57c00', color: 'white' } };
        break;
      case 'low':
        color = 'primary';
        icon = <KeyboardDoubleArrowUpIcon fontSize="small" />;
        break;
      default:
        color = 'default';
        icon = <KeyboardDoubleArrowUpIcon fontSize="small" />;
    }
    
    return (
      <Chip 
        label={priority} 
        size="small" 
        color={color}
        icon={icon}
        {...chipProps}
      />
    );
  };

  // Render due date with appropriate color based on priority
  const renderDueDate = (task) => {
    const dateColor = task.priority.toLowerCase() === 'high' ? '#d32f2f' : 
                      task.priority.toLowerCase() === 'medium' ? '#f57c00' : 
                      'inherit';
    
    return (
      <Typography sx={{ color: dateColor }}>
        {new Date(task.dueDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Typography>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Task List
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Create Task
        </Button>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="task-type-label">Task Type</InputLabel>
              <Select
                labelId="task-type-label"
                id="task-type"
                name="taskType"
                value={filters.taskType}
                label="Task Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="due-date-label">Due Date</InputLabel>
              <Select
                labelId="due-date-label"
                id="due-date"
                name="dueDate"
                value={filters.dueDate}
                label="Due Date"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="assigned-to-label">Assigned To</InputLabel>
              <Select
                labelId="assigned-to-label"
                id="assigned-to"
                name="assignedTo"
                value={filters.assignedTo}
                label="Assigned To"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Rahul Sharma">Rahul Sharma</MenuItem>
                <MenuItem value="Amit Kumar">Amit Kumar</MenuItem>
                <MenuItem value="Priya Singh">Priya Singh</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={filters.priority}
                label="Priority"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Task List */}
      <Paper>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="medium">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Task Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Associated Record</TableCell>
                <TableCell>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading tasks...
                  </TableCell>
                </TableRow>
              ) : filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks found. Create a new task or adjust your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={task.completed}
                          disabled={task.completed}
                          onChange={() => !task.completed && handleTaskCheckboxClick(task)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {renderTaskTypeIcon(task.type)}
                          <Typography sx={{ ml: 1 }}>{task.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {renderPriorityChip(task.priority)}
                      </TableCell>
                      <TableCell>
                        {renderDueDate(task)}
                      </TableCell>
                      <TableCell>{task.associatedRecord || '-'}</TableCell>
                      <TableCell>{task.assignedTo || '-'}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Mark task as complete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to mark the task "{selectedTask?.title}" as complete?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleMarkAsComplete} autoFocus variant="contained">
            Complete Task
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Task Modal */}
      <CreateTaskModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onTaskCreated={handleAddNewTask}
      />
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskListPage;