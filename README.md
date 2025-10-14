# American SPCC Learning Management System

Learning Management System (LMS) monorepo for [The American Society for the Positive Care of Children (American SPCC)](https://americanspcc.org/), a national nonprofit supporting parents, caregivers, and educators through evidence-based resources and interactive learning.


### 1. Install dependencies

```bash
npm install
```

Run this in both the `frontend` and `backend` folders.

### 2. Run the development servers

**Backend (Express + Prisma + PostgreSQL)**

```bash
cd backend
npm run dev
```

The backend will run on http://localhost:8000.

**Frontend (React + Vite)**

```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173.

## Prerequisites

### 1. Install Node.js

> [!NOTE]
> You'll need Node 18 or higher. Download it from [nodejs.org](https://nodejs.org) or install with Homebrew.

**Install for macOS:**

```bash
brew install node
```

**Install for Windows:**

```powershell
choco install nodejs
```

### 2. Install PostgreSQL

> [!TIP]
> PostgreSQL stores your LMS data and is required for Prisma.

**For macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Database Setup**

TBD

### 3. Clone the repository

In a terminal, go to a folder where you'd like to store this project (e.g. `/projects` or `/changeplusplus`), then clone it with Git:

```bash
# Using SSH
git clone git@github.com:ChangePlusPlusVandy/american-spcc.git

# OR using HTTPS
git clone https://github.com/ChangePlusPlusVandy/american-spcc.git
