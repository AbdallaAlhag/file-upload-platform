// script to activate files row
document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.querySelector('tbody');

    tbody.addEventListener('click', function (e) {
        const clickedRow = e.target.closest('.files');
        if (clickedRow) {
            // Remove 'active' class from all rows
            tbody.querySelectorAll('.files').forEach(row => row.classList.remove('active'));

            // Add 'active' class to the clicked row
            clickedRow.classList.add('active');
        }
    });

});

// script to show/hide context menu
document.addEventListener('DOMContentLoaded', () => {
    const contextMenu = document.getElementById('contextMenu');
    let currentButton = null;

    document.querySelectorAll('.more-options').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default browser context menu
            currentButton = button;
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.classList.add('visible');

            const fileId = event.currentTarget.getAttribute('data-id');
            const fileName = event.currentTarget.getAttribute('data-name');
            const filePath = event.currentTarget.getAttribute('data-path');

            console.log(fileId, fileName, filePath)
            document.querySelector('[data-action="delete"]').onclick = () => handleDelete(fileId);
            document.querySelector('[data-action="preview"]').onclick = () => togglePreviewModal(fileName, filePath);
            document.querySelector('[data-action="share"]').onclick = () => handleShare(fileId);
        });

    });

    // Function to hide the context menu
    function hideContextMenu(event) {
        if (!contextMenu.contains(event.target) && currentButton && !currentButton.contains(event.target)) {
            contextMenu.classList.remove('visible');
        }
    }

    document.addEventListener('click', (event) => {
        hideContextMenu(event);
    });

    // Preview modal function
    let modalInstance = null;
    function togglePreviewModal(fileName, filePath) {
        const menu = document.querySelector('.vanillaContextMenu');
        const previewModal = document.getElementById('previewModal');
        if (!previewModal) {
            console.error("Preview modal not found in the DOM.");
            return;
        }

        // Check if elements exist before accessing properties
        const modalLabel = document.getElementById('previewModalLabel');
        const filePreview = document.getElementById('filePreview');

        if (modalLabel && filePreview && previewModal) {
            if (modalInstance) {
                modalInstance.hide();
                modalInstance = null;
            } else {
                modalLabel.textContent = fileName;
                filePreview.src = filePath;
                // Initialize the Bootstrap modal if not already initialized
                if (!modalInstance) {
                    modalInstance = new bootstrap.Modal(previewModal, {
                        backdrop: 'static',
                        keyboard: false,
                    });
                }
                modalInstance.show();
            }
        } else {
            console.error("Modal elements not found in the DOM.");
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        if (!modalInstance) {
            const previewModal = document.getElementById('previewModal');
            if (previewModal) {
                modalInstance = new bootstrap.Modal(previewModal, {
                    backdrop: 'static',
                    keyboard: false,
                });
            }
        }
    });

    function handleShare() {
    }

    async function handleDelete(fileId) {
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
});

async function starFile(fileId) {
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