

# File Upload Platform
[View Live](https://file-upload-platform-production.up.railway.app/)

A web application to upload, manage, and share files, built with **Express.js**, **Node.js**, and **Prisma**. This project includes features like file previews, sharing, recently deleted files, and guest account functionality.

## Features

- **User Registration and Authentication**: Create an account, log in, and manage sessions.
- **File Upload and Management**: Upload files, rename, share, delete, and preview them.
- **Guest Account**: Option to log in as a guest with temporary access.
- **File Previews**: View files such as PDFs, images, and text files directly in the browser.
- **Recently Deleted Files**: Recover files deleted within a certain period.
- **Sorting and Filtering**: Sort files by name, type, size, and date. Filter by ownership or shared files.
- **Pagination**: Display files efficiently with pagination.



Tech Stack
----------

### Backend

-   **Node.js**: JavaScript runtime
-   **Express.js**: Web framework
-   **Prisma**: ORM for database management
-   **Passport.js**: Authentication middleware
-   **Multer**: Middleware for file handling
-   **Express-Validator**: Middleware for validation

### Frontend

-   **EJS**: Templating engine for dynamic views
-   **Bootstrap**: Frontend framework for styling
-   **SweetAlert2**: Alert modals
-   **Vanilla-ContextMenu**: Custom right-click menus

### Database

-   **PostgreSQL**: Relational database for storing files and metadata

Dependencies
------------

-   @prisma/client: Prisma ORM
-   bcryptjs: For password hashing
-   ejs: Templating engine
-   express: Node.js web framework
-   express-session: Session middleware
-   multer: Middleware for file uploads
-   passport: Authentication middleware
-   pg: PostgreSQL client
-   sweetalert2: Alert modals
-   uuid: Generate unique identifiers

## Future Improvements

- **Guest Login**: Add a "Login as Guest" button, which seeds default files on first-time use and resets on logout.
- **Sorting Options**: Implement ascending and descending sorting by file name, modified date, type, and size.
- **Interactive Tutorial**: A step-by-step tutorial to guide users through app features.
- **Drag and Drop Upload**: Add the ability to drag and drop files for easier uploads.

## Known Issues

- **View Toggle Bug**: Switching between grid (box) and list (row) views multiple times can cause display issues.
- **Shared Files Deletion**: Deleting a shared file only removes it from the owner’s "Recently Deleted" section.
- **Right-click Menu**: Right-click placement is sometimes misaligned.
- **File Preview Styling**: Some files (e.g., text files) are displayed with a black background and white text, which might not be ideal for readability.
- **Microsoft Office Previews**: DOCX and XLSX files currently download instead of previewing.

Realizations and Refactoring
----------------------------

-   Moved scripts and styles into appropriate EJS templates for better organization.
-   Consolidated query logic inside controllers for easier adjustments.
-   SweetAlert2 is clean and highly effective for user notifications.

## Usage

1. Clone this repository.
2. Create a `.env` file with the following variables:
```bash
   DATABASE_URL='postgresql://user:password@localhost:5432/file_upload_platform?schema=public'
   SECRET_KEY='example'
   PORT=3000
```

## Install Dependencies

```bash
npm install 
```

## Run Migrations

```bash
npm run prisma migrate deploy
```

## Start the Server


```bash
npm start
```
## Seed default files
```bash
npm seed
```

Navigate to http://localhost:3000 in your web browser.

API Routes
----------

### User Routes

-   GET /signup | POST /signup - Register a new user
-   GET /login | POST /login - Log in an existing user
-   GET /logout - Log out the current user

### File Management Routes

-   POST /upload - Upload File
-   POST /folder/:name - Create Folder
-   POST /download/:id - Download File
-   PATCH /rename/:id - Rename File
-   PATCH /share/:id - Share File
-   PATCH /starred/:id - Star File
-   DELETE /delete/:id - Delete File
-   PATCH /move/:folder/:id - Move File
-   PATCH /restore/:id - Restore File

### View and Sorting Routes

-   GET /folder/:id - View Folder
-   GET /search - Search Files
-   GET /filter - Filter Files
-   GET /recent - Recent Files
-   GET /starred - Starred Files
-   GET /recentlyDeleted - Recently Deleted Files





