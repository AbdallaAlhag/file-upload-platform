

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
            method: 'POST',
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
window.handlePreview = async function (fileName, filePath, fileType) {
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


        try {
            // Make an API call to your backend to get the file's public URL
            const response = await fetch(`/preview/${filePath}`, {
                method: 'GET', // Or POST depending on how you implement it
            });

            if (!response.ok) {
                throw new Error('Error fetching file URL');
            }

            const { fileUrl } = await response.json(); // Assuming response is in JSON and contains the URL

            const filePreview = document.getElementById('filePreview');
            const modalLabel = document.getElementById('previewModalLabel');

            if (fileType.includes('application/vnd') || fileType.includes('application/pdf')) {
                // If it's a Google Docs/Sheets compatible file type, use Google Viewer
                filePreview.src = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
            } else {
                // Otherwise, preview the file directly
                filePreview.src = fileUrl;
            }

            // Display the modal or update UI as needed
            modalInstance.show();

        } catch (error) {
            console.error('Error fetching file preview:', error);
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
    if (folderId === null) {
        return
    }
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
    console.log('Copy link clicked');
}


