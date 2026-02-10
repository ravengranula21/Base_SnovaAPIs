let allEndpoints = [];
let currentTheme = 'dark';

function openSearch() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('modal-search-input');
  if (modal && input) {
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
    displayAllEndpoints();
  }
}

function closeSearch() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('modal-search-input');
  if (modal) {
    modal.classList.remove('active');
  }
  if (input) {
    input.value = '';
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch();
  }
});

const searchModal = document.getElementById('search-modal');
if (searchModal) {
  searchModal.addEventListener('click', (e) => {
    if (e.target.id === 'search-modal') {
      closeSearch();
    }
  });
}

function displayAllEndpoints() {
  const resultsDiv = document.getElementById('search-results');
  
  if (!resultsDiv) return;
  
  if (allEndpoints.length === 0) {
    resultsDiv.innerHTML = '<p class="no-results">No endpoints available</p>';
    return;
  }

  let html = '';
  allEndpoints.forEach(endpoint => {
    html += `
      <a href="${endpoint.link}" target="_blank" class="endpoint-item">
        <div class="endpoint-left">
          <i class="${endpoint.tagIcon}"></i>
          <div class="endpoint-text">
            <p class="endpoint-name">${endpoint.name}</p>
            <p class="endpoint-tag">${endpoint.tag}</p>
          </div>
        </div>
        <i class="ri-arrow-right-line endpoint-arrow"></i>
      </a>
    `;
  });
  
  resultsDiv.innerHTML = html;
}

const searchInput = document.getElementById('modal-search-input');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const resultsDiv = document.getElementById('search-results');
    
    if (!resultsDiv) return;
    
    if (searchTerm === '') {
      displayAllEndpoints();
      return;
    }

    const filtered = allEndpoints.filter(endpoint => 
      endpoint.name.toLowerCase().includes(searchTerm) || 
      endpoint.tag.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
      resultsDiv.innerHTML = '<p class="no-results">No results found</p>';
      return;
    }

    let html = '';
    filtered.forEach(endpoint => {
      html += `
        <a href="${endpoint.link}" target="_blank" class="endpoint-item">
          <div class="endpoint-left">
            <i class="${endpoint.tagIcon}"></i>
            <div class="endpoint-text">
              <p class="endpoint-name">${endpoint.name}</p>
              <p class="endpoint-tag">${endpoint.tag}</p>
            </div>
          </div>
          <i class="ri-arrow-right-line endpoint-arrow"></i>
        </a>
      `;
    });
    
    resultsDiv.innerHTML = html;
  });
}

function applyTheme(theme) {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('header');
  const cards = document.querySelectorAll('.card-dark, .card-light');
  const menuItems = document.querySelectorAll('.menu-item');
  const themeIcon = document.getElementById('theme-icon');
  
  if (theme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    
    if (sidebar) {
      sidebar.classList.remove('sidebar-light');
      sidebar.classList.add('sidebar-dark');
    }
    
    if (header) {
      header.classList.remove('header-light');
      header.classList.add('header-dark');
    }
    
    cards.forEach(card => {
      card.classList.remove('card-light');
      card.classList.add('card-dark');
    });
    
    menuItems.forEach(item => {
      item.classList.remove('menu-item-light');
      item.classList.add('menu-item-dark');
    });
    
    if (themeIcon) {
      themeIcon.className = 'ri-moon-line';
    }
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    
    if (sidebar) {
      sidebar.classList.remove('sidebar-dark');
      sidebar.classList.add('sidebar-light');
    }
    
    if (header) {
      header.classList.remove('header-dark');
      header.classList.add('header-light');
    }
    
    cards.forEach(card => {
      card.classList.remove('card-dark');
      card.classList.add('card-light');
    });
    
    menuItems.forEach(item => {
      item.classList.remove('menu-item-dark');
      item.classList.add('menu-item-light');
    });
    
    if (themeIcon) {
      themeIcon.className = 'ri-sun-line';
    }
  }
}

const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');

