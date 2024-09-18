file-upload-platform

reference:
    - filePenguin: aaa, aaa
    - nolesdrive: aaa, aaa@aaa,aaa
# todo:
    - validate and sanitize sign up form
    - test different types of files(working: .docx, .pdf, .txt)
    - Work on actions:
        - share -> copy link => have no idea yet (save for later)
    - Add search function and the filters functionality
    -> When you share a file, both users have complete access to that file (I don't mind that, permission to hard)
    -> right click is working but placement is weird
    -> box view resets every time we reload :/
    -> do shareWithMe page
    - !!! LET's leave folder alone for now(can't access files in folders)
Bug: 
    -> Error when uploading diff files not supported
    - uploading file, renaming, and downloading causes errors
    - ! can we upload multiple files with the same name? = Yes
    - Can't style the iframe document and some files don't work (working = txt)
        - docs not working: https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript