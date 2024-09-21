file-upload-platform

reference:
    - filePenguin: aaa, aaa
    - nolesdrive: aaa, aaa@aaa,aaa
# todo:
    - validate and sanitize sign up form
    - test different types of files(working: .docx, .pdf, .txt, jpg)
        - docx files don't preview, just download
        - xlsx files don't preview, just download 
        - txt is black background and white text, kinda annoying
        - jpg file is half the width of my iframe
        - pdf is super clean, probably the best results
        - png works, same as jpg
        - gif works, quite large but scrolls x and y
    -> Work on actions:
        - share -> copy link => have no idea yet (save for later)
    -> Day's work:
        - !!! LET's leave folder alone for now(can't access files in folders)
            ->have a root folder in my root directory that I need to move to uploads folder
            -> create add folder 
    EXTRA(Low Priority, not essential):
    -> right click should active file.active 
    -> Add sort asc, desc and sort by option (name, modified, types, size)
    -> would be cool to integrate a little step by step tutorial on the site to showcase features
    -> drag and drop files would be cool but idk
# Bug: 
    -> txt files are black background and white text, kinda annoying
    -> got empty results message working on box view, but when we switch to row view it doesn't return cuz we don't refresh page, this is a backend project so it's not a big deal, we can just leave it empty. Too much work for too little results.
    -> if you delete a shared file, it just goes  to the recently deleted of the person who owns it, interesting
    -> filter resets after results
    -> people filter doesn't work!!! correctly with shared with me
    -> right click is working but placement is weird
        -> attempted but kinda broke it so left it alone
    - Can't style the iframe document and some files don't work (Not working = microsoft office files)
        - docs not working: https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
        -> implemented solution above but doesn't work on local host and have to test when deployed. The pro is that it doesn't download and shows can't preview except when you click on the action button to preview. = better.

# Realization:
    - Didn't use the queries file and wrote my queries in the controller, might be useful to split it
    - had a lot of script and style files in ejs, seemed easier to group them where they belong
    - refactored views page to be more dynamic
