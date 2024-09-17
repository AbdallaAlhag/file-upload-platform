window.showRenamePrompt = async function (fileId, currentFileName) {
    const { value: newName } = await Swal.fire({
        title: 'Rename File',
        input: 'text',
        inputValue: currentFileName,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Rename',
        customClass: {
            confirmButton: 'custom-button',
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
                const swalPopup = Swal.fire({
                    title: 'Success!',
                    text: 'File name updated.',
                    icon: 'success',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-button',
                    },
                });
                await swalPopup.then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload(); // Or update the UI to reflect changes
                    }
                });

            } else {
                const swalPopup = Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update file name.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-button',
                    },
                });
            }
        } catch (error) {
            const swalPopup = Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating file name.',
                icon: 'error',
                confirmButtonText: 'Close',
                customClass: {
                    confirmButton: 'custom-button',
                },
            });
        }
    }
}

window.sharePrompt = async function (fileId, currentFileName) {

    const { value: userEmail } = await Swal.fire({
        title: 'Insert Email Address',
        input: 'text',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Share',
        customClass: {
            confirmButton: 'custom-button',
        },

        inputValidator: (value) => {
            if (!value) {
                return 'You need to enter a new file name!';
            }
        }
    });

    if (userEmail) {
        try {
            const response = await fetch(`/share/${fileId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            });

            if (response.ok) {
                const swalPopup = Swal.fire({
                    title: 'Success!',
                    text: 'File Shared.',
                    icon: 'success',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-button',
                    },
                });
                await swalPopup.then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload(); // Or update the UI to reflect changes
                    }
                });

            } else {
                const swalPopup = Swal.fire({
                    title: 'Error!',
                    text: 'Failed to Share file name.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-button',
                    },
                });
            }
        } catch (error) {
            const swalPopup = Swal.fire({
                title: 'Error!',
                text: 'An error occurred while Sharing file name.',
                icon: 'error',
                confirmButtonText: 'Close',
                customClass: {
                    confirmButton: 'custom-button',
                },
            });
        }
    }
}