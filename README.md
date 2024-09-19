# Split bill

A comprehensive web application for efficient tracking and management of group expenses. Built with modern web technologies to ensure a seamless and responsive user experience.

## Features

- **Group and Member Management:** Create groups, add members, and manage individual balances with unique names and currency symbols.
- **Expense Logging:** Log expenses with details such as title, date, category, amount, payer, and members paid for. Automatically split expenses among members and update their balances.
- **State Management:** Utilized Redux Toolkit for efficient state management and real-time UI updates without unnecessary API calls.
- **Backend Integration:** Designed and developed RESTful APIs using Node.js and Express.js for seamless data operations.
- **Scalable Data Storage:** Employed MongoDB for efficient and scalable data storage.

## Technologies Used

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   [git clone https://github.com/your-username/splitwise-clone.git](https://github.com/panditpankaj21/split-bill.git)
   cd splitwise-clone
   ```
  
2. Install dependencies for both the client and server:

 ```sh
cd server
npm install
cd..
cd client
npm install
```
3. Start MongoDB:Ensure MongoDB is running on your local machine or update the connection string in server/db/index.js. Start the development server:

```sh
cd server
npm start
cd..
cd client
npm run dev
```
4. Open your browser and navigate to http://localhost:5173.

