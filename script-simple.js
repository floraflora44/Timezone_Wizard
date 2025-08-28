// Simplified Timezone Wizard Script for Debugging

// Application State
let locations = [];
let selectedDuration = 30;
let currentEditIndex = -1;

// City database
const CITIES_DATABASE = [
    { name: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
    { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
    { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
    { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', flag: '🇨🇦' },
    { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
    { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
    { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
    { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
    { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
    { name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪' }
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    updateUI();
    
    // Get elements
    const addFirstLocationBtn = document.getElementById('addFirstLocationBtn');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const generateTimesBtn = document.getElementById('generateTimesBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const locationModal = document.getElementById('locationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const cityInput = document.getElementById('cityInput');
    const autocompleteDropdown = document.getElementById('autocompleteDropdown');
    const locationForm = document.getElementById('locationForm');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    
    console.log('Elements found:', {
        addFirstLocationBtn: !!addFirstLocationBtn,
        addLocationBtn: !!addLocationBtn,
        generateTimesBtn: !!generateTimesBtn,
        clearAllBtn: !!clearAllBtn,
        locationModal: !!locationModal,
        closeModalBtn: !!closeModalBtn,
        saveLocationBtn: !!saveLocationBtn,
        cityInput: !!cityInput
    });
    
    // Add event listeners
    if (addFirstLocationBtn) {
        addFirstLocationBtn.addEventListener('click', function() {
            console.log('Add first location clicked!');
            if (locationModal) {
                locationModal.style.display = 'flex';
                if (cityInput) {
                    cityInput.focus();
                    // Initial form validation when modal opens
                    setTimeout(validateForm, 100);
                }
            }
        });
    }
    
    // Try Demo button
    const tryDemoBtn = document.getElementById('tryDemoBtn');
    if (tryDemoBtn) {
        tryDemoBtn.addEventListener('click', function() {
            console.log('Try demo clicked!');
            loadDemoLocations();
        });
    }
    
    // Add Another Location button
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', function() {
            console.log('Add another location clicked!');
            currentEditIndex = -1; // Reset edit index
            if (locationModal) {
                locationModal.style.display = 'flex';
                resetForm();
                if (cityInput) {
                    cityInput.focus();
                    setTimeout(validateForm, 100);
                }
            }
        });
    }
    
    // Generate Meeting Times button
    if (generateTimesBtn) {
        generateTimesBtn.addEventListener('click', function() {
            console.log('Generate meeting times clicked!');
            generateMeetingTimes();
        });
    }
    
    // Clear All button
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            console.log('Clear all clicked!');
            if (confirm('Clear all locations? This action cannot be undone.')) {
                locations = [];
                updateUI();
            }
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            console.log('Close modal clicked');
            if (locationModal) {
                locationModal.style.display = 'none';
            }
        });
    }
    
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            console.log('Cancel modal clicked');
            if (locationModal) {
                locationModal.style.display = 'none';
            }
        });
    }
    
    // City input autocomplete
    if (cityInput) {
        cityInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            console.log('City input:', query);
            
            // Validate form on every input change
            validateForm();
            
            if (query.length < 2) {
                if (autocompleteDropdown) {
                    autocompleteDropdown.style.display = 'none';
                }
                return;
            }
            
            const matches = CITIES_DATABASE.filter(city => 
                city.name.toLowerCase().includes(query) || 
                city.country.toLowerCase().includes(query)
            ).slice(0, 5);
            
            console.log('Matches found:', matches.length, matches.map(m => m.name));
            
            if (matches.length === 0 || !autocompleteDropdown) {
                if (autocompleteDropdown) {
                    autocompleteDropdown.style.display = 'none';
                }
                return;
            }
            
            autocompleteDropdown.innerHTML = matches.map(city => `
                <div class="autocomplete-item" data-city="${city.name}" data-country="${city.country}">
                    <div class="city-name">${city.flag} ${city.name}, ${city.country}</div>
                    <div class="city-details">${getTimezoneOffsetForCity(city)}</div>
                </div>
            `).join('');
            
            // Add click handlers
            autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', function() {
                    const cityName = item.dataset.city;
                    const countryName = item.dataset.country;
                    cityInput.value = `${cityName}, ${countryName}`;
                    autocompleteDropdown.style.display = 'none';
                    validateForm();
                });
            });
            
            autocompleteDropdown.style.display = 'block';
        });
    }
    
    // Form submission
    if (locationForm) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const cityText = cityInput ? cityInput.value.trim() : '';
            const selectedCity = CITIES_DATABASE.find(city => 
                cityText.includes(city.name) && cityText.includes(city.country)
            );
            
            if (!selectedCity) {
                alert('Please select a valid city from the dropdown');
                return;
            }
            
            const startTime = document.getElementById('startTime')?.value || '09:00';
            const endTime = document.getElementById('endTime')?.value || '17:00';
            
            if (startTime >= endTime) {
                alert('End time must be after start time');
                return;
            }
            
            const availableDays = Array.from(document.querySelectorAll('.day-btn')).map(btn => 
                btn.classList.contains('active')
            );
            
            if (!availableDays.some(day => day)) {
                alert('Please select at least one available day');
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
                    alert('Maximum 6 locations allowed');
                    return;
                }
                locations.push(location);
            }
            
            console.log('Location added:', location);
            updateUI();
            closeModal();
        });
    }
    
    // Day selector buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.classList.toggle('active');
            validateForm();
        });
    });
    
    // Duration selector buttons (for results section)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('duration-btn')) {
            console.log('Duration button clicked:', e.target.dataset.duration);
            
            // Remove active class from all duration buttons
            document.querySelectorAll('.duration-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Update selected duration
            selectedDuration = parseInt(e.target.dataset.duration);
            console.log('Selected duration updated to:', selectedDuration);
            
            // Regenerate meeting times with new duration
            if (locations.length >= 2) {
                generateMeetingTimes();
            }
        }
    });
    
    // Modal overlay click to close
    if (locationModal) {
        locationModal.addEventListener('click', function(e) {
            if (e.target === locationModal) {
                locationModal.style.display = 'none';
            }
        });
    }
    
    function validateForm() {
        console.log('validateForm called');
        if (!saveLocationBtn || !cityInput) {
            console.log('Missing elements:', { saveLocationBtn: !!saveLocationBtn, cityInput: !!cityInput });
            return;
        }
        
        const cityValue = cityInput.value.trim();
        const cityValid = cityValue.length > 0;
        const timeValid = true; // Simplified for now
        const activeDays = document.querySelectorAll('.day-btn.active');
        const daysValid = activeDays.length > 0;
        
        console.log('Form validation:', { 
            cityValue, 
            cityValid, 
            timeValid, 
            daysValid, 
            activeDaysCount: activeDays.length 
        });
        
        const isValid = cityValid && timeValid && daysValid;
        saveLocationBtn.disabled = !isValid;
        
        console.log('Save button state:', { disabled: saveLocationBtn.disabled, isValid });
    }
    
    function closeModal() {
        if (locationModal) {
            locationModal.style.display = 'none';
        }
        resetForm();
        currentEditIndex = -1;
    }
    
    function resetForm() {
        if (locationForm) {
            locationForm.reset();
        }
        if (cityInput) {
            cityInput.value = '';
        }
        if (autocompleteDropdown) {
            autocompleteDropdown.style.display = 'none';
        }
        
        // Reset day buttons to weekdays
        document.querySelectorAll('.day-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index < 5);
        });
    }
    
    function updateUI() {
        const heroSection = document.getElementById('heroSection');
        const locationSection = document.getElementById('locationSection');
        const locationCount = document.getElementById('locationCount');
        const locationGrid = document.getElementById('locationGrid');
        const generateTimesBtn = document.getElementById('generateTimesBtn');
        
        if (locationCount) {
            locationCount.textContent = locations.length;
        }
        
        if (locations.length === 0) {
            if (heroSection) heroSection.style.display = 'block';
            if (locationSection) locationSection.style.display = 'none';
        } else {
            if (heroSection) heroSection.style.display = 'none';
            if (locationSection) locationSection.style.display = 'block';
            
            if (locationGrid) {
                locationGrid.innerHTML = locations.map((location, index) => `
                    <div class="location-card">
                        <div class="location-card-header">
                            <div class="location-name">${location.flag} ${location.name}</div>
                            <div class="location-actions">
                                <button class="action-btn" onclick="editLocation(${index})" title="Edit">✏️</button>
                                <button class="action-btn" onclick="deleteLocation(${index})" title="Delete">🗑️</button>
                            </div>
                        </div>
                        <div class="current-time">
                            ${getCurrentTimeForLocation(location)} <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: normal;">(current local time)</span>
                        </div>
                        <div class="timezone-info">${getTimezoneOffset(location)}</div>
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
        }
        
        if (generateTimesBtn) {
            generateTimesBtn.disabled = locations.length < 2;
        }
    }
    
    function getCurrentTimeForLocation(location) {
        try {
            return new Date().toLocaleString('en-US', {
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
    
    function getTimezoneOffset(location) {
        return getTimezoneOffsetForCity(location);
    }
    
    function getTimezoneOffsetForCity(city) {
        // Static fallback for known timezones - most reliable approach
        const knownOffsets = {
            'Asia/Hong_Kong': 'GMT+8',
            'America/New_York': 'GMT-5',
            'Europe/London': 'GMT+0',
            'Asia/Tokyo': 'GMT+9',
            'America/Los_Angeles': 'GMT-8',
            'America/Vancouver': 'GMT-8',
            'Asia/Singapore': 'GMT+8',
            'Europe/Berlin': 'GMT+1',
            'America/Toronto': 'GMT-5',
            'Asia/Kolkata': 'GMT+5:30',
            'Asia/Dubai': 'GMT+4',
            'Europe/Paris': 'GMT+1',
            'Australia/Sydney': 'GMT+10'
        };
        
        return knownOffsets[city.timezone] || 'GMT';
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    // Global functions for onclick handlers
    window.editLocation = function(index) {
        console.log('Edit location:', index);
        currentEditIndex = index;
        const location = locations[index];
        
        if (cityInput) {
            cityInput.value = `${location.name}, ${location.country}`;
        }
        
        const startTime = document.getElementById('startTime');
        const endTime = document.getElementById('endTime');
        if (startTime) startTime.value = location.workingHours.start;
        if (endTime) endTime.value = location.workingHours.end;
        
        document.querySelectorAll('.day-btn').forEach((btn, index) => {
            btn.classList.toggle('active', location.availableDays[index]);
        });
        
        document.querySelector('.modal-title').textContent = 'Edit Location';
        if (locationModal) {
            locationModal.style.display = 'flex';
        }
        validateForm();
    };
    
    window.deleteLocation = function(index) {
        console.log('Delete location:', index);
        if (confirm(`Remove ${locations[index].name}? This action cannot be undone.`)) {
            locations.splice(index, 1);
            updateUI();
        }
    };
    
    // Generate Meeting Times function
    function generateMeetingTimes() {
        console.log('Generating meeting times for', locations.length, 'locations with duration:', selectedDuration, 'minutes');
        
        if (locations.length < 2) {
            alert('Please add at least 2 locations to generate meeting times.');
            return;
        }
        
        // Simple meeting time generation for now
        const resultsSection = document.getElementById('resultsSection');
        const resultsDisplay = document.getElementById('resultsDisplay');
        const resultsLocationCount = document.getElementById('resultsLocationCount');
        
        if (resultsSection && resultsDisplay && resultsLocationCount) {
            resultsLocationCount.textContent = locations.length;
            
            // Set active duration button
            document.querySelectorAll('.duration-btn').forEach(btn => {
                btn.classList.remove('active');
                if (parseInt(btn.dataset.duration) === selectedDuration) {
                    btn.classList.add('active');
                }
            });
            
            // Generate meeting times based on next 7 days and location availability
            const durationText = selectedDuration === 30 ? '30min' : selectedDuration === 60 ? '1hr' : '2hr';
            
            // Helper function to calculate end time
            function calculateEndTime(startTime, durationMinutes) {
                const [time, period] = startTime.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                
                // Convert to 24-hour format
                let hour24 = hours;
                if (period === 'PM' && hours !== 12) hour24 += 12;
                if (period === 'AM' && hours === 12) hour24 = 0;
                
                // Add duration
                const totalMinutes = hour24 * 60 + minutes + durationMinutes;
                const endHour24 = Math.floor(totalMinutes / 60) % 24;
                const endMinutes = totalMinutes % 60;
                
                // Convert back to 12-hour format
                const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
                const endHour12 = endHour24 === 0 ? 12 : endHour24 > 12 ? endHour24 - 12 : endHour24;
                
                const endTimeStr = `${endHour12}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
                return `${startTime} - ${endTimeStr}`;
            }
            
            // Generate next 7 days
            function getNext7Days() {
                const days = [];
                const today = new Date();
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                for (let i = 1; i <= 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    days.push({
                        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
                        day: dayNames[date.getDay()],
                        dayIndex: date.getDay()
                    });
                }
                return days;
            }
            
            // Calculate weighted score for a meeting time across all locations
            function calculateWeightedScore(locationTimes, locations) {
                let greenCount = 0;
                let yellowCount = 0;
                let redCount = 0;
                
                locations.forEach((location, index) => {
                    const meetingTime = locationTimes[index];
                    const trafficLight = getTrafficLight(meetingTime, location);
                    if (trafficLight === '🟢') greenCount++;
                    else if (trafficLight === '🟡') yellowCount++;
                    else if (trafficLight === '🔴') redCount++;
                });
                
                const totalLocations = locations.length;
                
                // Calculate base score (0-100)
                let score = 0;
                
                if (redCount === 0) {
                    // No reds: high scores for green/yellow combinations
                    if (greenCount === totalLocations) {
                        score = 100; // All greens = perfect
                    } else {
                        // Mix of greens and yellows
                        const greenRatio = greenCount / totalLocations;
                        const yellowRatio = yellowCount / totalLocations;
                        score = Math.round(greenRatio * 100 + yellowRatio * 50);
                    }
                } else {
                    // Has reds: significantly lower scores
                    const redRatio = redCount / totalLocations;
                    const greenRatio = greenCount / totalLocations;
                    const yellowRatio = yellowCount / totalLocations;
                    
                    // Base score from greens/yellows, then apply red penalty
                    const baseScore = greenRatio * 60 + yellowRatio * 30;
                    const redPenalty = redRatio * 50; // Heavy penalty for reds
                    score = Math.max(0, Math.round(baseScore - redPenalty));
                }
                
                return Math.min(100, Math.max(0, score)); // Ensure 0-100 range
            }
            
            // Convert time to different timezone
            function convertTimeToTimezone(timeStr, fromTimezone, toTimezone) {
                try {
                    const [time, period] = timeStr.split(' ');
                    const [hours, minutes] = time.split(':').map(Number);
                    
                    // Create a date object for today with the given time
                    const today = new Date();
                    let hour24 = hours;
                    if (period === 'PM' && hours !== 12) hour24 += 12;
                    if (period === 'AM' && hours === 12) hour24 = 0;
                    
                    // Set the time in the from timezone
                    const baseDate = new Date();
                    baseDate.setHours(hour24, minutes, 0, 0);
                    
                    // Convert to target timezone
                    const convertedTime = new Date(baseDate.toLocaleString("en-US", {timeZone: toTimezone}));
                    
                    // Format back to 12-hour format
                    return convertedTime.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                } catch (error) {
                    return timeStr; // Fallback to original time
                }
            }
            
            // Generate meeting slots for next 7 days
            function generateMeetingSlots() {
                const days = getNext7Days();
                const slots = [];
                const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
                const baseTimezone = 'UTC'; // Use UTC as base reference
                
                days.forEach(day => {
                    // Check if all locations are available on this day
                    const allAvailable = locations.every(loc => loc.availableDays[day.dayIndex === 0 ? 6 : day.dayIndex - 1]);
                    
                    if (allAvailable) {
                        timeSlots.forEach(startTime => {
                            // Convert the base time to each location's timezone
                            const locationTimes = locations.map(location => {
                                const localStartTime = convertTimeToTimezone(startTime, baseTimezone, location.timezone);
                                return calculateEndTime(localStartTime, selectedDuration);
                            });
                            
                            // Calculate score based on all location times
                            const score = calculateWeightedScore(locationTimes, locations);
                            
                            slots.push({
                                date: day.date,
                                day: day.day,
                                times: locationTimes,
                                score: score
                            });
                        });
                    }
                });
                
                // Sort by score (highest first)
                return slots.sort((a, b) => b.score - a.score).slice(0, 10); // Top 10 slots
            }
            
            const meetingSlots = generateMeetingSlots();
            
            // Store meeting slots globally for export functions
            window.currentMeetingSlots = meetingSlots;
            
            // Helper function to get traffic light indicator
            function getTrafficLight(meetingTime, location) {
                if (!meetingTime || meetingTime === 'N/A') return '⚫';
                
                // Extract start time from "10:00 AM - 11:00 AM" format
                const startTime = meetingTime.split(' - ')[0];
                const meetingMinutes = timeToMinutes(startTime);
                const workStart = timeToMinutes(location.workingHours.start);
                const workEnd = timeToMinutes(location.workingHours.end);
                
                // Green: Within working hours
                if (meetingMinutes >= workStart && meetingMinutes <= workEnd) {
                    return '🟢';
                }
                
                // Yellow: Within 2 hours of working hours
                const twoHours = 120; // minutes
                if ((meetingMinutes >= workStart - twoHours && meetingMinutes < workStart) ||
                    (meetingMinutes > workEnd && meetingMinutes <= workEnd + twoHours)) {
                    return '🟡';
                }
                
                // Red: Outside acceptable range
                return '🔴';
            }
            
            // Helper function to convert time string to minutes since midnight
            function timeToMinutes(timeStr) {
                const [time, period] = timeStr.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                
                let hour24 = hours;
                if (period === 'PM' && hours !== 12) hour24 += 12;
                if (period === 'AM' && hours === 12) hour24 = 0;
                
                return hour24 * 60 + minutes;
            }
            
            const tableHeaders = ['Date', 'Day', ...locations.map(loc => loc.name), 'Score', 'Actions'];
            
            resultsDisplay.innerHTML = `
                <div class="results-header">
                    <p>Showing ${durationText} meeting slots for ${locations.length} locations</p>
                </div>
                <table class="results-table">
                    <thead>
                        <tr>
                            ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${meetingSlots.map((slot, index) => `
                            <tr>
                                <td>${slot.date}</td>
                                <td>${slot.day}</td>
                                ${locations.map((loc, locIndex) => `
                                    <td class="time-cell">
                                        ${getTrafficLight(slot.times[locIndex], loc)} ${slot.times[locIndex] || 'N/A'}
                                    </td>
                                `).join('')}
                                <td>
                                    <span class="score-badge ${getScoreClass(slot.score)}">
                                        ${getScoreEmoji(slot.score)} ${slot.score}%
                                    </span>
                                </td>
                                <td>
                                    <div class="export-actions">
                                        <button class="export-btn" onclick="exportToGoogleCalendar(${index})" title="Google Calendar">📅</button>
                                        <button class="export-btn" onclick="exportToOutlook(${index})" title="Outlook">📧</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
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
    
    // Generate ICS file content
    function generateICSContent(meetingData, title = 'Meeting') {
        console.log('Generating ICS content for:', meetingData);
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        // Parse meeting date and time
        const [startTimeStr] = meetingData.times[0].split(' - ');
        const meetingDate = new Date();
        meetingDate.setDate(meetingDate.getDate() + 1); // Tomorrow as example
        
        const [time, period] = startTimeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        
        meetingDate.setHours(hour24, minutes, 0, 0);
        
        const startTime = meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        // Add duration
        const endDate = new Date(meetingDate);
        endDate.setMinutes(endDate.getMinutes() + selectedDuration);
        const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        // Create location summary
        const locationSummary = locations.map(loc => `${loc.name} (${loc.timezone})`).join(', ');
        
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Timezone Wizard//Meeting Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${timestamp}@timezone-wizard.com
DTSTAMP:${timestamp}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:Multi-timezone meeting scheduled via Timezone Wizard\\n\\nParticipant locations:\\n${locations.map((loc, i) => `- ${loc.name}: ${meetingData.times[i]}`).join('\\n')}
LOCATION:${locationSummary}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
        
        console.log('Generated ICS content:', icsContent);
        return icsContent;
    };
    
    // Download ICS file
    function downloadICS(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    
    // Enhanced Loading States
    function showLoadingEnhanced(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('.loading-text');
        if (text) text.textContent = message;
        overlay.style.display = 'flex';
        
        // Add enhanced spinner animation
        const spinner = overlay.querySelector('.spinner');
        if (spinner) {
            spinner.classList.add('spinner-enhanced');
        }
    }
    
    function hideLoadingEnhanced() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }
    
    // Global functions for export actions
    window.exportToGoogleCalendar = function(index) {
        console.log('Export to Google Calendar:', index);
        try {
            const meetingData = window.currentMeetingSlots[index];
            if (meetingData) {
                const icsContent = window.generateICSContent(meetingData, 'Team Meeting - Timezone Wizard');
                downloadICS(icsContent, `google-calendar-meeting-${meetingData.date.replace(' ', '-')}.ics`);
            } else {
                console.error('Meeting data not found for index:', index);
                alert('Unable to export meeting. Please try again.');
            }
        } catch (error) {
            console.error('Export to Google Calendar failed:', error);
            alert('Export failed. Please try again.');
        }
    };
    
    window.exportToOutlook = function(index) {
        console.log('Export to Outlook:', index);
        try {
            const meetingData = window.currentMeetingSlots[index];
            if (meetingData) {
                const icsContent = window.generateICSContent(meetingData, 'Team Meeting - Timezone Wizard');
                downloadICS(icsContent, `outlook-meeting-${meetingData.date.replace(' ', '-')}.ics`);
            } else {
                console.error('Meeting data not found for index:', index);
                alert('Unable to export meeting. Please try again.');
            }
        } catch (error) {
            console.error('Export to Outlook failed:', error);
            alert('Export failed. Please try again.');
        }
    };
    
    // Load demo locations function
    function loadDemoLocations() {
        console.log('Loading demo locations...');
        
        // Clear existing locations
        locations = [];
        
        // Demo cities with their data from CITIES_DATABASE
        const demoCities = ['New York', 'Tokyo', 'Hong Kong', 'Sydney', 'Vancouver', 'Taipei'];
        
        demoCities.forEach(cityName => {
            let cityData = CITIES_DATABASE.find(city => city.name === cityName);
            
            // Handle Taipei which might not be in database
            if (!cityData && cityName === 'Taipei') {
                cityData = { 
                    name: 'Taipei', 
                    country: 'Taiwan', 
                    timezone: 'Asia/Taipei', 
                    flag: '🇹🇼' 
                };
            }
            
            if (cityData) {
                const location = {
                    id: Date.now() + Math.random(),
                    name: cityData.name,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    workingHours: {
                        start: '09:00',
                        end: '17:00'
                    },
                    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                };
                
                locations.push(location);
                console.log('Added demo location:', location.name);
            }
        });
        
        // Update UI and generate meeting times
        updateUI();
        
        // Auto-generate meeting times after a short delay
        setTimeout(() => {
            generateMeetingTimes();
        }, 500);
    }
    
    // Initialize UI
    updateUI();
    console.log('App initialized successfully');
});
