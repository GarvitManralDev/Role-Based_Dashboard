# Team Pulse Dashboard

A productivity monitoring tool designed for internal teams that enables Team Leads to monitor member statuses and assign tasks, while Team Members can update their status and manage progress on assigned tasks.

## Project Overview

The Team Pulse Dashboard provides a dual-interface system that adapts based on user roles:

### Team Lead Features
- **Team Status Overview**: Real-time monitoring of all team members with status badges (Working, Break, Meeting, Offline)
- **Status Summary**: Quick overview showing distribution of team member statuses
- **Task Assignment**: Assign tasks to team members with due dates and automatic progress tracking

### Team Member Features
- **Status Management**: Update personal status with one-click buttons
- **Task Dashboard**: View all assigned tasks with progress tracking


## Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1 for responsive design and utility classes

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-pulse-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## Features in Detail

### Role Switching
- Toggle button in the top-right corner switches between Team Lead and Team Member views
- Current role is clearly displayed and affects the entire dashboard interface
- Seamless transition between different user experiences

### Team Lead Dashboard
- **Status Monitoring**: Visual status badges with color coding for quick identification
- **Task Assignment Form**: Intuitive form with member selection, task title, and due date
- **Filtering Options**: Dropdown to filter team members by their current status
- **Sorting Capabilities**: Option to sort team members by their active task count

### Team Member Dashboard
- **Status Update Panel**: Four-button interface for status changes (Working, Break, Meeting, Offline)
- **Personal Task List**: Clean list view of all assigned tasks
- **Progress Management**: Interactive progress bars with increment/decrement controls
- **Task Completion**: Automatic completion marking and visual feedback

