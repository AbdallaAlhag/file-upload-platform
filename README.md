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
    - Work on actions:
        - share -> copy link => have no idea yet (save for later)
    - Add filters functionality
    - !!! LET's leave folder alone for now(can't access files in folders)
    -> delete from recently deleted after 30 days!
    -> restore files from recently deleted
    -> right click should active file.active 
# Bug: 
    -> box view resets every time we reload :/
    -> right click is working but placement is weird
        -> attempted but kinda broke it so left it alone
    - Can't style the iframe document and some files don't work (working = txt)
        - docs not working: https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript

# Realization:
    - Didn't use the queries file and wrote my queries in the controller, might be useful to split it
    - had a lot of script and style files in ejs, seemed easier to group them where they belong
    - refactored views page to be more dynamic
