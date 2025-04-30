
// Get references to DOM elements
const form = document.getElementById('linkForm') as HTMLFormElement;
const result = document.getElementById('result')!;
const linksList = document.getElementById('linksList')!;
const API_BASE = 'http://localhost:3001'; // Replace with your backend URL if needed

/**
 * Gather all user-entered parameters from the UI
 * Each entry is returned as { key: value }, e.g., { utm_source: 'facebook' }
 */
function getParameters(): Record<string, string>[] {
  const params: Record<string, string>[] = [];
  const paramPairs = document.querySelectorAll('.parameter-pair');

  paramPairs.forEach(pair => {
    const keyInput = pair.querySelector('.param-name') as HTMLInputElement;
    const valueInput = pair.querySelector('.param-value') as HTMLInputElement;

    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value) {
      params.push({ [key]: value });
    }
  });

  return params;
}

/**
 * Add a new dynamic parameter row when "Add Parameter" is clicked
 */
document.getElementById('add-param')?.addEventListener('click', () => {
  const container = document.getElementById('parameter-container') as HTMLElement;

  const paramPair = document.createElement('div');
  paramPair.classList.add('parameter-pair');

  paramPair.innerHTML = `
    <input type="text" class="param-name" placeholder="Parameter Name" />
    <input type="text" class="param-value" placeholder="Parameter Value" />
    <button type="button" class="remove-param">Remove</button>
  `;

  // Remove row when "Remove" button is clicked
  paramPair.querySelector('.remove-param')?.addEventListener('click', () => {
    container.removeChild(paramPair);
  });

  container.appendChild(paramPair);
});

/**
 * Handle form submission
 * - Validate inputs
 * - Flatten parameters
 * - POST to backend
 * - Show result and refresh links list
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent full page reload

  const url = (document.getElementById('url') as HTMLInputElement).value.trim();
  if (!url) {
    result.textContent = 'Please enter a valid URL.';
    return;
  }

  const rawParams = getParameters();
  if (rawParams.length === 0) {
    result.textContent = 'Please provide at least one parameter.';
    return;
  }

  // Flatten array of key-value pairs into a single object
  const parameters = Object.assign({}, ...rawParams);

  try {
    // Send POST request to backend
    const res = await fetch(`${API_BASE}/append-parameters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, parameters })
    });

    const data = await res.json();

    if (!res.ok) {
      result.textContent = `Error: ${data.error || 'Unknown error'}`;
      return;
    }

    // Display backend response
    result.textContent = JSON.stringify(data, null, 2);

    // Refresh saved links list
    loadLinks();
  } catch (err) {
    result.textContent = 'Failed to send request.';
  }
});

/**
 * Fetch and display links saved in backend
 */
async function loadLinks() {
  try {
    const res = await fetch(`${API_BASE}/links`);
    const { links } = await res.json();

    linksList.innerHTML = '';
    for (const link of links) {
      const li = document.createElement('li');
      li.textContent = `${link.original_url} → ${link.final_url}`;
      linksList.appendChild(li);
    }
  } catch {
    linksList.innerHTML = '<li>Error loading links</li>';
  }
}

// Load existing links on initial page load
loadLinks();