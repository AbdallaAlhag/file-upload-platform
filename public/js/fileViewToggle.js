
document.addEventListener('DOMContentLoaded', function () {
  const rowViewSwitch = document.getElementById('rowViewSwitch');
  const boxViewSwitch = document.getElementById('boxViewSwitch');
  const fileContainer = document.getElementById('fileContainer');
  const files = document.querySelectorAll('.files');

  fetch('/get-view')
    .then(response => response.json())
    .then(data => {
      const savedView = data.view || 'row'; // Default to 'row' if no saved preference
      setActiveView(data.view);
    })
    .catch(err => console.error('Error fetching view preference:', err));

  rowViewSwitch.addEventListener('click', function () {
    setActiveView('row');
    saveViewPreference('row'); // Save preference when user switches

  });

  boxViewSwitch.addEventListener('click', function () {
    setActiveView('box');
    saveViewPreference('box'); // Save preference when user switches
  });
  function checkForNoResults() {
    const fileBoxes = document.querySelectorAll('.file-box');
    const fileList = document.querySelector('.box-view'); // Assuming file-list is the table

    if (!fileList) return; // Exit if fileList doesn't exist

    // Remove existing empty state if it exists
    const existingEmptyStateRow = fileList.querySelector('.empty-state');
    if (existingEmptyStateRow) {
      existingEmptyStateRow.remove();
    }

    // Create and append empty state if no file boxes are present
    if (fileBoxes.length === 0) {
      const emptyStateRow = document.createElement('tr');
      emptyStateRow.classList.add('empty-state-box');

      const emptyStateCell = document.createElement('td');
      emptyStateCell.setAttribute('colspan', '7'); // Adjust colspan as necessary
      emptyStateRow.appendChild(emptyStateCell);

      const emptyStateContainer = document.createElement('div');
      emptyStateCell.appendChild(emptyStateContainer);

      const emptyStateIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      emptyStateIcon.setAttribute('viewBox', '0 0 24 24');
      emptyStateIcon.setAttribute('width', '40');
      emptyStateIcon.setAttribute('height', '40');
      emptyStateContainer.appendChild(emptyStateIcon);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z');
      emptyStateIcon.appendChild(path);

      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '14 2 14 8 20 8');
      emptyStateIcon.appendChild(polyline);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '9');
      line.setAttribute('y1', '15');
      line.setAttribute('x2', '15');
      line.setAttribute('y2', '15');
      emptyStateIcon.appendChild(line);

      const emptyStateMessage = document.createElement('p');
      emptyStateMessage.classList.add('message');
      emptyStateMessage.textContent = 'No results found';
      emptyStateContainer.appendChild(emptyStateMessage);

      const emptyStateSubMessage = document.createElement('p');
      emptyStateSubMessage.classList.add('sub-message');
      emptyStateSubMessage.textContent = 'Try adjusting your search or filters to find what you are looking for.';
      emptyStateContainer.appendChild(emptyStateSubMessage);

      fileList.appendChild(emptyStateRow);
    }
  }



  function saveViewPreference(view) {
    fetch('/set-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ view: view })
    })
      .then(response => response.json())
      .catch(err => console.error('Error saving view preference:', err));
  }
  function setActiveView(view) {
    if (view === 'row') {
      rowViewSwitch.classList.add('active');
      boxViewSwitch.classList.remove('active');
      fileContainer.classList.remove('box-view');
      removeBoxView();
      addRowViewTooltips();

      // Remove empty state if switching to row view
      const emptyStateRow = document.querySelector('.empty-state-box');
      if (emptyStateRow) {
        emptyStateRow.remove();
      }
    } else {
      boxViewSwitch.classList.add('active');
      rowViewSwitch.classList.remove('active');
      fileContainer.classList.add('box-view');
      createBoxView();
    }
    checkForNoResults();

    const fileBoxes = document.querySelectorAll('.file-box');
    const fileList = document.querySelector('.file-list');

    fileBoxes.forEach(fileBox => {
      const fileId = fileBox.getAttribute('data-id');
      const fileName = fileBox.getAttribute('data-file-name');
      const filePath = fileBox.getAttribute('data-file-path');
      const fileType = fileBox.getAttribute('data-file-type');
      const folder = JSON.parse(fileBox.getAttribute('data-folder'));
      new VanillaContextMenu({
        scope: fileBox, // Apply context menu to each .file-item element
        menuItems: window.getContextMenuItems(fileId, fileName, filePath, folder, fileType),
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
      // selects all the action buttons but removes the last one
      const actionElements = file.querySelectorAll('td.actions > *');
      actionElements[actionElements.length - 1].remove();

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


});