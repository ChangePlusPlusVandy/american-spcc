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

### 2. Install PostgreSQL

The project uses Supabase for PostgreSQL and Prisma ORM. To work locally, you'll use a Dockerized Supabase instance.

#### Install the Supabase CLI

**macOS (Homebrew):**

```bash
brew install supabase/tap/supabase
```

**Other platforms:** See the [full installation guide](https://supabase.com/docs/guides/cli)

#### Initialize and Start Supabase Locally

From the project root (where the `supabase` folder will live):

```bash
supabase start
```

This launches local containers for:
- PostgreSQL (port `54322`)
- Supabase API (port `54321`)
- Supabase Studio (port `54323`)

After it starts, you'll see a database URL like:

```
postgres://postgres:postgres@localhost:54322/postgres
```

Copy that URL for the next step.

### 3. Configure environment variables

Create a `.env.local` file in the `/backend` directory:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

**Important:** Do not commit `.env.local` — it's already in `.gitignore`.

### 4. Initialize the database schema

Push your Prisma schema to the local Supabase PostgreSQL database:

```bash
cd backend
npx prisma db push
```

Then generate the Prisma client:

```bash
npx prisma generate
```

You can verify tables in Supabase Studio at http://localhost:54323

### 5. Clone the repository

In a terminal, go to a folder where you'd like to store this project (e.g. `/projects` or `/changeplusplus`), then clone it with Git:

```bash
# Using SSH
git clone git@github.com:ChangePlusPlusVandy/american-spcc.git

# OR using HTTPS
git clone https://github.com/ChangePlusPlusVandy/american-spcc.git
