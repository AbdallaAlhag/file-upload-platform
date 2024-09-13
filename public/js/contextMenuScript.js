window.onload = function () {
    const contextMenuRightClick = new VanillaContextMenu({
        scope: document.querySelector('.file-list'), // Right-click on the main area
        menuItems: [
            {
                label: 'Copy',
                callback: handleCopy,
                iconClass: 'fa fa-copy',
            },
            'hr', // Horizontal line in the menu
            {
                label: 'Paste',
                callback: handlePaste,
                iconClass: 'fa fa-paste',
            },
            'hr', // Horizontal line in the menu
            {
                label: 'Cut',
                callback: handleCut,
                iconClass: 'fa fa-scissors', // FontAwesome icon
            },
        ],
        customThemeClass: 'vanillaContextMenu-theme',
        customClass: 'vanillaContextMenu',
        beforeRender: positionMenu
    });



    // Menu positioning function
    function positionMenu(menu, event) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        const { offsetWidth, offsetHeight } = menu;
        let left = clientX;
        let top = clientY;

        // Position the menu on the left side of the cursor
        left -= offsetWidth;

        // Ensure the menu stays within the viewport
        if (left < 0) left = 0;
        if (top + offsetHeight > innerHeight) top = innerHeight - offsetHeight;

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    }

    // Menu item handlers
    function handleCopy() {
        console.log('Copy clicked');
        // Add your functionality here
    }

    function handlePaste() {
        console.log('Paste clicked');
        // Add your functionality here
    }

    function handleCut() {
        console.log('Cut clicked');
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
};