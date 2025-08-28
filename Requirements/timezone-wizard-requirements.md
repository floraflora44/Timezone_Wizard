# Timezone Wizard - Meeting Scheduler Tool Requirements

## Project Overview

**Project Name:** Timezone Wizard  
**Purpose:** A web-based meeting scheduler that helps users find optimal meeting times across multiple timezones by allowing them to input up to 6 different locations with their respective working hours.

## Functional Requirements

### 1. Location Management

#### 1.1 Location Input
- Users can add up to **6 different locations** (cities)
- Each location entry must include:
  - **City name** (with auto-complete suggestions)
  - **Working hours** (start and end time)
  - **Days of the week** when available (Monday-Sunday selection)
- Users can **edit** or **remove** added locations
- **Real-time timezone detection** for entered cities
- **Validation** to prevent duplicate cities

#### 1.2 Location Display
- Show all added locations in a clean, organized list
- Display each location with:
  - City name and country
  - Current local time
  - Working hours in local time
  - Available days
  - Timezone abbreviation (e.g., PST, EST, GMT)

### 2. Meeting Time Generation

#### 2.1 Algorithm Requirements
- Calculate **overlapping working hours** across all selected locations
- Consider **timezone differences** accurately
- Account for **daylight saving time** changes
- Prioritize time slots where **all participants** are available
- Generate **multiple meeting time options** (minimum 3, maximum 10)

#### 2.2 Meeting Time Display
- Show suggested meeting times in **all participant timezones**
- Display meeting duration options (30 min, 1 hour, 2 hours)
- Include **date and time** for each timezone
- Highlight **optimal times** (e.g., mid-morning for most participants)
- Show **availability score** for each suggested time slot

### 3. Detailed User Interface Requirements

#### 3.1 Page Layout Structure

**Header Section (Fixed, 80px height)**
- **Logo/Title Area:** "Timezone Wizard" with clock icon (left-aligned)
- **Subtitle:** "Find the perfect meeting time across timezones" (smaller text)
- **Settings Icon:** User preferences (24/12 hour format, theme) (right-aligned)
- **Help/Info Icon:** Quick tutorial or about modal (right-aligned)

**Main Content Area (Responsive, scrollable)**
- **Hero Section:** Welcome message and primary CTA when no locations added
- **Location Management Panel:** Input forms and location cards
- **Results Panel:** Meeting time suggestions (hidden until generated)

**Footer Section (60px height)**
- **Credits:** "Built with ❤️ for global teams"
- **Links:** Privacy Policy, Terms of Use, GitHub
- **Version Info:** App version number

#### 3.2 Location Input Interface

**Add Location Modal/Panel:**
- **Modal Overlay:** Semi-transparent background (rgba(0,0,0,0.5))
- **Modal Content:** 500px width, centered, white background, rounded corners
- **Header:** "Add Location" with close (×) button
- **City Input Section:**
  - Label: "City or Location"
  - Input field: 300px width, border-radius 8px
  - Placeholder: "Start typing city name..."
  - Autocomplete dropdown: Max 5 suggestions, keyboard navigable
  - Each suggestion shows: "City, Country (Timezone)"
- **Working Hours Section:**
  - Label: "Working Hours"
  - Two time pickers side by side: "From" and "To"
  - 12/24 hour toggle switch
  - Visual time range slider (optional enhancement)
- **Days Selection:**
  - Label: "Available Days"
  - 7 toggle buttons in a row (Mon-Sun)
  - All days selected by default
  - Visual indication of selected days (blue background)
- **Action Buttons:**
  - "Save Location" (primary blue button, right-aligned)
  - "Cancel" (secondary gray button, left-aligned)

#### 3.3 Location Management Interface

**Location Cards Grid:**
- **Container:** CSS Grid, responsive (1-3 columns based on screen size)
- **Individual Location Card (280px width):**
  - **Header:** City name (18px font, bold) + Country flag emoji
  - **Current Time:** Large digital clock (24px font, monospace)
  - **Timezone Info:** "GMT+2 (CEST)" (smaller gray text)
  - **Working Hours:** "9:00 AM - 5:00 PM" with day abbreviations
  - **Available Days:** Visual day indicators (M T W T F S S)
  - **Actions:** Edit (pencil icon) and Delete (trash icon) on hover
  - **Card Styling:** White background, subtle shadow, rounded corners

