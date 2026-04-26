# Test Cases Project (Next.js + PostgreSQL)

Frontend: Next.js (App Router)  
Backend: PostgreSQL (inspect/manage with pgAdmin)

## Features

- Green/white themed UI with dark mode toggle.
- Header contains:
	- Login button
	- Dark mode/night mode icon
- Landing page contains 4 cards:
	1. Manual test case creation (create, update, delete)
	2. Manual import of test cases from Excel
	3. Cart system
	4. View test cases
- API routes for transferring data to PostgreSQL.

## Pages

- `/` Landing page
- `/create-testcases` Manual CRUD operations
- `/import-testcases` Upload Excel files
- `/cart` Cart system
- `/view-testcases` View all saved test cases
- `/login` Login placeholder page

## API Routes

- `GET /api/init` Create required DB tables
- `GET /api/testcases` Get all test cases
- `POST /api/testcases` Create new test case
- `PUT /api/testcases/:id` Update test case
- `DELETE /api/testcases/:id` Delete test case
- `POST /api/import` Import one or more Excel files (`files` field)
- `GET /api/cart` Get cart items
- `POST /api/cart` Add item to cart (`testCaseId`)
- `DELETE /api/cart` Clear cart
- `DELETE /api/cart/:id` Remove single cart item

## Database Setup

1. Create PostgreSQL database, for example `testcases_db`.
2. Copy `.env.example` to `.env.local` and update `DATABASE_URL`.
3. Start app and open `http://localhost:3000/api/init` once.
	 - This creates tables automatically.
4. Open pgAdmin and verify tables:
	 - `test_cases`
	 - `cart_items`

You can also execute [db/schema.sql](db/schema.sql) manually in pgAdmin query tool.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Every uploaded Excel file is stored as one test case.
- Parsed sheet rows are stored as JSON in PostgreSQL (`test_cases.data`).