if (menuBtn && sidebar) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (sidebar && menuBtn && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

function toggleDropdown(dropdownId, chevronId) {
  const dropdown = document.getElementById(dropdownId);
  const chevron = document.getElementById(chevronId);

  if (!dropdown || !chevron) return;

  const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';

  document.querySelectorAll('.dropdown-content').forEach(el => {
    if (el.id !== dropdownId) {
      el.style.display = 'none';
    }
  });

  document.querySelectorAll('[id^="chevron-"]').forEach(el => {
    if (el.id !== chevronId) {
      el.classList.remove('ri-arrow-up-s-line');
      el.classList.add('ri-arrow-down-s-line');
    }
  });

  if (isHidden) {
    dropdown.style.display = 'flex';
    chevron.classList.remove('ri-arrow-down-s-line');
    chevron.classList.add('ri-arrow-up-s-line');
  } else {
    dropdown.style.display = 'none';
    chevron.classList.remove('ri-arrow-up-s-line');
    chevron.classList.add('ri-arrow-down-s-line');
  }
}

async function loadSettings() {
  try {
    const [settings, config] = await Promise.all([
      fetch("/plugin.json").then(res => res.json()),
      fetch("/config.json").then(res => res.json())
    ]);
    
    const pagetitle = document.querySelector("#pagetitle");
    const webtitleHeader = document.querySelector("#webtitle-header");
    const webtitleSidebar = document.querySelector("#webtitle-sidebar");
    const logo = document.getElementById("logo");
    const dashboardLink = document.getElementById("dashboard-link");
    const ravenImage = document.getElementById("raven-image");
    const yohwaImage = document.getElementById("yohwa-image");
    const githubLink = document.getElementById("github-link");
    const whatsappLink = document.getElementById("whatsapp-link");
    
    if (pagetitle) pagetitle.textContent = config.pagetitle;
    if (webtitleHeader) webtitleHeader.textContent = config.apititle;
    if (webtitleSidebar) webtitleSidebar.textContent = config.apititle;
    if (logo) logo.src = config.border;
    if (dashboardLink) dashboardLink.href = '/';
    if (ravenImage) ravenImage.src = config.image;
    if (yohwaImage) yohwaImage.src = config.image2;
    if (githubLink) githubLink.href = config.github;
    if (whatsappLink) whatsappLink.href = config.links;
    
    allEndpoints = [];
    
    settings.forEach(tag => {
      if (tag.api && Array.isArray(tag.api)) {
        tag.api.forEach(api => {
          allEndpoints.push({
            name: api.name,
            link: api.link,
            tag: tag.tag,
            tagIcon: tag.logo
          });
        });
      }
    });
    
    const totalEndpointsEl = document.getElementById('total-endpoints');
    if (totalEndpointsEl) {
      totalEndpointsEl.textContent = allEndpoints.length;
    }
    
    const menu = document.getElementById("menu");
    if (menu) {
      const isDark = document.body.classList.contains('dark-mode');
      const menuClass = isDark ? 'menu-item-dark' : 'menu-item-light';
      
      let menuHTML = '';
      settings.forEach((item, index) => {
        if (!item.api || !Array.isArray(item.api)) return;
        
        menuHTML += `
          <div class="menu-group">
            <button class="menu-item ${menuClass}" onclick="toggleDropdown('dropdown-${index}', 'chevron-${index}')">
              <div class="menu-item-left">
                <i class="${item.logo}"></i>
                <span>${item.tag}</span>
              </div>
              <i id="chevron-${index}" class="ri-arrow-down-s-line"></i>
            </button>
            <div id="dropdown-${index}" class="dropdown-content">
              ${item.api.slice().sort((a, b) => a.name.localeCompare(b.name)).map(api => `
                <a class="menu-item sub-item ${menuClass}" href="${api.link}" target="_blank">
                  <div class="menu-item-left">
                    <i class="ri-arrow-right-s-line"></i>
                    <span>${api.name}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      });

      menu.innerHTML = menuHTML;
    }

    const batteryStatus = document.getElementById('battery-status');
    if (batteryStatus && navigator.getBattery) {
      navigator.getBattery().then(battery => {
        function updateBattery() {
          const percentage = Math.round(battery.level * 100);
          const isCharging = battery.charging;
          
          if (isCharging) {
            batteryStatus.textContent = `${percentage}% • CHARGING`;
          } else {
            batteryStatus.textContent = `${percentage}%`;
          }
        }
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        batteryStatus.textContent = 'NOT SUPPORTED';
      });
    } else if (batteryStatus) {
      batteryStatus.textContent = 'NOT SUPPORTED';
    }

    const ownerGrid = document.getElementById('owner-grid');
    if (ownerGrid && config.developer) {
      ownerGrid.innerHTML = config.developer.map(e => `
        <a href="${e.contact}" target="_blank" rel="noopener noreferrer" class="owner-card card-dark">
          <i class="ri-user-3-line"></i>
          <div class="owner-info">
            <p class="owner-name">${e.name}</p>
            <p class="owner-role">DEVELOPER</p>
          </div>
          <i class="ri-arrow-right-line"></i>
        </a>
      `).join("");
    }

  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function init() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  currentTheme = savedTheme;
  applyTheme(savedTheme);
  loadSettings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}