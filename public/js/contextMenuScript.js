window.onload = function () {
    const contextMenuRightClick = new VanillaContextMenu({
        scope: document.querySelector('.file-list'), // Right-click on the main area
        menuItems: [
            {
                label: 'Copy',
                callback: () => {
                    console.log('Copy clicked');
                    // Add your functionality here
                },
            },
            'hr', // Horizontal line in the menu
            {
                label: 'Paste',
                callback: () => {
                    console.log('Paste clicked');
                    // Add your functionality here
                },
            },
            {
                label: 'Cut',
                callback: () => {
                    console.log('Cut clicked');
                    // Add your functionality here
                },
                iconClass: 'fa fa-scissors', // FontAwesome icon
            },
        ],
    });
};
