// Menu item handlers
window.handleDelete = async function (fileId) {
    const menu = document.querySelector('.vanillaContextMenu');
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    try {
        const response = await fetch(`/delete/${fileId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            location.reload(); // Reload the page to reflect the changes
        } else {
            console.error('Error Deleting file');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
window.handleRename = async function (fileId, fileName) {
    // contextMenu.close();
    const menu = document.querySelector('.vanillaContextMenu');
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    showRenamePrompt(fileId, fileName);
}
window.handleDownload = async function (fileId, fileName) {
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
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

let modalInstance = null;
window.initializeModal = function () {
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        modalInstance = new bootstrap.Modal(previewModal, {
            backdrop: 'static',
            keyboard: false,
        });
    }
}
window.handlePreview = function (fileName, filePath, fileType) {
    const menu = document.querySelector('.vanillaContextMenu');
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    const previewModal = document.getElementById('previewModal');
    if (!previewModal) {
        console.error("Preview modal not found in the DOM.");
        return;
    }
    const modalLabel = document.getElementById('previewModalLabel');
    const filePreview = document.getElementById('filePreview');

    // Check if elements exist before accessing properties
    if (modalLabel && filePreview && previewModal) {
        modalLabel.textContent = fileName;
        if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // doesn't work like i wanted on local host but does show not available to preview
            filePreview.src = `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`;
        }
        else {
            filePreview.src = filePath;
        }

        // Initialize the Bootstrap modal if not already initialized
        if (!modalInstance) {
            initializeModal();
        }
        modalInstance.show();
    } else {
        console.error("Modal elements not found in the DOM.");
    }

}

// window.hideModal = function () {
//     if (modalInstance) {
//         modalInstance.hide();
//     } else {
//         console.error("Modal instance not initialized.");
//     }
// };
document.addEventListener('DOMContentLoaded', initializeModal);

window.handleCopy = async function (fileId) {
    try {
        const response = await fetch(`/copy/${fileId}`, {
            method: 'POST',
        });

        if (response.ok) {
            location.reload(); // Reload the page to reflect the changes
        } else {
            console.error('Error Copying file');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.handleStar = async function (fileId) {
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

window.handleShare = function (fileId) {
    const menu = document.querySelector('.vanillaContextMenu');
    const nestedMenu = document.querySelector('.nested-context-menu');
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    if (nestedMenu) {
        nestedMenu.style.display = 'none'; // Hides the context menu
    }
    sharePrompt(fileId);
}

window.handleMove = async function (folderId, fileId) {
    const menu = document.querySelector('.vanillaContextMenu');
    const nestedMenu = document.querySelector('.nested-context-menu');
    if (menu) {
        menu.style.display = 'none'; // Hides the context menu
    }
    if (nestedMenu) {
        nestedMenu.style.display = 'none'; // Hides the context menu
    }
    try {
        const response = await fetch(`/move/${folderId}/${fileId}`, {
            method: 'PATCH',
        });

        if (response.ok) {
            // reload the page
            location.reload();
        } else {
            console.error('Error moving file');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.handleCopyLink = function () {
    // Add your functionality here
}


