
window.showRenamePrompt = async function (fileId, currentFileName) {
    const { value: newName } = await Swal.fire({
        title: 'Rename File',
        input: 'text',
        inputValue: currentFileName,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Rename',
        customClass: {
            confirmButton: 'custom-button' // Apply custom class to the confirm button
        },
        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a new file name!';
            }
        }
    });

    if (newName) {
        try {
            const response = await fetch(`/rename/${fileId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newFileName: newName }),
            });

            if (response.ok) {
                Swal.fire('Success!', 'File name updated.', 'success');
            } else {
                Swal.fire('Error!', 'Failed to update file name.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while updating file name.', 'error');
        }
    }
}