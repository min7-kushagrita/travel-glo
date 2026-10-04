Build a complete web application called "Travel Memory Globe".

IMPORTANT:
Do not create only a static UI/mockup. Build a functional application with reusable components, working interactions, local persistence, and a proper AI integration layer.

TECH STACK:
- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- Groq API for AI features
- Node.js/Express backend or secure server-side API route for Groq
- localStorage for the initial MVP data persistence

CORE CONCEPT:
Travel Memory Globe is a digital travel scrapbook + interactive 3D globe where users document places they have travelled to, preserve memories attached to those places, maintain a wishlist, discover destinations, and eventually plan future trips.

The main UI is a cinematic interactive 3D Earth.

The product has three primary layers:

MEMORIES → Where we've been ❤️
WISHLIST → Where we want to go ✈️
DISCOVER + PLAN → Where we might go next 🧭


==================================================
1. INTERACTIVE 3D GLOBE
==================================================

Create a full-screen interactive 3D Earth.

Visual:
- Deep navy/black background
- Starry cinematic atmosphere
- Realistic-looking Earth
- Subtle atmospheric glow
- Smooth rotation
- Smooth zoom
- Responsive interaction

Markers:
- Visited locations = glowing gold/teal markers
- Wishlist locations = visually different marker
- Marker hover = location name
- Marker click = globe smoothly flies to that location

When a location is selected:
- Zoom toward it
- Show a glassmorphism location panel
- Clearly identify whether it is:
  PERSONAL MEMORY
  WISHLIST
  or DISCOVER

Add:
- Search location
- Fly-to-location animation
- Reset globe
- Timeline slider

Timeline:
Moving through the timeline should reveal memories according to trip date.


==================================================
2. TRAVEL MEMORIES
==================================================

Users can create a memory for a visited location.

Memory fields:
- Trip title
- Destination
- Date
- Photos
- Story
- Funny/chaotic moments
- Mood/emojis
- People
- Trip statistics
- Song/vibe
- Personal notes

Each memory should feel like a scrapbook.

Do NOT use a boring rectangular grid gallery.

Photos should:
- Float
- Slightly overlap
- Have subtle rotations
- Have depth/shadows
- Feel like physical photographs
- Lift slightly on hover
- Expand when clicked

Clicking a photo opens a full-screen camera-roll-style lightbox.

Lightbox:
- Blurred/dimmed background
- Smooth opening animation
- Previous/next navigation
- Close button
- Mobile swipe support


==================================================
3. PEOPLE
==================================================

Each trip can contain people who travelled together.

Display:
- Large profile/face photos
- Names
- Memories connected to them
- Photos involving them

Allow a user to select a person and see memories/photos connected to that person.


==================================================
4. VIBE OF THE PLACE
==================================================

Each trip can have a soundtrack.

Fields:
- Song title
- Artist
- Optional audio/link
- Why this song reminds the user of the place

Example:

KYOTO
Vibe 🎵

Song:
[Song title]

"Played this throughout the train journey."

Create a visual mood section for each trip.


==================================================
5. WISHLIST
==================================================

Create a separate collection for places the user wants to visit.

Each wishlist destination can contain:
- Destination name
- Why I want to go
- Famous attractions
- Things I want to experience
- Photos
- Personal notes

Add:
"Add to Wishlist"

When the user eventually visits:
"Mark as Visited"

This should convert the wishlist destination into a Memory.


==================================================
6. DISCOVER
==================================================

A user should be able to select/search a location even if they have never visited it.

Show a DISCOVER panel containing:
- Destination overview
- Famous landmarks
- Food
- Cultural highlights
- Recommended experiences

IMPORTANT:
Clearly separate AI-generated/discovered information from the user's personal memories.

Never present generated information as if it were the user's personal experience.


==================================================
7. GROQ AI INTEGRATION
==================================================

Integrate Groq API as the AI intelligence layer.

IMPORTANT SECURITY REQUIREMENT:
NEVER expose GROQ_API_KEY in frontend React code.

Store the API key in an environment variable:

GROQ_API_KEY=your_key_here

Create a secure backend/server-side API route that communicates with Groq.

Install and use the official Groq JavaScript SDK:

groq-sdk

Use a currently supported production model from Groq and keep the model configurable through an environment variable.

Create an AI service such as:

/api/ai

or

server/services/groq.ts


AI FEATURES:

A. AI DESTINATION DISCOVERY

User can type:

"Tell me about Kyoto"

The AI should generate structured destination information:

- Short overview
- Famous places
- Food
- Cultural highlights
- Recommended experiences

Return structured JSON where practical.


B. AI TRAVEL PLANNER

For wishlist destinations, provide:

"Plan This Trip"

User enters:
- Destination
- Number of days
- Interests
- Places they already want to visit

AI generates a day-by-day itinerary.

Example:

PARIS — 3 DAYS

Day 1
Eiffel Tower
→ Seine
→ Louvre

Day 2
Montmartre
→ Sacré-Cœur

Day 3
Versailles
→ Free time

Allow the user to edit and reorder the generated itinerary.


C. AI MEMORY ASSISTANT

When the user adds a rough memory such as:

"Train was late, then we found this tiny cafe and stayed there for hours."

AI can help turn it into a polished short travel-journal caption.

IMPORTANT:
The AI must preserve the user's meaning and should not invent events that the user did not provide.

Provide:
"Generate Caption"

and

"Rewrite"

buttons.