**Management Controls:**
- **Location Counter:** "3 of 6 locations added" (top of grid)
- **Add Another Button:** Prominent when <6 locations (+ icon with text)
- **Clear All Button:** Secondary button, confirmation required
- **Generate Times Button:** Primary CTA, enabled when ≥2 locations

#### 3.4 Meeting Time Results Interface

**Results Header:**
- **Title:** "Recommended Meeting Times" (24px font)
- **Subtitle:** "Based on [X] locations" with refresh icon
- **Duration Selector:** Pills for 30min, 1hr, 2hr (affects all results)
- **Sort Options:** By time, by availability score, by date

**Results Display Options:**

**Option A - Table Layout:**
- **Columns:** Date, Time slots for each location, Availability Score
- **Rows:** Each suggested meeting time
- **Cell Content:** Time in local format, color-coded by business hours
- **Hover Effects:** Highlight entire row, show tooltip with details

**Option B - Card Layout:**
- **Card Container:** Vertical stack of meeting time cards
- **Individual Card:**
  - **Header:** Date and availability score badge
  - **Time Grid:** Location name + time for each participant
  - **Footer:** Export actions (Copy, Calendar, Email)
  - **Styling:** White background, border-left color indicates score

**Interactive Elements:**
- **Expandable Details:** Click to show meeting details modal
- **Quick Actions:** One-click copy to clipboard
- **Export Menu:** Dropdown with multiple export options

#### 3.5 Component States and Interactions

**Button States:**
- **Primary Button:** Blue background, white text, hover darkens
- **Secondary Button:** Gray border, gray text, hover fills
- **Disabled Button:** Light gray, not clickable, with tooltip explanation
- **Loading Button:** Spinner icon, "Processing..." text

**Input Field States:**
- **Default:** Light gray border, placeholder text
- **Focus:** Blue border, placeholder disappears
- **Valid:** Green border (subtle)
- **Invalid:** Red border with error message below
- **Autocomplete Active:** Dropdown visible, keyboard navigation

**Card Hover States:**
- **Location Card:** Slight elevation, edit/delete icons appear
- **Meeting Time Card:** Border color intensifies, cursor pointer

**Loading States:**
- **Page Load:** Skeleton screens for main components
- **City Search:** Spinner in autocomplete dropdown
- **Meeting Generation:** Progress bar with percentage
- **Export Actions:** Button shows spinner during processing

#### 3.6 Responsive Design Breakpoints

**Desktop (1200px+):**
- 3-column location card grid
- Full table layout for results
- Side-by-side location input and results

**Tablet (768px - 1199px):**
- 2-column location card grid
- Condensed table or card layout for results
- Stacked location input and results

**Mobile (320px - 767px):**
- Single column location cards
- Card-only layout for results
- Full-width modal dialogs
- Collapsible sections for better space usage

#### 3.7 Animation and Transitions

**Page Transitions:**
- **Fade In:** New sections appear with 300ms fade
- **Slide Down:** Results section slides from top
- **Scale In:** Modal dialogs scale from 0.9 to 1.0

**Micro-Interactions:**
- **Button Hover:** 150ms color transition
- **Card Hover:** 200ms elevation change
- **Input Focus:** 150ms border color transition
- **Loading Spinner:** Continuous rotation animation

**Success Feedback:**
- **Location Added:** Green checkmark animation
- **Meeting Generated:** Confetti or success pulse
- **Export Complete:** Brief "Copied!" tooltip

## Technical Requirements

### 4. Data Management

#### 4.1 Timezone Handling
- Use **IANA timezone database** for accurate timezone data
- Handle **daylight saving time** transitions automatically
- Support for **historical timezone changes**
- Real-time **timezone offset calculations**

#### 4.2 City Database
- Integration with **geocoding API** (Google Maps, OpenWeatherMap, or similar)
- **Fuzzy search** capabilities for city names
- Support for **major cities worldwide** (minimum 1000+ cities)
- **Country and region** information for disambiguation

### 5. Performance Requirements

#### 5.1 Response Times
- Location search results: **< 500ms**
- Meeting time calculation: **< 2 seconds**
- Page load time: **< 3 seconds**

