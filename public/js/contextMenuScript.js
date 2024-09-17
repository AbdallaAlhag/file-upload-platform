
window.onload = function () {
    const files = document.querySelectorAll('.files');
    const fileList = document.querySelector('.file-list');

    files.forEach(file => {
        const fileId = file.getAttribute('data-id');
        const fileName = file.getAttribute('data-fileName');
        const filePath = file.getAttribute('data-filePath');
        const folder = JSON.parse(file.getAttribute('data-folder'));

        new VanillaContextMenu({
            scope: file, // Apply context menu to each .file-item new VanillaContextMenu({

            menuItems: window.getContextMenuItems(fileId, fileName, filePath, folder),
            customThemeClass: 'vanillaContextMenu-theme',
            customClass: 'vanillaContextMenu',
            preventCloseOnClick: true,
        });
    });

    // remove contextMenu when right clicked inside our file list class and right click outside the file list
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


window.getContextMenuItems = function (fileId, fileName, filePath, folder) {
    return [
        {
            label: 'Preview',
            callback: () => handlePreview(fileName, filePath),
            iconClass: 'fa fa-eye',
        },
        'hr',
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
            callback: () => handleCopy(fileId),
            iconClass: 'fa fa-copy',
        },
        {
            label: 'Star',
            callback: () => handleStar(fileId),
            iconClass: 'fa fa-star',
        },
        'hr',
        {
            label: 'Share',
            iconClass: 'fa fa-share',
            nestedMenu: [
                {
                    label: 'Share',
                    callback: () => handleShare(fileId),
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
            label: 'Move',
            iconClass: 'fa fa-right-long',
            nestedMenu: folder.map(f => ({
                label: f.name,
                callback: () => handleMove(f.id, fileId),
                iconClass: 'fa fa-folder',
            }))
        },
        'hr',
        {
            label: 'Move to Trash',
            callback: () => handleDelete(fileId),
            iconClass: 'fa fa-trash',
        },
    ];
};
