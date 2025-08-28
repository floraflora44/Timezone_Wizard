# Timezone Wizard - Codebase Documentation

## Project Overview
**Timezone Wizard** is a web-based meeting scheduler application that helps users find optimal meeting times across multiple timezones. Built with vanilla JavaScript, HTML5, and CSS3 with no external dependencies.

## Core Features
- **Multi-timezone Support**: Add up to 6 locations with different timezones
- **Working Hours Configuration**: Set custom working hours and available days per location
- **Smart Scheduling Algorithm**: Generates meeting recommendations based on next 7 days
- **Traffic Light System**: Visual indicators (🟢🟡🔴) for meeting time suitability
- **ICS Export**: Download calendar files for Google Calendar and Outlook
- **Real-time Clocks**: Live time display for each location
- **Responsive Design**: Works on desktop and mobile devices

## File Structure
```
/personal-website/
├── index.html              # Main HTML structure
├── styles.css              # Complete CSS styling
├── script-simple.js        # Main JavaScript functionality
├── package.json            # Project metadata
├── README.md               # Project documentation
└── Requirements/
    └── timezone-wizard-requirements.md  # Detailed requirements
```

## Architecture Overview

### HTML Structure (index.html)
- **Header**: Logo, title, settings/help buttons
- **Hero Section**: Initial welcome screen with "Add First Location" button
- **Location Section**: Grid of location cards with management controls
- **Results Section**: Meeting recommendations table with duration toggles
- **Modal**: Add/edit location form with autocomplete
- **Footer**: Simple footer with links

### CSS Styling (styles.css)
- **Modern Design**: Clean, professional interface using Inter font
- **Responsive Layout**: CSS Grid and Flexbox for adaptive design
- **Component-based**: Modular styles for buttons, cards, modals, tables
- **Color Scheme**: Professional blue/gray palette with traffic light colors
- **Animations**: Smooth transitions and hover effects

### JavaScript Logic (script-simple.js)

#### Core Data Structures
```javascript
// Global variables
let locations = [];           // Array of location objects
let selectedDuration = 30;    // Meeting duration in minutes
let currentEditIndex = -1;    // Index for editing locations

// Location object structure
{
    name: "Hong Kong",
    country: "Hong Kong", 
    timezone: "Asia/Hong_Kong",
    flag: "🇭🇰",
    workingHours: { start: "09:00", end: "17:00" },
    availableDays: [true, true, true, true, true, false, false] // Mon-Sun
}
```

#### Cities Database
Static array of 13 major cities with timezone information:
- New York (America/New_York)
- London (Europe/London) 
- Tokyo (Asia/Tokyo)
- Hong Kong (Asia/Hong_Kong)
- Singapore (Asia/Singapore)
- Los Angeles (America/Los_Angeles)
- Berlin (Europe/Berlin)
- Toronto (America/Toronto)
- Mumbai (Asia/Kolkata)
- Dubai (Asia/Dubai)
- Paris (Europe/Paris)
- Sydney (Australia/Sydney)
- Vancouver (America/Vancouver)

#### Key Functions

**Location Management:**
- `addLocation()`: Adds new location to array
- `editLocation(index)`: Opens modal for editing
- `deleteLocation(index)`: Removes location with confirmation
- `updateUI()`: Refreshes location cards display

**Timezone Handling:**
- `getCurrentTimeForLocation(location)`: Gets current time in location's timezone
- `getTimezoneOffset(location)`: Calculates GMT offset display
- `convertTimeToTimezone()`: Converts times between timezones

**Meeting Generation:**
- `generateMeetingSlots()`: Creates meeting recommendations for next 7 days
- `calculateWeightedScore()`: Scores meetings based on traffic light system
- `getTrafficLight()`: Determines green/yellow/red indicator

**Export Functionality:**
- `generateICSContent()`: Creates ICS calendar file content
- `downloadICS()`: Triggers file download
- `exportToGoogleCalendar()`: Exports for Google Calendar
- `exportToOutlook()`: Exports for Outlook

## Scoring Algorithm

### Traffic Light System
- **🟢 Green**: Meeting time is within working hours
- **🟡 Yellow**: Meeting time is within 2 hours of working hours  
- **🔴 Red**: Meeting time is outside acceptable range

### Weighted Scoring
```javascript
// Without red lights (high scores)
if (greenCount === totalLocations) score = 100;  // All greens
else score = (greenRatio * 100) + (yellowRatio * 50);

// With red lights (heavy penalties)  
baseScore = (greenRatio * 60) + (yellowRatio * 30);
redPenalty = redRatio * 50;
score = Math.max(0, baseScore - redPenalty);
```

### Ranking Priority
1. All greens (100%)
2. Mix of greens + yellows (67-84%)
3. All yellows (50%)
4. Any combination with reds (0-40% with penalties)

## Technical Implementation Details

### Event Handling
- **DOMContentLoaded**: Initializes app and attaches event listeners
- **Modal Management**: Open/close with form validation
- **Autocomplete**: Real-time city search with dropdown
- **Duration Toggle**: Updates meeting times dynamically
- **Form Validation**: Enables/disables save button based on input

### Timezone Calculations
- Uses native `Intl.DateTimeFormat` and `toLocaleString()` for timezone conversions
- Static timezone offset mappings for reliability
- Handles daylight saving time automatically via browser APIs

### Data Persistence
- Uses `localStorage` to persist user locations between sessions
- No server-side storage required

### ICS File Generation
- Standard RFC 5545 compliant calendar format
- Includes meeting details, participants, and timezone information
- Compatible with Google Calendar, Outlook, and other calendar applications

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design

## Performance Considerations
- No external dependencies (lightweight)
- Efficient DOM manipulation
- Minimal API calls (all client-side processing)
- Optimized for up to 6 locations and 7-day scheduling window

## Security Notes
- No sensitive data transmission
- All processing happens client-side
- No external API dependencies
- Safe for offline use

## Future Enhancement Opportunities
- Server-side integration for larger city database
- Calendar API integration for direct scheduling
- Email invitation system
- Meeting room booking integration
- Advanced recurring meeting patterns
- Team collaboration features

## Development Notes
- Built incrementally with user feedback
- Simplified from complex initial implementation
- Focuses on core functionality over advanced features
- Prioritizes user experience and reliability

## Debugging Information
- Extensive console logging for troubleshooting
- Error handling with user-friendly messages
- Validation feedback for form inputs
- Clear visual indicators for all states

---

*Last Updated: August 27, 2025*
*Version: 1.0*
*Built by: Cascade AI Assistant*