#### 5.2 Scalability
- Support **concurrent users** without performance degradation
- **Client-side calculations** where possible to reduce server load

### 6. Browser Compatibility

- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile responsive** design for tablets and smartphones
- **Progressive Web App** capabilities (optional enhancement)

## User Experience Requirements

### 7. Usability

#### 7.1 Detailed User Flow

**Initial Landing Experience:**
1. **Homepage Load**
   - User arrives at clean, professional interface
   - Hero section displays "Timezone Wizard" title with subtitle "Find the perfect meeting time across timezones"
   - Brief explanation: "Add up to 6 locations with working hours to find optimal meeting times"
   - Prominent "Add First Location" button (primary CTA)
   - Optional: Quick demo or example showing 3 sample locations

**Location Addition Flow:**
2. **First Location Entry**
   - Click "Add First Location" opens location input modal/section
   - City input field with placeholder "Enter city name (e.g., New York, London)"
   - Real-time autocomplete dropdown appears after 2+ characters
   - User selects city from dropdown (shows city, country, timezone)
   - Working hours section with two time pickers (Start/End)
   - Days of week selector with all days checked by default
   - "Save Location" button becomes enabled when all fields valid
   - "Cancel" option to close without saving

3. **Subsequent Location Entries (2-6)**
   - "Add Another Location" button appears after first location saved
   - Same input flow as first location
   - Location counter updates: "2 of 6 locations added"
   - Each saved location appears as a card below input area
   - "Generate Meeting Times" button appears after 2nd location (initially disabled)

**Location Management:**
4. **Location Card Interactions**
   - Each location displays: City name, current time, working hours, available days
   - Hover effects reveal edit/delete icons
   - Edit opens same modal with pre-filled data
   - Delete shows confirmation: "Remove [City Name]? This action cannot be undone"
   - Real-time clock updates every minute for each location

**Meeting Generation Flow:**
5. **Generate Meeting Times**
   - Button becomes enabled (blue) when 2+ locations added
   - Click triggers loading state with progress indicator
   - Loading message: "Analyzing timezones and finding optimal meeting times..."
   - Calculation completes in <2 seconds

6. **Results Display**
   - Results section slides into view below locations
   - Header: "Recommended Meeting Times" with refresh icon
   - Table/card layout showing 3-10 suggested times
   - Each suggestion shows date, time in all participant timezones
   - Color-coded availability scores (Green: Excellent, Yellow: Good, Orange: Fair)
   - Meeting duration selector (30min, 1hr, 2hr) updates all suggestions

**Post-Results Actions:**
7. **Results Interaction**
   - Click any meeting time to expand details
   - Export options: "Copy to Clipboard", "Add to Calendar", "Email Details"
   - "Try Different Times" button to regenerate with different parameters
   - Modify locations triggers automatic re-calculation

**Error Recovery Flow:**
8. **Error Scenarios**
   - Invalid city: "City not found. Try 'New York' or 'London, UK'"
   - No overlapping hours: "No common meeting times found. Try adjusting working hours."
   - API failure: "Unable to load city data. Please check connection and try again."
   - Each error includes suggested action and retry option

#### 7.2 Error Handling
- **Clear error messages** for invalid inputs
- **Graceful degradation** when APIs are unavailable
- **Validation feedback** in real-time
- **Recovery suggestions** for common errors

#### 7.3 Accessibility
- **WCAG 2.1 AA compliance**
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Focus indicators** for all interactive elements

### 8. Visual Design Requirements

#### 8.1 Design Principles
- **Clean and minimal** interface
- **Professional appearance** suitable for business use
- **Intuitive iconography** and visual cues
- **Consistent color scheme** and typography

#### 8.2 Color Scheme
- **Primary colors:** Professional blues and whites
- **Accent colors:** For highlighting optimal times
- **Status colors:** Green (available), Red (unavailable), Yellow (partial)

#### 8.3 Typography
- **Readable fonts** (minimum 14px for body text)
- **Clear hierarchy** with appropriate font weights
- **Monospace fonts** for time displays

## Data Requirements

### 9. Input Validation

#### 9.1 Location Validation
- City name must be **valid and recognized**
- Working hours must be **logical** (start < end time)
- At least **one day** must be selected
- Maximum **6 locations** enforced

