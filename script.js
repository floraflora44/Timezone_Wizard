// Timezone Wizard - Main Application Script
// Using native JavaScript Date API for timezone handling

// Application State
let locations = [];
let selectedDuration = 30; // minutes
let currentEditIndex = -1;

// City database with timezone information
const CITIES_DATABASE = [
    { name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
    { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
    { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
    { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
    { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
    { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
    { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
    { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
    { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
    { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽' },
    { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', flag: '🇷🇺' },
    { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
    { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
    { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
    { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬' },
    { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷' }
];

// DOM Elements
const elements = {
    heroSection: document.getElementById('heroSection'),
    locationSection: document.getElementById('locationSection'),
    resultsSection: document.getElementById('resultsSection'),
    locationModal: document.getElementById('locationModal'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    
    // Buttons
    addFirstLocationBtn: document.getElementById('addFirstLocationBtn'),
    addLocationBtn: document.getElementById('addLocationBtn'),
    generateTimesBtn: document.getElementById('generateTimesBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    saveLocationBtn: document.getElementById('saveLocationBtn'),
    
    // Form elements
    locationForm: document.getElementById('locationForm'),
    cityInput: document.getElementById('cityInput'),
    autocompleteDropdown: document.getElementById('autocompleteDropdown'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    
    // Display elements
    locationCount: document.getElementById('locationCount'),
    locationGrid: document.getElementById('locationGrid'),
    resultsDisplay: document.getElementById('resultsDisplay'),
    resultsLocationCount: document.getElementById('resultsLocationCount')
};

// Initialize Application
function initializeApp() {
    console.log('Initializing Timezone Wizard...');
    initializeEventListeners();
    loadStoredLocations();
    updateUI();
    startClockUpdates();
    console.log('App initialized successfully');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Event Listeners
function initializeEventListeners() {
    console.log('Setting up event listeners...');
    
    // Check if elements exist before adding listeners
    if (elements.addFirstLocationBtn) {
        elements.addFirstLocationBtn.addEventListener('click', () => {
            console.log('Add first location clicked');
            openLocationModal();
        });
    } else {
        console.error('addFirstLocationBtn not found');
    }
    
    if (elements.addLocationBtn) {
        elements.addLocationBtn.addEventListener('click', () => {
            console.log('Add location clicked');
            openLocationModal();
        });
    }
    
    if (elements.generateTimesBtn) {
        elements.generateTimesBtn.addEventListener('click', () => {
            console.log('Generate times clicked');
            generateMeetingTimes();
        });
    }
    
    if (elements.clearAllBtn) {
        elements.clearAllBtn.addEventListener('click', () => {
            console.log('Clear all clicked');
            clearAllLocations();
        });
    }
    
    // Modal controls
    elements.closeModalBtn.addEventListener('click', closeLocationModal);
    elements.cancelModalBtn.addEventListener('click', closeLocationModal);
    elements.locationForm.addEventListener('submit', handleLocationSubmit);
    
    // City input autocomplete
    elements.cityInput.addEventListener('input', handleCityInput);
    elements.cityInput.addEventListener('keydown', handleCityKeydown);
    
    // Time format toggle
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleTimeFormat(e.target.dataset.format));
    });
    
    // Day selector
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleDay(e.target));
    });
    
    // Duration selector
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedDuration = parseInt(e.target.dataset.duration);
            updateDurationButtons();
            if (locations.length >= 2) {
                generateMeetingTimes();
            }
        });
    });
    
    // Close modal on overlay click
    elements.locationModal.addEventListener('click', (e) => {
        if (e.target === elements.locationModal) {
            closeLocationModal();
        }
    });
    
    // Form validation
    elements.cityInput.addEventListener('input', validateForm);
    elements.startTime.addEventListener('change', validateForm);
    elements.endTime.addEventListener('change', validateForm);
}

// Location Management
function openLocationModal(editIndex = -1) {
    currentEditIndex = editIndex;
    
    if (editIndex >= 0) {
        // Edit existing location
        const location = locations[editIndex];
        elements.cityInput.value = `${location.name}, ${location.country}`;
        elements.startTime.value = location.workingHours.start;
        elements.endTime.value = location.workingHours.end;
        
        // Set available days
        document.querySelectorAll('.day-btn').forEach((btn, index) => {
            btn.classList.toggle('active', location.availableDays[index]);
        });
        
        document.querySelector('.modal-title').textContent = 'Edit Location';
    } else {
        // Add new location
        resetLocationForm();
        document.querySelector('.modal-title').textContent = 'Add Location';
    }
    
    elements.locationModal.style.display = 'flex';
    elements.cityInput.focus();
    validateForm();
}

function closeLocationModal() {
    elements.locationModal.style.display = 'none';
    resetLocationForm();
    currentEditIndex = -1;
}

function resetLocationForm() {
    elements.locationForm.reset();
    elements.startTime.value = '09:00';
    elements.endTime.value = '17:00';
    elements.autocompleteDropdown.style.display = 'none';
    
    // Reset day buttons to weekdays only
    document.querySelectorAll('.day-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index < 5); // Mon-Fri
    });
}

function handleLocationSubmit(e) {
    e.preventDefault();
    
    const cityText = elements.cityInput.value.trim();
    const selectedCity = CITIES_DATABASE.find(city => 
        cityText.includes(city.name) && cityText.includes(city.country)
    );
    
    if (!selectedCity) {
        showError('Please select a valid city from the dropdown');
        return;
    }
    
    const startTime = elements.startTime.value;
    const endTime = elements.endTime.value;
    
    if (startTime >= endTime) {
        showError('End time must be after start time');
        return;
    }
    
    const availableDays = Array.from(document.querySelectorAll('.day-btn')).map(btn => 
        btn.classList.contains('active')
    );
    
    if (!availableDays.some(day => day)) {
        showError('Please select at least one available day');
        return;
    }
    
    const location = {
        name: selectedCity.name,
        country: selectedCity.country,
        timezone: selectedCity.timezone,
        flag: selectedCity.flag,
        workingHours: { start: startTime, end: endTime },
        availableDays: availableDays,
        currentTime: new Date()
    };
    
    if (currentEditIndex >= 0) {
        locations[currentEditIndex] = location;
    } else {
        if (locations.length >= 6) {
            showError('Maximum 6 locations allowed');
            return;
        }
        locations.push(location);
    }
    
    saveLocations();
    updateUI();
    closeLocationModal();
}

// City Autocomplete
function handleCityInput(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        elements.autocompleteDropdown.style.display = 'none';
        return;
    }
    
    const matches = CITIES_DATABASE.filter(city => 
        city.name.toLowerCase().includes(query) || 
        city.country.toLowerCase().includes(query)
    ).slice(0, 5);
    
    if (matches.length === 0) {
        elements.autocompleteDropdown.style.display = 'none';
        return;
    }
    
    elements.autocompleteDropdown.innerHTML = matches.map(city => `
        <div class="autocomplete-item" data-city="${city.name}" data-country="${city.country}">
            <div class="city-name">${city.flag} ${city.name}, ${city.country}</div>
            <div class="city-details">${getTimezoneOffset(city.timezone)}</div>
        </div>
    `).join('');
    
    // Add click handlers
    elements.autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
            const cityName = item.dataset.city;
            const countryName = item.dataset.country;
            elements.cityInput.value = `${cityName}, ${countryName}`;
            elements.autocompleteDropdown.style.display = 'none';
            validateForm();
        });
    });
    
    elements.autocompleteDropdown.style.display = 'block';
}

function handleCityKeydown(e) {
    const items = elements.autocompleteDropdown.querySelectorAll('.autocomplete-item');
    const selected = elements.autocompleteDropdown.querySelector('.selected');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = selected ? selected.nextElementSibling : items[0];
        if (next) {
            if (selected) selected.classList.remove('selected');
            next.classList.add('selected');
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = selected ? selected.previousElementSibling : items[items.length - 1];
        if (prev) {
            if (selected) selected.classList.remove('selected');
            prev.classList.add('selected');
        }
    } else if (e.key === 'Enter' && selected) {
        e.preventDefault();
        selected.click();
    } else if (e.key === 'Escape') {
        elements.autocompleteDropdown.style.display = 'none';
    }
}

// Utility Functions
function getTimezoneOffset(timezone) {
    try {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const targetTime = new Date(utc + (getTimezoneOffsetHours(timezone) * 3600000));
        const offset = getTimezoneOffsetHours(timezone);
        const sign = offset >= 0 ? '+' : '';
        return `GMT${sign}${offset}`;
    } catch {
        return 'GMT+0';
    }
}

function getTimezoneOffsetHours(timezone) {
    try {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const targetTime = utcToZonedTime(now, timezone);
        const localTime = utcToZonedTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
        return Math.round((targetTime.getTime() - localTime.getTime()) / 3600000);
    } catch {
        return 0;
    }
}

function toggleTimeFormat(format) {
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
}

function toggleDay(button) {
    button.classList.toggle('active');
    validateForm();
}

function validateForm() {
    const cityValid = elements.cityInput.value.trim().length > 0;
    const timeValid = elements.startTime.value && elements.endTime.value && 
                     elements.startTime.value < elements.endTime.value;
    const daysValid = document.querySelectorAll('.day-btn.active').length > 0;
    
    elements.saveLocationBtn.disabled = !(cityValid && timeValid && daysValid);
}

function showError(message) {
    // Simple error display - could be enhanced with a proper toast system
    alert(message);
}

// UI Updates
function updateUI() {
    elements.locationCount.textContent = locations.length;
    
    if (locations.length === 0) {
        elements.heroSection.style.display = 'block';
        elements.locationSection.style.display = 'none';
        elements.resultsSection.style.display = 'none';
    } else {
        elements.heroSection.style.display = 'none';
        elements.locationSection.style.display = 'block';
        updateLocationGrid();
    }
    
    elements.generateTimesBtn.disabled = locations.length < 2;
    elements.addLocationBtn.style.display = locations.length >= 6 ? 'none' : 'inline-flex';
}

function updateLocationGrid() {
    elements.locationGrid.innerHTML = locations.map((location, index) => `
        <div class="location-card">
            <div class="location-card-header">
                <div class="location-name">${location.flag} ${location.name}</div>
                <div class="location-actions">
                    <button class="action-btn" onclick="editLocation(${index})" title="Edit">
                        ✏️
                    </button>
                    <button class="action-btn" onclick="deleteLocation(${index})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="current-time" id="time-${index}">
                ${getCurrentTimeForLocation(location)}
            </div>
            <div class="timezone-info">
                ${getTimezoneOffset(location.timezone)} (${getTimezoneAbbr(location.timezone)})
            </div>
            <div class="working-hours">
                ${formatTime(location.workingHours.start)} - ${formatTime(location.workingHours.end)}
            </div>
            <div class="available-days">
                ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => `
                    <div class="day-indicator ${location.availableDays[i] ? 'active' : 'inactive'}">
                        ${day}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function getCurrentTimeForLocation(location) {
    try {
        const now = new Date();
        return now.toLocaleString('en-US', {
            timeZone: location.timezone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

function getTimezoneAbbr(timezone) {
    try {
        return new Date().toLocaleString('en', { timeZone: timezone, timeZoneName: 'short' })
            .split(' ').pop();
    } catch {
        return 'UTC';
    }
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

function updateDurationButtons() {
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.duration) === selectedDuration);
    });
}

// Clock Updates
function startClockUpdates() {
    setInterval(() => {
        locations.forEach((location, index) => {
            const timeElement = document.getElementById(`time-${index}`);
            if (timeElement) {
                timeElement.textContent = getCurrentTimeForLocation(location);
            }
        });
    }, 60000); // Update every minute
}

// Location Actions (Global functions for onclick handlers)
window.editLocation = function(index) {
    console.log('Edit location:', index);
    openLocationModal(index);
};

window.deleteLocation = function(index) {
    console.log('Delete location:', index);
    if (confirm(`Remove ${locations[index].name}? This action cannot be undone.`)) {
        locations.splice(index, 1);
        saveLocations();
        updateUI();
        
        // Hide results if less than 2 locations
        if (locations.length < 2) {
            elements.resultsSection.style.display = 'none';
        }
    }
};

function clearAllLocations() {
    if (confirm('Clear all locations? This action cannot be undone.')) {
        locations = [];
        saveLocations();
        updateUI();
        elements.resultsSection.style.display = 'none';
    }
}

// Meeting Time Generation
async function generateMeetingTimes() {
    if (locations.length < 2) return;
    
    showLoading(true);
    
    try {
        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const meetingTimes = calculateOptimalMeetingTimes();
        displayResults(meetingTimes);
        
        elements.resultsSection.style.display = 'block';
        elements.resultsLocationCount.textContent = locations.length;
        
        // Scroll to results
        elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showError('Failed to generate meeting times. Please try again.');
        console.error('Meeting generation error:', error);
    } finally {
        showLoading(false);
    }
}

function calculateOptimalMeetingTimes() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    
    const dates = [today, tomorrow, dayAfter];
    const meetingTimes = [];
    
    dates.forEach(date => {
        // Generate time slots from 6 AM to 11 PM in 30-minute intervals
        for (let hour = 6; hour < 23; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const baseTime = new Date(date);
                baseTime.setHours(hour, minute, 0, 0);
                
                const timeSlot = {
                    baseTime,
                    locations: [],
                    score: 0,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
                };
                
                let totalScore = 0;
                let validLocations = 0;
                
                locations.forEach(location => {
                    try {
                        // Create local time for the timezone
                        const localTime = new Date(baseTime.getTime());
                        const dayOfWeek = localTime.getDay();
                        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon=0, Sun=6
                        
                        if (!location.availableDays[adjustedDay]) {
                            timeSlot.locations.push({
                                name: location.name,
                                time: localTime.toLocaleString('en-US', {
                                    timeZone: location.timezone,
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }),
                                available: false,
                                score: 0
                            });
                            return;
                        }
                        
                        const hours = localTime.getHours();
                        const minutes = localTime.getMinutes();
                        const timeInMinutes = hours * 60 + minutes;
                        
                        const [startHour, startMin] = location.workingHours.start.split(':').map(Number);
                        const [endHour, endMin] = location.workingHours.end.split(':').map(Number);
                        const startInMinutes = startHour * 60 + startMin;
                        const endInMinutes = endHour * 60 + endMin;
                        
                        let locationScore = 0;
                        let available = false;
                        
                        if (timeInMinutes >= startInMinutes && timeInMinutes + selectedDuration <= endInMinutes) {
                            available = true;
                            // Score based on how close to ideal business hours (10 AM - 4 PM)
                            const idealStart = 10 * 60; // 10 AM
                            const idealEnd = 16 * 60;   // 4 PM
                            
                            if (timeInMinutes >= idealStart && timeInMinutes <= idealEnd) {
                                locationScore = 100;
                            } else if (timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes) {
                                const distanceFromIdeal = Math.min(
                                    Math.abs(timeInMinutes - idealStart),
                                    Math.abs(timeInMinutes - idealEnd)
                                );
                                locationScore = Math.max(50, 100 - (distanceFromIdeal / 60) * 10);
                            }
                        }
                        
                        timeSlot.locations.push({
                            name: location.name,
                            time: localTime.toLocaleString('en-US', {
                                timeZone: location.timezone,
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            }),
                            available,
                            score: locationScore
                        });
                        
                        if (available) {
                            totalScore += locationScore;
                            validLocations++;
                        }
                        
                    } catch (error) {
                        console.error(`Error processing location ${location.name}:`, error);
                        timeSlot.locations.push({
                            name: location.name,
                            time: 'Error',
                            available: false,
                            score: 0
                        });
                    }
                });
                
                // Only include time slots where all locations are available
                if (validLocations === locations.length) {
                    timeSlot.score = Math.round(totalScore / locations.length);
                    meetingTimes.push(timeSlot);
                }
            }
        });
    });
    
    // Sort by score (highest first) and return top 10
    return meetingTimes
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

function displayResults(meetingTimes) {
    if (meetingTimes.length === 0) {
        elements.resultsDisplay.innerHTML = `
            <div class="no-results">
                <h3>No common meeting times found</h3>
                <p>Try adjusting working hours or available days for better results.</p>
            </div>
        `;
        return;
    }
    
    const tableHeaders = ['Date', ...locations.map(loc => loc.name), 'Score', 'Actions'];
    
    elements.resultsDisplay.innerHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${meetingTimes.map((slot, index) => `
                    <tr>
                        <td>${slot.date}</td>
                        ${slot.locations.map(loc => `
                            <td class="time-cell">${loc.time}</td>
                        `).join('')}
                        <td>
                            <span class="score-badge ${getScoreClass(slot.score)}">
                                ${getScoreEmoji(slot.score)} ${slot.score}%
                            </span>
                        </td>
                        <td>
                            <div class="export-actions">
                                <button class="export-btn" onclick="copyToClipboard(${index})">📋</button>
                                <button class="export-btn" onclick="addToCalendar(${index})">📅</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Store meeting times for export functions
    window.currentMeetingTimes = meetingTimes;
}

function getScoreClass(score) {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    return 'score-fair';
}

function getScoreEmoji(score) {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    return '🟠';
}

// Export Functions
window.copyToClipboard = function(index) {
    const meeting = window.currentMeetingTimes[index];
    const text = `Meeting Time - ${meeting.date}\n` +
                 meeting.locations.map(loc => `${loc.name}: ${loc.time}`).join('\n') +
                 `\nDuration: ${selectedDuration} minutes`;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy to clipboard');
    });
};

window.addToCalendar = function(index) {
    const meeting = window.currentMeetingTimes[index];
    // This would typically integrate with calendar APIs
    showToast('Calendar integration coming soon!');
};

function showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 9999;
        font-size: 0.875rem;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Local Storage
function saveLocations() {
    try {
        localStorage.setItem('timezoneWizardLocations', JSON.stringify(locations));
    } catch (error) {
        console.error('Failed to save locations:', error);
    }
}

function loadStoredLocations() {
    try {
        const stored = localStorage.getItem('timezoneWizardLocations');
        if (stored) {
            locations = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load stored locations:', error);
        locations = [];
    }
}
