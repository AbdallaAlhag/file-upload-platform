window.onload = function () {
    const files = document.querySelectorAll('.files');
    // const contextMenuRightClick = new VanillaContextMenu({
    // scope: document.querySelector('.file-list'), // Right-click on the main area
    files.forEach(file => {
        const fileId = file.getAttribute('data-id');
        const fileName = file.getAttribute('data-fileName');
        new VanillaContextMenu({
            scope: file, // Apply context menu to each .file-item element

            menuItems: [
                {
                    label: 'Preview',
                    callback: handlePreview,
                    iconClass: 'fa fa-eye',
                },
                'hr', // Horizontal line in the menu
                {
                    label: 'Download',
                    callback: () => handleDownload(fileId, fileName),
                    iconClass: 'fa fa-download',
                },
                {
                    label: 'Rename',
                    callback: () => handleRename(fileId, fileName),
                    iconClass: 'fa fa-pen-to-square',
                },
                {
                    label: 'Make a copy',
                    callback: handleCopy,
                    iconClass: 'fa fa-copy',
                },
                'hr', // Horizontal line in the menu
                {
                    label: 'Share',
                    iconClass: 'fa fa-share',
                    nestedMenu: [
                        {
                            label: 'Share',
                            callback: handleShare,
                            iconClass: 'fa fa-share',
                        },
                        {
                            label: 'Copy Link',
                            callback: handleCopyLink,
                            iconClass: 'fa fa-link',
                        }
                    ]
                },
                {
                    label: 'Organize',
                    iconClass: 'fa fa-folder-open',
                    nestedMenu: [
                        {
                            label: 'Move',
                            callback: handleMove,
                            iconClass: 'fa fa-right-long',
                        },
                        {
                            label: 'Star',
                            callback: () => handleStarred(fileId),
                            iconClass: 'fa fa-star',
                        }
                    ]
                },
                'hr', // Horizontal line in the menu
                {
                    label: 'Move to Trash',
                    callback: handleDelete,
                    iconClass: 'fa fa-trash',
                },
            ],
            customThemeClass: 'vanillaContextMenu-theme',
            customClass: 'vanillaContextMenu',
            preventCloseOnClick: true,
        });
    });


    // Menu item handlers
    function handleDelete() {
        console.log('Delete clicked');
        // Add your functionality here
    }
    async function handleRename(fileId, fileName) {
        // contextMenu.close();
        const menu = document.querySelector('.vanillaContextMenu');
        if (menu) {
            menu.style.display = 'none'; // Hides the context menu
        }

        showRenamePrompt(fileId, fileName);
    }
    async function handleDownload(fileId, fileName) {
        const ext = fileName.split('.').pop();
        const fileExt = ext.toLowerCase();
        const name = fileName.split('.').slice(0, -1).join('.');
        try {
            const response = await fetch(`/download/${fileId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob(); // Convert response to a Blob (file object)
            const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
            const link = document.createElement('a'); // Create a temporary anchor element
            link.href = url;
            link.download = `${name}.${fileExt}`;
            // link.download = 'filename.ext'; // Specify a filename with an appropriate extension
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link); // Remove the link element after triggering the download
            window.URL.revokeObjectURL(url); // Release the URL object
            console.log('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }
    function handlePreview() {
        console.log('Preview clicked');
        // Add your functionality here
    }

    function handleCopy() {
        console.log('Copy clicked');
        // Add your functionality here
    }

    async function handleStarred(fileId) {
        try {
            const response = await fetch(`/starred/${fileId}`, {
                method: 'PATCH',
            });

            if (response.ok) {
                location.reload(); // Reload the page to reflect the changes
            } else {
                console.error('Error starring file');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleShare() {
        console.log('Share clicked');
        // Add your functionality here
    }

    function handleMove() {
        console.log('Move clicked');
        // Add your functionality here
    }

    function handleCopyLink() {
        console.log('Copy Link clicked');
        // Add your functionality here
    }


    // remove contextMenu when right clicked inside our file list class and right click outside the file list
    const fileList = document.querySelector('.file-list');

    if (fileList) {
        fileList.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const contextMenu = document.getElementById('contextMenu');
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.classList.remove('visible');
        });
    }
    // Hide context menu on right-click outside the file list
    document.addEventListener('contextmenu', (event) => {
        const contextMenu = document.getElementById('contextMenu');
        const fileList = document.querySelector('.file-list');

        if (contextMenu && contextMenu.classList.contains('visible') && !fileList.contains(event.target)) {
            contextMenu.classList.remove('visible');
        }
    });

    // if user right clicks, it activiates the row and highlights it
    document.addEventListener('DOMContentLoaded', function () {
        const tbody = document.querySelector('tbody');

        tbody.addEventListener('contextmenu', function (e) {
            const clickedRow = e.target.closest('.files');
            if (clickedRow) {
                // Remove 'active' class from all rows
                tbody.querySelectorAll('.files').forEach(row => row.classList.remove('active'));

                // Add 'active' class to the clicked row
                clickedRow.classList.add('active');
            }
        });
    });
};