# WAW-Movies Frontend 🎬

This is the React-based frontend for the WAW-Movies application. It provides user authentication, profile management, and a movie browsing interface for streaming locations.

## 🚀 Features
* **User Authentication**: Login and Registration integrated with a JWT-based backend.
* **Protected Profile**: A secure profile page that fetches user data using Bearer tokens.
* **Dynamic Updates**: Ability to update profile information and preview images.

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **npm** (comes with Node.js)

## ⚙️ Installation & Setup

1. **Clone the repository and enter the directory**:
   ```bash
   cd WAW-Movies-Frontend
Install all necessary dependencies:

Bash

npm install
This will install React, Axios, React-Router-DOM, and Vite.

Verify Backend Connection: The frontend is configured to communicate with the backend at http://localhost:3001. Ensure your backend server is running before attempting to log in.

Start the Development Server:

Bash

npm run dev
Access the App: Once the server starts, open your browser to: http://localhost:5173/.

📁 Project Structure
/src/pages: Contains the main views like Login.jsx and Profile.jsx.

/src/contexts: Contains AuthContext.jsx for managing the login state.

/src/assets: Store local images and global styles.

⚠️ Troubleshooting
Login fails: Check if the backend is running on port 3001 and if the circle database is active.

Profile error 500: Ensure you have fixed the jwt.verify reference in the backend guards.


---

### Why these instructions matter:
* **`npm install`**: Since you are using external libraries like `axios` and `react-router-dom`, the project won't run without this step.
* **Port 5173**: Vite defaults to this port, so it's important for the user to know where to look after running the start command.
* **Node Version**: Some newer React features or Vite plugins require modern Node.js versions to prevent "Hook" errors or build failures.

