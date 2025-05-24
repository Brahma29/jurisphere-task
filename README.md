# User Management Dashboard

A modern user management dashboard built with Next.js and TypeScript.

## Features

- **User Table**: Display users in a sortable data table
- **Search & Filter**: Filter users by name and status (active/inactive)
- **User Details**: Click on any user to view detailed information in a modal
- **Copy Email**: One-click email copying functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Key Components

- `DataTable`: Reusable sortable table component
- `UserInfoModal`: Modal for displaying detailed user information
- `TableHead` & `TableCell`: Table component building blocks

## API

- `GET /api/users`: Fetches all users (currently uses dummy data)

## Data Structure

Users include:

- Basic info (name, email, status)
- Address and join date
- Notes and account status
- Unique ID for identification

## Design Decisions

- **Copy Email Button**: Added one-click email copying since users often need to contact someone after reviewing their data
- **URL-based Selection**: User selection is stored in URL params, enabling user to directly share the url which will directly open that particular user modal

## Future Enhancements

- **Column-level Search**: Add individual search inputs for each column (email, ID, etc.) for more precise filtering
- **CSV Export**: Enable exporting filtered user data to CSV format for external use
- **Pagination**: Handle large datasets with server-side pagination

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the dashboard.
