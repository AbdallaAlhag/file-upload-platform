# todo:
    Deploy on railway
# EXTRA(Low Priority, not essential):
    -> Add sort asc, desc and sort by option (name, modified, types, size)
    -> would be cool to integrate a little step by step tutorial on the site to showcase features
    -> drag and drop files would be cool but idk

# Not perfect:
    -> Folder missing Owner section
    -> Got upload error message displaying but indexData and folders not loading
    -> txt files are black background and white text, kinda annoying
    -> got empty results message working on box view, but when we switch to row view it doesn't return cuz we don't refresh page, this is a backend project so it's not a big deal, we can just leave it empty. Too much work for too little results.
    -> if you delete a shared file, it just goes  to the recently deleted of the person who owns it, interesting
    -> filter resets after results
    - test different types of files(working: .docx, .pdf, .txt, jpg)
        - docx files don't preview, just download
        - xlsx files don't preview, just download 
        - txt is black background and white text, kinda annoying
        - jpg file is half the width of my iframe
        - pdf is super clean, probably the best results
        - png works, same as jpg
        - gif works, quite large but scrolls x and y
    -> Can't style the iframe document and some files don't work (Not working = microsoft office files)
        - docs not working: https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
        -> implemented solution above but doesn't work on local host and have to test when deployed. The pro is that it doesn't download and shows can't preview except when you click on the action button to preview. = better.
# Bug: 
    -> toggle between box and row view 10 times breaks the box view
    -> people filter doesn't work correctly with shared with me !!!
    -> right click is working but placement is weird
        -> attempted but kinda broke it so left it alone
    -> get Uncaught SyntaxError: Identifier 'fileInput' has already been declared (at (index):159:11) at my header.ejs file but when i remove or fix it, it breaks lol
# Realization:
    - Didn't use the queries file and wrote my queries in the controller, might be useful to split it but easier to have them together, rewriting some code but easier to tweak it 
    - had a lot of script and style files in ejs, seemed easier to group them where they belong
    - refactored views page to be more dynamic
    -> sweetAlert2 is soooo clean and easy to use


# File Upload Platform

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





