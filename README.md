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
    - Add search function and the filters functionality
    -> When you share a file, both users have complete access to that file (I don't mind that, permission to hard)
    - !!! LET's leave folder alone for now(can't access files in folders)
    -> delete from recently deleted after 30 days!
    -> restore files from recently deleted
    -> use more button in box mode not connected
        -> just gonna get rid of ellipse menu in box mode lol too much work atm to transfer it to row
# Bug: 
    -> box view resets every time we reload :/
    -> right click is working but placement is weird
        -> attempted but kinda broke it so left it alone
    - Can't style the iframe document and some files don't work (working = txt)
        - docs not working: https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript