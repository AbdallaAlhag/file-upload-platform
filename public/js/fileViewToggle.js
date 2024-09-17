
document.addEventListener('DOMContentLoaded', function () {
  const rowViewSwitch = document.getElementById('rowViewSwitch');
  const boxViewSwitch = document.getElementById('boxViewSwitch');
  const fileContainer = document.getElementById('fileContainer');
  const files = document.querySelectorAll('.files');

  rowViewSwitch.addEventListener('click', function () {
    setActiveView('row');
  });

  boxViewSwitch.addEventListener('click', function () {
    setActiveView('box');
  });

  function setActiveView(view) {
    if (view === 'row') {
      rowViewSwitch.classList.add('active');
      boxViewSwitch.classList.remove('active');
      fileContainer.classList.remove('box-view');
      removeBoxView();
      addRowViewTooltips();
    } else {
      boxViewSwitch.classList.add('active');
      rowViewSwitch.classList.remove('active');
      fileContainer.classList.add('box-view');
      createBoxView();
    }
    const fileBoxes = document.querySelectorAll('.file-box');
    const fileList = document.querySelector('.file-list');

    fileBoxes.forEach(fileBox => {
      const fileId = fileBox.getAttribute('data-id');
      const fileName = fileBox.getAttribute('data-fileName');
      const filePath = fileBox.getAttribute('data-filePath');
      const folder = JSON.parse(fileBox.getAttribute('data-folder'));

      new VanillaContextMenu({
        scope: fileBox, // Apply context menu to each .file-item element
        menuItems: window.getContextMenuItems(fileId, fileName, filePath, folder),
        customThemeClass: 'vanillaContextMenu-theme',
        customClass: 'vanillaContextMenu',
        preventCloseOnClick: true,
      });
    });

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

    // if user right clicks, it activetes the row and highlights it
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
  }


  function createBoxView() {
    if (fileContainer.querySelector('.file-box')) return;

    files.forEach(file => {
      const boxElement = document.createElement('div');
      boxElement.className = 'file-box';
      boxElement.dataset.id = file.dataset.id;
      boxElement.dataset.fileName = file.dataset.filename;
      boxElement.dataset.filePath = file.dataset.filepath;
      boxElement.dataset.folder = file.dataset.folder;

      const fileIcon = document.createElement('div');
      fileIcon.className = 'file-icon';
      fileIcon.innerHTML = '<i class="fas fa-file-alt"></i>';

      const fileName = document.createElement('div');
      fileName.className = 'file-name truncate-with-tooltip';
      const fileNameText = file.querySelector('td:first-child span').textContent.trim();
      fileName.textContent = fileNameText;
      fileName.setAttribute('data-full-text', fileNameText);

      const fileInfo = document.createElement('div');
      fileInfo.className = 'file-info';

      const lastOpened = file.querySelector('td:nth-child(2) span').textContent;
      const owner = file.querySelector('td:nth-child(3) span').textContent;

      fileInfo.innerHTML = `
        <div class="truncate-with-tooltip" data-full-text="${lastOpened}">${lastOpened}</div>
        <div class="truncate-with-tooltip" data-full-text="${owner}">${owner}</div>
      `;

      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.innerHTML = file.querySelector('td.actions').innerHTML;

      boxElement.appendChild(fileIcon);
      boxElement.appendChild(fileName);
      boxElement.appendChild(fileInfo);
      boxElement.appendChild(actions);

      fileContainer.appendChild(boxElement);
    });

    // Re-initialize context menu for box view
    // initializeContextMenu();
  }

  function addRowViewTooltips() {
    const tableCells = document.querySelectorAll('.file-list table td');
    tableCells.forEach(cell => {
      const cellContent = cell.textContent.trim();
      cell.classList.add('truncate-with-tooltip');
      cell.setAttribute('data-full-text', cellContent);
    });
  }

  function removeBoxView() {
    const boxElements = fileContainer.querySelectorAll('.file-box');
    boxElements.forEach(box => box.remove());
  }

  // Initialize tooltips and row view on page load
  addRowViewTooltips();
  setActiveView('row'); // Set default view to row


});