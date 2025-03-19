import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { createTask } from '../api/taskApi';

const CreateTaskModal = ({ open, onClose, onTaskCreated }) => {
  const initialFormState = {
    title: '',
    type: '',
    priority: '',
    associatedRecord: '',
    assignedTo: '',
    dueDate: null,
    notes: ''
  };
  
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (newValue) => {
    setForm(prev => ({
      ...prev,
      dueDate: newValue
    }));
    
    // Clear error for this field if it exists
    if (errors.dueDate) {
      setErrors(prev => ({
        ...prev,
        dueDate: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Task name is required';
    }
    
    if (!form.type) {
      newErrors.type = 'Task type is required';
    }
    
    if (!form.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!form.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare task data
      const taskData = {
        ...form,
        completed: false,
        id: `task-${Date.now()}` // Generate a unique ID for mock data
      };
      
      // Call API to create task
      const createdTask = await createTask(taskData);
      
      // Reset form
      setForm(initialFormState);
      
      // Notify parent component
      onTaskCreated(createdTask);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      
      
      setErrors(prev => ({
        ...prev,
        form: 'Failed to create task. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog close
  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };
  
  return (
    <Dialog  
    open={open} 
    onClose={handleClose}
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle>Create New Task</DialogTitle>
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Task Name */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              name="title"
              label="Task Name"
              fullWidth
              variant="outlined"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              margin="normal"
            />
          </Grid>
          
          {/* Task Type & Priority in one row */}
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth
              error={!!errors.type}
              required
              margin="normal"
            >
              <InputLabel id="task-type-select-label">Task Type</InputLabel>
              <Select
                labelId="task-type-select-label"
                id="task-type-select"
                name="type"
                value={form.type}
                label="Task Type"
                onChange={handleChange}
              >
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth
              error={!!errors.priority}
              required
              margin="normal"
            >
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                name="priority"
                value={form.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
              {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Associated Record */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="associatedRecord"
              label="Associated Record"
              fullWidth
              variant="outlined"
              value={form.associatedRecord}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          
          {/* Assigned To */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="assignedTo"
              label="Assigned To"
              fullWidth
              variant="outlined"
              value={form.assignedTo || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          
          {/* Due Date & Time */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date & Time"
                value={form.dueDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.dueDate}
                    helperText={errors.dueDate}
                    margin="normal"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              fullWidth
              variant="outlined"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={2}
              margin="normal"
            />
          </Grid>
          
          {/* Form-wide error */}
          {errors.form && (
            <Grid item xs={12}>
              <FormHelperText error>{errors.form}</FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
  );
};

export default CreateTaskModal;