import React from 'react';
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Chip,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const TaskFilterBar = ({ filters, onFilterChange, onSearch, searchQuery, onClearFilters, activeFiltersCount }) => {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Bar */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Task Type Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="task-type-label">Task Type</InputLabel>
            <Select
              labelId="task-type-label"
              id="task-type"
              name="taskType"
              value={filters.taskType}
              label="Task Type"
              onChange={onFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="call">Call</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Due Date Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="due-date-label">Due Date</InputLabel>
            <Select
              labelId="due-date-label"
              id="due-date"
              name="dueDate"
              value={filters.dueDate}
              label="Due Date"
              onChange={onFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="tomorrow">Tomorrow</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="nextWeek">Next Week</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Assigned To Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="assigned-to-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-label"
              id="assigned-to"
              name="assignedTo"
              value={filters.assignedTo}
              label="Assigned To"
              onChange={onFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Rahul Sharma">Rahul Sharma</MenuItem>
              <MenuItem value="Amit Kumar">Amit Kumar</MenuItem>
              <MenuItem value="Priya Singh">Priya Singh</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={filters.priority}
              label="Priority"
              onChange={onFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Active Filters Count & Clear Button */}
        {activeFiltersCount > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="body2" color="textSecondary">
                <Chip 
                  label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'filter' : 'filters'} applied`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Typography>
              <Chip
                label="Clear all filters"
                size="small"
                color="secondary"
                onClick={onClearFilters}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default TaskFilterBar;