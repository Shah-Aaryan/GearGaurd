# GearGuard

GearGuard is a full-stack application designed to manage equipment, maintenance requests, teams, and reporting for organizations. It features a modern React frontend and a Node.js/Express backend, providing a seamless experience for users to track and manage their assets efficiently.

## Features

- **User Authentication**: Secure login and signup functionality.
- **Equipment Management**: Add, edit, and view equipment details.
- **Maintenance Requests**: Create and track maintenance requests.
- **Team Management**: Organize and manage maintenance teams.
- **Reporting**: Generate and view reports on equipment and maintenance.
- **3D Equipment**: Manage and visualize 3D equipment data.
- **Work Centers**: Organize equipment and teams by work centers.
- **Chatbot**: Integrated chatbot for real-time assistance.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: (Specify your DB, e.g., MongoDB, PostgreSQL)

## Project Structure

```
GearGuard/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your database connection in `models/db.js`.
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

### Environment Variables
- Configure any required environment variables for both frontend and backend (e.g., API URLs, database credentials).

## Usage
- Access the frontend at `http://localhost:5173` (or as specified by Vite).
- The backend runs on `http://localhost:3000` by default.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
Specify your license here (e.g., MIT).

## Acknowledgements
- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---
Feel free to update this README with more details as your project evolves.