D. AI TRIP SUMMARY

Given the user's memories from a trip, generate:
- Short trip summary
- Highlights
- Mood
- Memorable moments

Clearly label this as AI-generated.


E. AI RECOMMENDATIONS

For a destination, allow:

"Recommend experiences"

The AI can suggest:
- Food experiences
- Cultural activities
- Places to explore
- General travel experiences

Keep these separate from personal memories.


==================================================
8. PRIVACY & SECURITY
==================================================

Personal memories and photos are sensitive user data.

Implement privacy-conscious architecture.

Requirements:
- Never expose API keys in frontend
- Keep secrets in environment variables
- Do not send unnecessary personal information to the AI
- Clearly distinguish user-generated content from AI-generated content
- Provide a privacy/settings area
- Allow users to delete memories
- Avoid logging private memory content unnecessarily

For the MVP, use localStorage for basic persistence.

Structure the code so a secure database/storage system can be added later.


==================================================
9. SHARED MEMORIES
==================================================

Design the architecture for future shared trips.

Users who participated in a trip should eventually be able to access selected:
- Photos
- Videos
- Highlights
- Trip memories

For the MVP:
Create the UI and data structure, but do not require a complex authentication system unless necessary.

Add a future-ready "Share Trip" feature placeholder.


==================================================
10. HOTELS & RESTAURANTS
==================================================

For destinations, create a recommendations section for:

Hotels
Restaurants
Local experiences

For the MVP, use clearly labelled sample/mock recommendations.

Structure the application so real travel APIs can be connected later.

Do not pretend mock recommendations are live bookings or verified current listings.


==================================================
11. OPTIONAL TRAVEL PLANNER
==================================================

For wishlist destinations:

Plan This Trip →

- Number of days
- Interests
- Famous places
- Custom places
- Notes
- Day-by-day organization
- Drag/reorder activities
- Save itinerary

The Groq AI planner should generate the initial itinerary.

The user must remain able to edit it manually.


==================================================
12. DOCUMENTARY MODE
==================================================

Add:

"PLAY JOURNEY"

This creates a chronological documentary from the user's trips.

Flow:

Trip 1
↓
Trip 2
↓
Trip 3
↓
...

At each location:
- Globe flies to destination
- Trip title appears
- Date appears
- Short caption
- Photos preview
- Route animation toward next destination

Controls:
Pause
Skip
Previous
Exit


==================================================
13. SCRAPBOOK / PHOTO-BOOTH EXPERIENCE
==================================================

The website should feel like:

SCRAPBOOK × CAMERA ROLL × PHOTO BOOTH × TRAVEL JOURNAL

Photos/cards can:
- Float
- Overlap
- Slightly tilt
- Have depth
- Animate into position
- Lift on hover
- Expand on click

Add subtle:
- Stickers
- Postcards
- Handwritten notes
- Doodles
- Travel stamps

Do not overcrowd the interface.

The interaction should feel tactile and playful.


==================================================
14. VISUAL DESIGN
==================================================

Overall style:

DARK CINEMATIC + WHIMSICAL + SCRAPBOOK

Colors:
- Deep navy
- Black
- Gold
- Teal

Use:
- Glassmorphism
- Backdrop blur
- Translucent panels
- Soft borders
- Soft shadows
- Starry background
- Elegant typography
- Handwritten accent typography

Avoid:
- Generic travel website design
- Generic dashboard appearance
- Excessive cards
- Excessive animations
- Heavy videos
- Slow interactions


==================================================
15. NAVIGATION
==================================================

Minimal navigation:

🌍 Globe
❤️ Memories
✈️ Wishlist
🔎 Discover
🧭 Plan
🎬 Journey

Keep the globe visually dominant.


==================================================
16. SAMPLE DATA
==================================================

Create sample visited memories:

Kyoto
Paris
Goa

Create sample wishlist:

Switzerland
New York
Bali

Use realistic-looking placeholder/sample images.


==================================================
17. RESPONSIVENESS
==================================================

Desktop:
Large cinematic globe.

Tablet:
Globe + collapsible information panels.

Mobile:
Globe remains interactive.
Panels become bottom sheets.
Scrapbook photos become swipeable.
Lightbox supports touch gestures.


==================================================
18. PERFORMANCE
==================================================

Optimize the 3D globe.

- Lazy-load heavy assets
- Avoid unnecessary re-renders
- Keep animations lightweight
- Use compressed images where appropriate
- Do not make the interface feel slow


==================================================
19. CODE STRUCTURE
==================================================

Use reusable components.

Suggested structure:

src/
  components/
    Globe/
    Memory/
    Wishlist/
    Discover/
    Planner/
    Documentary/
    Scrapbook/
    Lightbox/
    Navigation/

  data/
  hooks/
  services/
    groq.ts

  types/
  utils/

server/
  routes/
  services/

.env
.env.example

Create:

.env.example

with:

GROQ_API_KEY=

Never commit the real API key.


==================================================
FINAL PRODUCT EXPERIENCE
==================================================

The final experience should feel like opening a personal travel documentary.

Not:

"Here is a travel website."

Instead:

"This is my world.
These are the places I've been.
These are the memories I made.
These are the places I dream of visiting."

The core experience should combine:

Google Earth
×
Camera Roll
×
Spotify
×
Scrapbook
×
Photo Booth
×
Travel Journal
×
AI Travel Assistant

Build the MVP first, but structure the code so the remaining features can be expanded without rewriting the entire application.