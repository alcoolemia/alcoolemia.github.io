// Function to check if 'apikey' is in localStorage
function checkApiKey() {
  const apiKey = localStorage.getItem('apikey');
  if (!apiKey) {
    const userInput = prompt('Please enter your API key:');
    if (userInput && userInput.trim() !== '') {
      localStorage.setItem('apikey', userInput.trim());
    } else {
      alert('API key cannot be blank. Please refresh the page to try again.');
      return null;
    }
  }
  return localStorage.getItem('apikey');
}

// Initialize the API key
const apiKey = checkApiKey();

// Check if apiKey is set before proceeding
if (apiKey) {
  // Define the API URL with the apiKey
  const apiUrl = `https://api.simple-mmo.com/v1/guilds/members/39?api_key=${apiKey}`;


// Initialize the data variable to store the response
let data = [];

// Function to fetch the data asynchronously
async function fetchData() {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonData = await response.json();
    // Store the JSON data in the global variable
    data = jsonData;
    console.log(data);
   

    return data; // You can log the data or perform further actions here
  } catch (error) {
    console.error('Error:', error);
  }
}

function timeSinceLastActive(timestamp) {
  const seconds = Math.floor((Date.now() / 1000) - timestamp);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const intervalCount = Math.floor(seconds / secondsInUnit);

    if (intervalCount > 1) {
      return `${intervalCount} ${unit}s ago`;
    } else if (intervalCount === 1) {
      return `${intervalCount} ${unit} ago`;
    }
  }

  return "Just now";
}

let currentFilter = "",
  prevFilter = "",
  orderAsc = true;


const toggleOrder = () => {
  if (currentFilter === prevFilter) {
    orderAsc = !orderAsc;
  } else {
    orderAsc = true;
  }
};

const sortTable = (array, sortKey) => {
  return array.sort((a, b) => {
    const x = a[sortKey];
    const y = b[sortKey];

    // Check if the values are "N" or "Y" and convert them to 0 and 1 respectively for sorting
    const valueX = x === 'N' ? 0 : x === 'Y' ? 1 : x;
    const valueY = y === 'N' ? 0 : y === 'Y' ? 1 : y;

    if (valueX === valueY) {
      return 0;
    }

    return orderAsc ? (valueX < valueY ? -1 : 1) : valueX > valueY ? -1 : 1;
  });
};

const renderTable = tableData => {
  return `${tableData.map(item => {
    if (item.user_id.length > 2) {
      
    }
    return (
      `<tr>
        <td>${item.user_id}</td>
        <td>${item.position}</td>
        <td>${item.name}</td>
        <td>${item.level}</td>
        <td>${item.safe_mode}</td>
        <td>${item.banned}</td>
        <td>${item.last_activity}</td>
        <td>${item.current_hp}</td>
        <td>${item.max_hp}</td>
        <td>${item.warrior}</td>
        <td>${item.steps}</td>
        <td>${item.npc_kills}</td>
        <td>${item.user_kills}</td>
      </tr>`);

  }).join('')}`;
};

const appendTable = (table, destination) => {
  document.querySelector(destination).innerHTML = table;
};

const handleSortClick = () => {
  const filters = document.querySelectorAll('#squadTable th');

  Array.prototype.forEach.call(filters, filter => {
    filter.addEventListener('click', () => {
      if (!filter.dataset.filterValue) return false;

      // If the clicked column is already active, toggle the order
      if (currentFilter === filter.dataset.filterValue) {
        toggleOrder();
      } else {
        // If a different column is clicked, reset order to ascending
        orderAsc = true;
      }

      Array.prototype.forEach.call(filters, f => {
        f.classList.remove('active');
      });
      filter.classList.add('active');
      currentFilter = filter.dataset.filterValue;
      init();
    });
  });
};
const init = () => {
  let newTableData = sortTable(data, currentFilter),
    tableOutput = renderTable(newTableData);

  appendTable(tableOutput, '#squadTable tbody');

  prevFilter = currentFilter;
};

(async () => {
    await fetchData();
    init();
    handleSortClick();
    
  })();
}

