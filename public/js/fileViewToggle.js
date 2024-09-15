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
    } else {
      boxViewSwitch.classList.add('active');
      rowViewSwitch.classList.remove('active');
      fileContainer.classList.add('box-view');
      createBoxView();
    }
  }

  function createBoxView() {
    if (fileContainer.querySelector('.file-box')) return;

    files.forEach(file => {
      const boxElement = document.createElement('div');
      boxElement.className = 'file-box';
      boxElement.dataset.id = file.dataset.id;
      boxElement.dataset.fileName = file.dataset.fileName;

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
  }

  // Add this function to handle tooltips for the row view
  function addRowViewTooltips() {
    const tableCells = document.querySelectorAll('.file-list table td');
    tableCells.forEach(cell => {
      const cellContent = cell.textContent.trim();
      cell.classList.add('truncate-with-tooltip');
      cell.setAttribute('data-full-text', cellContent);
    });
  }

  // Call this function when the page loads
  addRowViewTooltips();

  function removeBoxView() {
    const boxElements = fileContainer.querySelectorAll('.file-box');
    boxElements.forEach(box => box.remove());
  }
});