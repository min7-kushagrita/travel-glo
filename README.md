Travel Memory Globe 🌍

Turn your trips into a 3D scrapbook. Spin a globe, pin the places you've been, attach photos and silly stories, and keep a wishlist for where you want to go next.

Built with React, Vite and Three.js. No backend and no login: everything is saved in your browser.

Features
Interactive 3D globe. Drag to rotate, scroll to zoom, and watch it drift slowly when idle.
Pin a memory. Click anywhere on the globe to save a title, date, story, funny moment and a photo.
Wishlist. Pin places you want to visit, and mark them "I went here" to turn them into memories.
Discover. Pick a mood (Beaches, Mountains, Culture, Food, Adventure, Calm) and get destination ideas.
Trip planner. Choose wishlist places and a trip length to get a day-by-day route with distances.
Place search. Jump to any city or country using OpenStreetMap search.
Saved automatically. Your data stays in the browser's localStorage.
Works on mobile. The side panel becomes a bottom sheet on small screens.

Tech stack
Part	Tool
UI	React 18
Build tool	Vite
3D globe	Three.js (with OrbitControls)
Place search	OpenStreetMap Nominatim
Storage	Browser localStorage
Styling	Plain CSS

How to use it
Add a memory: click a spot on the globe, choose Memory, fill in the details and save.
Open a memory: click a gold pin, or pick it from the Memories tab.
Add to your wishlist: click the globe and choose Wishlist, or use Add to wishlist in Discover. Wishlist pins are teal.
Plan a trip: open the Plan tab, tick the places you want, set the number of days and press Build route.

Project structure
travel-memory-globe/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              App entry point
    ├── App.jsx               State and page layout
    ├── index.css             All styles
    ├── components/
    │   ├── Globe.jsx         Three.js globe, pins, click-to-pin, fly-to
    │   ├── AddModal.jsx      Form for memories and wishlist items
    │   ├── MemoryList.jsx    Memory cards
    │   ├── WishlistPanel.jsx Wishlist cards
    │   ├── DiscoverPanel.jsx Mood-based destination ideas
    │   ├── TripPlanner.jsx   Route builder
    │   └── SearchBox.jsx     Place search
    └── lib/
        ├── geo.js            Latitude/longitude to 3D maths, distances
        ├── ai.js             Destination suggestions
        ├── planner.js        Nearest-neighbour route planning
        ├── destinations.js   Built-in list of destinations
        └── storage.js        localStorage hook

Contributing

Contributions are welcome. Fork the repo, create a branch, make your change and open a pull request. For bigger changes, please open an issue first to talk it through.

Acknowledgements
Three.js for 3D rendering
three-globe for the Earth texture
OpenStreetMap Nominatim for place search
