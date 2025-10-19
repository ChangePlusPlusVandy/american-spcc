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


### 3. Set up Local Supabase (PostgreSQL)

The project uses Supabase for PostgreSQL and Prisma ORM. To work locally, you'll use a Dockerized Supabase instance.

#### Install the Supabase CLI

**macOS (Homebrew):**

```bash
brew install supabase/tap/supabase
```

**Other platforms:** See the [full installation guide](https://supabase.com/docs/guides/cli)

#### Initialize and Start Supabase Locally

Docker Desktop must be installed and running (download here: https://www.docker.com/products/docker-desktop/)

From the project backend (where the `supabase` folder will live):

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

### 4. Configure environment variables



Create a `.env` file in the `/backend` directory:


```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```


### 5. Initialize the database schema

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

When you're done developing, stop the containers to free ports and memory:

```bash
supabase stop
```

### 6. Run prettier

Before each commit, run prettier to fix formatting:

```bash
npm run format

