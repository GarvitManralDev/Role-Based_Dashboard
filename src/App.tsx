import React, { useState } from 'react';
import { Users, User, Plus, Filter, ArrowUpDown, Clock, CheckCircle, Circle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  status: 'Working' | 'Break' | 'Meeting' | 'Offline';
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  progress: number;
  completed: boolean;
}

function App() {
  const [currentRole, setCurrentRole] = useState<'Team Lead' | 'Team Member'>('Team Lead');
  const [currentUserId, setCurrentUserId] = useState('member-1');
  
  // Initial team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'member-1', name: 'Alice Johnson', status: 'Working' },
    { id: 'member-2', name: 'Bob Smith', status: 'Meeting' },
    { id: 'member-3', name: 'Carol Davis', status: 'Break' },
    { id: 'member-4', name: 'David Wilson', status: 'Offline' }
  ]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Complete project documentation', assignedTo: 'member-1', dueDate: '2025-01-15', progress: 60, completed: false },
    { id: 'task-2', title: 'Review code changes', assignedTo: 'member-2', dueDate: '2025-01-12', progress: 30, completed: false },
    { id: 'task-3', title: 'Update team wiki', assignedTo: 'member-1', dueDate: '2025-01-18', progress: 100, completed: true }
  ]);

  // Filters and sorting
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortByTasks, setSortByTasks] = useState(false);

  // Form states
  const [newTask, setNewTask] = useState({ memberId: '', title: '', dueDate: '' });

  const updateMemberStatus = (memberId: string, status: 'Working' | 'Break' | 'Meeting' | 'Offline') => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status } : member
    ));
  };

  const addTask = () => {
    if (newTask.memberId && newTask.title && newTask.dueDate) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        assignedTo: newTask.memberId,
        dueDate: newTask.dueDate,
        progress: 0,
        completed: false
      };
      setTasks(prev => [...prev, task]);
      setNewTask({ memberId: '', title: '', dueDate: '' });
    }
  };

  const updateTaskProgress = (taskId: string, change: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newProgress = Math.max(0, Math.min(100, task.progress + change));
        return {
          ...task,
          progress: newProgress,
          completed: newProgress === 100
        };
      }
      return task;
    }));
  };

  const getActiveTasks = (memberId: string) => {
    return tasks.filter(task => task.assignedTo === memberId && !task.completed).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return 'bg-green-100 text-green-800 border-green-200';
      case 'Break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedMembers = () => {
    let filtered = statusFilter === 'All' 
      ? teamMembers 
      : teamMembers.filter(member => member.status === statusFilter);
    
    if (sortByTasks) {
      filtered = [...filtered].sort((a, b) => getActiveTasks(b.id) - getActiveTasks(a.id));
    }
    
    return filtered;
  };

  const getStatusSummary = () => {
    const summary = teamMembers.reduce((acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(summary)
      .map(([status, count]) => `${count} ${status}`)
      .join(' · ');
  };

  const currentUser = teamMembers.find(member => member.id === currentUserId);
  const userTasks = tasks.filter(task => task.assignedTo === currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Team Pulse Dashboard</h1>
            </div>
            
            {/* Role Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Current Role:</span>
              <button
                onClick={() => setCurrentRole(currentRole === 'Team Lead' ? 'Team Member' : 'Team Lead')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentRole === 'Team Lead' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}
              >
                {currentRole}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'Team Lead' ? (
          <div className="space-y-8">
            {/* Team Status Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Status Overview</h2>
              <p className="text-lg text-gray-600">{getStatusSummary()}</p>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Working">Working</option>
                    <option value="Break">Break</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setSortByTasks(!sortByTasks)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    sortByTasks 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by Active Tasks</span>
                </button>
              </div>
            </div>

            {/* Team Members List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAndSortedMembers().map((member) => (
                  <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{getActiveTasks(member.id)} active tasks</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Assignment */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Plus className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Assign New Task</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Member
                  </label>
                  <select
                    value={newTask.memberId}
                    onChange={(e) => setNewTask(prev => ({ ...prev, memberId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select member...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <button
                onClick={addTask}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Assign Task
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current User Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Status</h2>
              <div className="flex items-center space-x-4 mb-6">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentUser?.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentUser?.status || '')}`}>
                    {currentUser?.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['Working', 'Break', 'Meeting', 'Offline'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateMemberStatus(currentUserId, status as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentUser?.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* User Tasks */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {userTasks.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No tasks assigned yet.
                  </div>
                ) : (
                  userTasks.map((task) => (
                    <div key={task.id} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <h3 className={`text-lg font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                task.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                        </div>
                        
                        {!task.completed && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateTaskProgress(task.id, -10)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                            >
                              -10%
                            </button>
                            <button
                              onClick={() => updateTaskProgress(task.id, 10)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                            >
                              +10%
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;