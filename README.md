# 📝 Recursive Todo App

> A modern todo application with recursive subtasks, built with Remix and Appwrite

## 🚀 Features

### Core Features (Required)
- 🚧 User authentication (signup/login) with Appwrite
- 🚧 Recursive todo lists with unlimited nested subtasks
- 🚧 CRUD operations for tasks
- 🚧 Data persistence with Appwrite Database
- 🚧 Form validation (client & server-side)
- 🚧 Welcome email via Appwrite Functions
- 🚧 UI tests with Vitest/Playwright

### Additional Features (Extended)
- 🚧 **4 Category Pages**: Backlog, Today, Upcoming, Completed
- 🚧 **Dual View Modes**: List view and Kanban Board view
- 🚧 **Drag & Drop**: Intuitive task management with @dnd-kit
- 🚧 **Modal Details**: Click to view/edit task details and manage subtasks
- 🚧 **Due Dates**: Automatic categorization based on deadline
- 🚧 **Priority Levels**: Low, Medium, High with color coding
- 🚧 **Progress Tracking**: Automatic calculation for parent tasks
- 🎤 **[Optional] Voice Input**: Voice-to-text for task creation

---

## 📋 Development Progress

### 🚧 Phase 1: Infrastructure & Setup (2/3) - IN PROGRESS
- [✅] **Task 1**: Project Setup & Configuration
  - ✅ Remix + TypeScript initialized
  - ✅ Dependencies configured (@dnd-kit, date-fns, lucide-react)
  - ✅ Environment variables template
  - ✅ Folder structure created

- [✅] **Task 2**: Appwrite Backend Configuration
  - ✅ Appwrite SDK integrated
  - ✅ Server & client configurations
  - ✅ Database schema planned
  - ✅ Database collections setup (manual step required)

- [x] **Task 3**: Basic Layout & Navigation
  - ⏳ Root layout with CSS
  - ⏳ Routes defined
  - ⏳ Sidebar navigation component (next)

### 🚧 Phase 2: Authentication (0/4)
- [x] **Task 4**: Signup & Login Forms UI
  - ⏳ Signup page with form
  - ⏳ Login page with form
  - ⏳ TailwindCSS styling

- [x] **Task 5**: Authentication Server Actions
  - ⏳ Signup action with Appwrite
  - ⏳ Login action with session creation
  - ⏳ Auto-redirect after auth

- [x] **Task 6**: Form Validation
  - ⏳ Client-side validation
  - ⏳ Server-side validation
  - ⏳ Error display

- [x] **Task 7**: Protected Routes & Session Management
  - ⏳ Session middleware
  - ⏳ Route protection
  - ⏳ Logout functionality

### ⏳ Phase 3: Data Models & Types (0/2)
- [x] **Task 8**: TypeScript Types & Interfaces
  - ⏳ Todo, Priority, Status types
  - ⏳ User interface
  - ⏳ Input/Update types

- [x] **Task 9**: Appwrite Service Layer
  - ⏳ CRUD functions for todos
  - ⏳ Subtask management
  - ⏳ Status filtering
  - ⏳ Utility functions (date, status, progress)

### ⏳ Phase 4: Create Tasks (0/2)
- [ ] **Task 10**: Create Todo Form/Modal
  - ⏳ Modal component
  - ⏳ Form fields (title, description, dueDate, priority)
  - ⏳ Date picker integration

- [ ] **Task 11**: Create Todo Action
  - ⏳ Server action
  - ⏳ Automatic status assignment
  - ⏳ Optimistic UI updates

### ⏳ Phase 5: List View (0/3)
- [ ] **Task 12**: Todo List Component
  - ⏳ List display component
  - ⏳ Priority & date badges
  - ⏳ Checkbox for completion

- [ ] **Task 13**: List View - Data Loading
  - ⏳ Loader functions per route
  - ⏳ Status-based filtering
  - ⏳ Loading states

- [ ] **Task 14**: List View - Basic Interactions
  - ⏳ Toggle completion
  - ⏳ Delete task
  - ⏳ UI updates

### ⏳ Phase 6: Board View (0/2)
- [ ] **Task 15**: Board View Component
  - ⏳ Kanban board layout
  - ⏳ 4 columns (Backlog, Today, Upcoming, Completed)
  - ⏳ Task cards

- [ ] **Task 16**: View Toggle Implementation
  - ⏳ List/Board switcher
  - ⏳ LocalStorage persistence
  - ⏳ Conditional rendering

### ⏳ Phase 7: Drag & Drop (0/2)
- [ ] **Task 17**: Drag & Drop Setup
  - ⏳ @dnd-kit configuration
  - ⏳ Draggable components
  - ⏳ Drop zones

- [ ] **Task 18**: Drag & Drop Logic
  - ⏳ Status update on drop
  - ⏳ Database persistence
  - ⏳ Visual feedback

### ⏳ Phase 8: Task Details Modal (0/3)
- [ ] **Task 19**: Todo Details Modal - UI
  - ⏳ Modal component
  - ⏳ Full task info display
  - ⏳ Subtasks list

- [ ] **Task 20**: Todo Details Modal - Edit
  - ⏳ Inline editing
  - ⏳ Save changes
  - ⏳ Modal controls

- [ ] **Task 21**: Subtasks Management
  - ⏳ Add subtask form
  - ⏳ Recursive rendering
  - ⏳ CRUD for subtasks

### ⏳ Phase 9: Smart Categorization (0/1)
- [ ] **Task 22**: Smart Status Assignment
  - ⏳ Auto-categorization logic
  - ⏳ Daily status updates
  - ⏳ Overdue detection