#### 9.2 Time Validation
- Working hours between **00:00 and 23:59**
- **Minimum 1-hour** working window required
- **Cross-midnight** working hours supported (e.g., 22:00-06:00)

### 10. Output Requirements

#### 10.1 Meeting Time Format
- **ISO 8601** format for data exchange
- **Localized time display** for each timezone
- **12/24 hour format** user preference
- **Date format** according to locale

#### 10.2 Export Capabilities
- **Copy to clipboard** functionality
- **Calendar event** generation (ICS format)
- **Email template** with meeting details
- **Print-friendly** format

## Security and Privacy

### 11. Data Protection
- **No personal data storage** on servers
- **Client-side processing** where possible
- **HTTPS encryption** for all communications
- **No tracking** of user meeting data

### 12. API Security
- **Rate limiting** for external API calls
- **API key protection** and rotation
- **Error handling** without exposing sensitive information

## Future Enhancements (Optional)

### 13. Advanced Features
- **Recurring meeting** support
- **Meeting duration optimization**
- **Participant availability** import from calendars
- **Multiple meeting types** (urgent, flexible, etc.)
- **Team templates** for common location groups
- **Integration** with popular calendar applications
- **Meeting room booking** integration
- **Email notifications** and reminders

### 14. Analytics (Optional)
- **Usage statistics** (anonymized)
- **Popular timezone combinations**
- **Performance monitoring**
- **User feedback collection**

## Success Criteria

### 15. Key Performance Indicators
- **User task completion rate:** > 90%
- **Time to generate meeting times:** < 2 seconds
- **User satisfaction score:** > 4.5/5
- **Mobile usability score:** > 85%
- **Accessibility compliance:** WCAG 2.1 AA

### 16. Launch Requirements
- **Cross-browser testing** completed
- **Mobile responsiveness** verified
- **Performance benchmarks** met
- **Accessibility audit** passed
- **User acceptance testing** completed

## Technical Architecture Notes

### 17. Recommended Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework:** React, Vue.js, or vanilla JavaScript
- **Timezone Library:** Moment.js with timezone, or date-fns-tz
- **Geocoding API:** Google Maps Geocoding API or similar
- **Styling:** CSS Grid/Flexbox, responsive design
- **Build Tools:** Webpack, Vite, or similar
- **Testing:** Jest, Cypress for end-to-end testing

### 18. Development Phases
1. **Phase 1:** Basic location input and timezone detection
2. **Phase 2:** Meeting time calculation algorithm
3. **Phase 3:** UI/UX implementation and styling
4. **Phase 4:** Testing, optimization, and deployment
5. **Phase 5:** Advanced features and enhancements

## Wireframe Descriptions and Component Specifications

### 19. Page Wireframes

#### 19.1 Homepage Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│ [🕐 Timezone Wizard]                    [⚙️Settings] [ℹ️Help] │
│ Find the perfect meeting time across timezones                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           Welcome to Timezone Wizard                           │
│     Add up to 6 locations to find optimal meeting times        │
│                                                                 │
│                 [+ Add First Location]                         │
│                                                                 │
│     Or try a quick demo with: New York, London, Tokyo          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Built with ❤️ for global teams    Privacy │ Terms │ GitHub     │
└─────────────────────────────────────────────────────────────────┘
```

#### 19.2 Location Management Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ [🕐 Timezone Wizard]                    [⚙️Settings] [ℹ️Help] │
├─────────────────────────────────────────────────────────────────┤
│ 3 of 6 locations added                    [Clear All]          │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│ │New York 🇺🇸 │ │London 🇬🇧   │ │Tokyo 🇯🇵    │                │
│ │2:30 PM      │ │7:30 PM      │ │3:30 AM+1    │                │
│ │GMT-5 (EST)  │ │GMT+0 (GMT)  │ │GMT+9 (JST)  │                │
│ │9AM - 5PM    │ │9AM - 5PM    │ │9AM - 6PM    │                │
│ │M T W T F S S│ │M T W T F - S│ │M T W T F - -│                │
│ │   [✏️] [🗑️]  │ │   [✏️] [🗑️]  │ │   [✏️] [🗑️]  │                │
│ └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                 │
│           [+ Add Another Location] [Generate Meeting Times]     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Built with ❤️ for global teams    Privacy │ Terms │ GitHub     │
└─────────────────────────────────────────────────────────────────┘
```

