// Mock data for tasks
const mockTasks = [
    {
      id: 'task-1',
      title: 'Call client regarding project requirements',
      type: 'call',
      priority: 'high',
      dueDate: '2025-03-20T10:00:00',
      associatedRecord: 'Tata Motors',
      assignedTo: 'Rahul Sharma',
      completed: false,
      notes: 'Discuss upcoming project timeline and deliverables'
    },
    {
      id: 'task-2',
      title: 'Send weekly progress report',
      type: 'email',
      priority: 'medium',
      dueDate: '2025-03-19T14:30:00',
      associatedRecord: 'Infosys Project',
      assignedTo: 'Priya Singh',
      completed: false,
      notes: 'Include team updates and milestone achievements'
    },

    {
      id: 'task-3',
      title: 'Team meeting to discuss project timeline',
      type: 'meeting',
      priority: 'high',
      dueDate: '2025-03-18T15:00:00',
      associatedRecord: 'Project X',
      assignedTo: 'Amit Kumar',
      completed: false,
      notes: 'Review project requirements and assign tasks'
      },
    {
      id: 'task-4',
      title: 'Review pull request #42',
      type: 'email',
      priority: 'high',
      dueDate: '2025-03-20T16:00:00',
      associatedRecord: 'Feature X',
      assignedTo: 'Rahul Sharma',
      completed: false,
      notes: 'Code review for the new authentication module'
    },
    {
      id: 'task-5',
      title: 'Client onboarding call',
      type: 'call',
      priority: 'high',
      dueDate: '2025-03-21T11:00:00',
      associatedRecord: 'Reliance Industries',
      assignedTo: 'Priya Singh',
      completed: false,
      notes: 'Welcome call and introduction to the platform'
    },
    {
      id: 'task-6',
      title: 'Budget planning meeting',
      type: 'meeting',
      priority: 'medium',
      dueDate: '2025-03-22T13:00:00',
      associatedRecord: 'Q2 Financials',
      assignedTo: 'Amit Kumar',
      completed: false,
      notes: 'Discuss budget allocation for upcoming projects'
    },
    {
      id: 'task-7',
      title: 'Follow up on invoice payment',
      type: 'email',
      priority: 'low',
      dueDate: '2025-03-25T10:00:00',
      associatedRecord: 'Invoice #12345',
      assignedTo: 'Rahul Sharma',
      completed: false,
      notes: 'Send a reminder regarding the pending invoice'
    }
    ];
  
  export default mockTasks;
  