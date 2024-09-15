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
            document.querySelector('[data-action="delete"]').onclick = () => handleDelete(fileId);
            document.querySelector('[data-action="preview"]').onclick = () => handlePreview(fileId);
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

    function handlePreview() {
    }

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