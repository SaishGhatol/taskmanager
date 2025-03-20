import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { createTask } from '../api/taskApi';
import {
  Close,
  AccessTime,
  ArrowForward,
  PersonOutline,
  Link,
  Notes,
  Call,
  Email,
  Videocam
} from '@mui/icons-material';

// Enhanced Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 24px 48px rgba(0,0,0,0.16)',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    width: '640px',
    maxWidth: '100%'
  }
}));

const TaskHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.08)}, ${theme.palette.background.paper})`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3),
  margin: theme.spacing(2, 0)
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => {
  const colorMap = {
    high: theme.palette.error,
    medium: theme.palette.warning,
    low: theme.palette.success
  };
  
  const colors = colorMap[priority] || theme.palette.grey;
  
  return {
    fontWeight: 600,
    borderRadius: 8,
    padding: theme.spacing(0.5, 1.5),
    border: `2px solid ${alpha(colors.main, 0.3)}`,
    color: colors.main,
    backgroundColor: alpha(colors.main, 0.08),
    '&:hover': {
      backgroundColor: alpha(colors.main, 0.15)
    },
    '&.Mui-selected': {
      backgroundColor: colors.main,
      color: colors.contrastText
    }
  };
});

const TypeChip = styled(Chip)(({ theme, selected }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  border: `2px solid ${selected ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.2)}`,
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.15)
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.25, 2.5),
  fontWeight: 700,
  letterSpacing: 0.5,
  transition: 'all 0.2s ease',
  '&.MuiButton-contained': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
    }
  }
}));

const CreateTaskModal = ({ open, onClose, onTaskCreated }) => {
  const [form, setForm] = useState({
    title: '',
    type: '',
    priority: '',
    associatedRecord: '',
    assignedTo: '',
    dueDate: null,
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Required';
    if (!form.type) newErrors.type = 'Required';
    if (!form.priority) newErrors.priority = 'Required';
    if (!form.dueDate) newErrors.dueDate = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const taskData = { ...form, id: `task-${Date.now()}`, completed: false };
      const createdTask = await createTask(taskData);
      onTaskCreated(createdTask);
      handleClose();
    } catch (error) {
      setErrors({ form: 'Failed to create task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      type: '',
      priority: '',
      associatedRecord: '',
      assignedTo: '',
      dueDate: null,
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <TaskHeader>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Create New Task
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </TaskHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          <FormSection>
            <Grid container spacing={3}>
              {/* Task Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoFocus
                  name="title"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      backgroundColor: alpha('#000', 0.03),
                      '& fieldset': { borderWidth: 2 }
                    }
                  }}
                />
              </Grid>

              {/* Task Type */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={700} mb={2}>
                  Task Type
                </Typography>
                <Box display="flex" gap={2}>
                  {[
                    { value: 'call', label: 'Call', Icon: Call },
                    { value: 'email', label: 'Email', Icon: Email },
                    { value: 'meeting', label: 'Meeting', Icon: Videocam }
                  ].map(({ value, label, Icon }) => (
                    <TypeChip
                      key={value}
                      label={label}
                      icon={<Icon fontSize="small" />}
                      selected={form.type === value}
                      onClick={() => handleChange('type', value)}
                    />
                  ))}
                </Box>
                {errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
              </Grid>

              {/* Priority */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={700} mb={2}>
                  Priority Level
                </Typography>
                <Box display="flex" gap={2}>
                  {['high', 'medium', 'low'].map((level) => (
                    <PriorityChip
                      key={level}
                      label={level.charAt(0).toUpperCase() + level.slice(1)}
                      priority={level}
                      onClick={() => handleChange('priority', level)}
                      className={form.priority === level ? 'Mui-selected' : ''}
                    />
                  ))}
                </Box>
                {errors.priority && <FormHelperText error>{errors.priority}</FormHelperText>}
              </Grid>

              {/* Due Date */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={700} mb={2}>
                  Due Date & Time
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={form.dueDate}
                    onChange={(date) => handleChange('dueDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            borderRadius: 3,
                            backgroundColor: alpha('#000', 0.03),
                            '& fieldset': { borderWidth: 2 }
                          }
                        }}
                      />
                    )}
                    components={{ OpenPickerIcon: AccessTime }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2, borderWidth: 1 }} />
              </Grid>

              {/* Additional Fields */}
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Assigned To"
                    placeholder="Who's responsible?"
                    value={form.assignedTo}
                    onChange={(e) => handleChange('assignedTo', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Associated Record"
                    placeholder="Optional reference"
                    value={form.associatedRecord}
                    onChange={(e) => handleChange('associatedRecord', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Link color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    placeholder="Additional details..."
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: 1.5 }}>
                          <Notes color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormSection>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha('#000', 0.1)}` }}>
          <StyledButton
            onClick={handleClose}
            variant="text"
            color="inherit"
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={!loading && <ArrowForward />}
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              color: 'white'
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </StyledButton>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default CreateTaskModal;