### ⏳ Phase 10: Progress Tracking (0/1)
- [ ] **Task 23**: Subtask Progress Calculation
  - ⏳ Recursive calculation
  - ⏳ Progress bars
  - ⏳ Visual indicators

### ⏳ Phase 11: Appwrite Function (0/1)
- [ ] **Task 24**: Welcome Email Function
  - ⏳ Appwrite Function creation
  - ⏳ Email service integration
  - ⏳ Trigger setup

### ⏳ Phase 12: Testing (0/1)
- [ ] **Task 25**: UI & Integration Tests
  - ⏳ Vitest setup
  - ⏳ Playwright setup
  - ⏳ Component tests
  - ⏳ E2E tests

### ⏳ Phase 13: DevOps & Deployment (0/2)
- [ ] **Task 26**: CI/CD Pipeline Setup
  - ⏳ GitHub Actions workflow
  - ⏳ Pipeline documentation
  - ⏳ Environment variables

- [ ] **Task 27**: Production Deployment
  - ⏳ Cloud platform selection
  - ⏳ Production Appwrite setup
  - ⏳ Final deployment

### ⏳ Phase 14: Polish (0/2)
- [ ] **Task 28**: UI/UX Polish
  - ⏳ Animations
  - ⏳ Loading states
  - ⏳ Empty states
  - ⏳ Responsive design

- [ ] **Task 29**: [OPTIONAL] Voice Input
  - ⏳ Web Speech API
  - ⏳ Voice button
  - ⏳ Browser fallback

---

## 🛠 Tech Stack

- **Framework**: [Remix](https://remix.run) v2.8 with TypeScript
- **Backend**: [Appwrite](https://appwrite.io) (Auth, Database, Functions)
- **Styling**: TailwindCSS v3.4
- **Drag & Drop**: [@dnd-kit](https://dndkit.com)
- **Date Handling**: date-fns
- **Icons**: lucide-react
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: TBD (Vercel/Netlify)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recursive-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Appwrite**
   - Create a new project in Appwrite Console
   - Create a database
   - Create a collection named "todos" with the following attributes:
     - `title` (string, required)
     - `description` (string, optional)
     - `dueDate` (string, optional)
     - `priority` (enum: low, medium, high)
     - `status` (enum: backlog, today, upcoming, completed)
     - `parentId` (string, optional)
     - `userId` (string, required)
     - `createdAt` (string, required)
     - `completedAt` (string, optional)
     - `order` (integer, required)
   
   - Set up indexes:
     - `userId` (ascending)
     - `status` (ascending)
     - `parentId` (ascending)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Appwrite credentials:
   ```env
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=<your-project-id>
   APPWRITE_API_KEY=<your-api-key>
   APPWRITE_DATABASE_ID=<your-database-id>
   APPWRITE_TODOS_COLLECTION_ID=<your-collection-id>
   SESSION_SECRET=<random-secret-string>
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
recursive-todo-app/
├── app/
│   ├── components/          # React components
│   ├── lib/                 # Utilities & services
│   │   ├── appwrite.server.ts   # Server-side Appwrite client
│   │   ├── appwrite.client.ts   # Client-side Appwrite client
│   │   ├── todos.server.ts      # Todo CRUD operations
│   │   └── utils.ts             # Helper functions
│   ├── routes/              # Remix routes
│   │   ├── _index.tsx       # Home page (redirects)
│   │   ├── signup.tsx       # Signup page
│   │   ├── login.tsx        # Login page
│   │   ├── backlog.tsx      # Backlog view
│   │   ├── today.tsx        # Today view
│   │   ├── upcoming.tsx     # Upcoming view
│   │   └── completed.tsx    # Completed view
│   ├── styles/              # CSS files
│   │   └── app.css          # Global styles + Tailwind
│   ├── types/               # TypeScript types
│   │   └── todo.ts          # Todo-related types
│   └── root.tsx             # Root component
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:ui
```

---

## 🚢 Deployment

### CI/CD Pipeline Plan

The CI/CD pipeline will automate the following stages:

1. **Install Dependencies**
   ```bash
   npm ci
   ```

2. **Lint Code**
   ```bash
   npm run lint
   ```

3. **Type Check**
   ```bash
   npm run typecheck
   ```

4. **Run Tests**
   ```bash
   npm run test
   npm run test:ui
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Deploy to Cloud**
   - Platform: **Vercel** (or Netlify/Railway)
   - Trigger: Push to `main` branch
   - Environment: Production

**Tools**: GitHub Actions

Example workflow file (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
      - uses: vercel/actions/deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Git Commit Convention

Commits are linked to tasks using the following format:

```
[Task-X] Brief description

Detailed explanation if needed
```

Examples:
- `[Task-1] Initialize Remix project with TypeScript`
- `[Task-4] Create signup form with validation`
- `[Task-17] Implement drag and drop with dnd-kit`

---

## 🤝 Contributing

This is a test task assignment for Comuneo. Contributions are not expected, but feedback is welcome!

---

## 📧 Contact

**Applicant**: [Roman Klimov]  
**Email**: guy.malachi@comuneo.org (for submission)  
**Repository**: [Link to GitHub repo](https://github.com/milk-2-dev/best-todo)

---

## 📄 License

This project is created as part of a job application process for Comuneo.

---

## 🙏 Acknowledgments

- Comuneo team for the interesting challenge
- Remix & Appwrite communities for excellent documentation
- @dnd-kit for the smooth drag-and-drop experience
