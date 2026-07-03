# Pulse

A fitness leaderboard app — log workouts, build a streak, and compete on a monthly leaderboard with friends.

**Live:** https://jogendra-india.github.io/pulse/


## Features

- Create an athlete profile with a name, weekly minute goal, and profile photo
- Log workouts with exercise type, minutes, a start time (defaults to now, editable), and free-text notes
- Attach a photo to any workout entry
- Edit or delete a logged entry within 10 minutes of creating it
- Click any entry to see its full details, including a full-size photo view
- Monthly leaderboard ranked by activity, streaks, weekly goal hits, and exercise variety
- Per-athlete activity calendar and full workout history
- Works offline: the app shell loads instantly via a service worker, and API calls fail fast with a cached fallback when the backend is unreachable

## Stack

- Frontend: a single self-contained `index.html` built on a small declarative-component runtime (`support.js`), hosted on GitHub Pages
- Backend: a Django REST app (`pulse` app in `sonu-office-backend`) providing unauthenticated CRUD for athletes and workout entries, including image uploads

## Status

Proof of concept — no login, sample/demo data is not seeded, and data is shared across everyone who opens the site.