#### 19.3 Results Display Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    Recommended Meeting Times                    │
│ Based on 3 locations          [🔄] [30min][1hr][2hr]          │
├─────────────────────────────────────────────────────────────────┤
│ Date      │ New York  │ London    │ Tokyo     │ Score │ Actions │
├─────────────────────────────────────────────────────────────────┤
│ Aug 28    │ 10:00 AM  │ 3:00 PM   │ 11:00 PM  │ 🟢 95% │ [📋][📅] │
│ Aug 28    │ 11:00 AM  │ 4:00 PM   │ 12:00 AM  │ 🟡 78% │ [📋][📅] │
│ Aug 28    │ 2:00 PM   │ 7:00 PM   │ 3:00 AM   │ 🟠 65% │ [📋][📅] │
├─────────────────────────────────────────────────────────────────┤
│                    [Try Different Times]                       │
└─────────────────────────────────────────────────────────────────┘
```

#### 19.4 Add Location Modal
```
┌─────────────────────────────────────────────────────────────────┐
│                     Add Location                           [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ City or Location                                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ London                                                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ > London, United Kingdom (GMT+0)                           │ │
│ │   London, Ontario, Canada (GMT-5)                          │ │
│ │   London, Kentucky, USA (GMT-5)                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Working Hours                                                   │
│ From: [09:00] To: [17:00]                    [12hr][24hr]      │
│                                                                 │
│ Available Days                                                  │
│ [Mon][Tue][Wed][Thu][Fri][Sat][Sun]                           │
│                                                                 │
│                              [Cancel]    [Save Location]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 20. Component Specifications

#### 20.1 LocationCard Component
**Props:**
- `city`: string - City name
- `country`: string - Country name  
- `timezone`: string - Timezone abbreviation
- `currentTime`: Date - Current local time
- `workingHours`: {start: string, end: string}
- `availableDays`: boolean[] - 7-element array for days
- `onEdit`: function - Edit callback
- `onDelete`: function - Delete callback

**State:**
- `isHovered`: boolean - Show/hide action buttons
- `currentTime`: Date - Updates every minute

#### 20.2 TimezonePicker Component
**Props:**
- `value`: string - Selected timezone
- `onChange`: function - Change callback
- `placeholder`: string - Input placeholder

**Features:**
- Autocomplete with fuzzy search
- Timezone validation
- Real-time offset display

#### 20.3 MeetingTimeCard Component
**Props:**
- `meetingTime`: object - Meeting details
- `locations`: array - All participant locations
- `availabilityScore`: number - 0-100 score
- `onExport`: function - Export callback

**Features:**
- Expandable details view
- Color-coded availability
- Multiple export options

#### 20.4 WorkingHoursSelector Component
**Props:**
- `startTime`: string - Start time (HH:MM)
- `endTime`: string - End time (HH:MM)
- `format`: '12h' | '24h' - Time format
- `onChange`: function - Change callback

**Features:**
- Time picker with validation
- Cross-midnight support
- Visual time range display

### 21. Interaction Specifications

#### 21.1 Keyboard Navigation
- **Tab Order:** Header → Add Location → Location Cards → Generate Button → Results
- **Location Cards:** Arrow keys navigate between cards
- **Modal Forms:** Tab through inputs, Enter to submit, Escape to cancel
- **Results Table:** Arrow keys navigate cells, Enter to expand details

#### 21.2 Touch Interactions (Mobile)
- **Swipe Left/Right:** Navigate between location cards
- **Long Press:** Show context menu for location cards
- **Pull to Refresh:** Regenerate meeting times
- **Pinch to Zoom:** Scale time display (accessibility)

#### 21.3 Error State Handling
**Network Errors:**
- Show retry button with exponential backoff
- Cache last successful results
- Offline mode with limited functionality

**Validation Errors:**
- Real-time field validation
- Error messages below inputs
- Prevent form submission until valid

**API Rate Limits:**
- Show "Too many requests" message
- Implement client-side rate limiting
- Queue requests when possible

---

**Document Version:** 1.1  
**Last Updated:** August 27, 2025  
**Status:** Comprehensive Requirements - Ready for Development
