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
- Skip a day with an excuse instead of breaking your record silently
- Workout buddies: everyone is paired up, you both earn a bonus on days you both log, and either of you can poke the other
  - Pairings run for a week and reshuffle every Monday, with the dates shown in the app
  - Whoever's been most active is paired with whoever's been least, so momentum gets shared around
  - New athletes are paired the moment they sign up, taking the bench seat if nobody's waiting
- Push reminders around your usual workout time, plus buddy bonus/penalty recaps
- A coach card with an AI-written daily suggestion and a month-in-review
- Per-athlete activity calendar and full workout history
- Works offline: the app shell loads instantly via a service worker, and API calls fail fast with a cached fallback when the backend is unreachable

## Stack
- Frontend: a single self-contained `index.html` built on a small declarative-component runtime (`support.js`), hosted on GitHub Pages
- Backend: a Django REST app serving athletes, entries, buddies and push subscriptions, including image uploads. Athletes hold a bearer token issued at signup; the password defaults to their first name and can be changed from the profile page.

## Status

Proof of concept — the login is deliberately low-friction, no demo data is seeded, and the leaderboard is shared by everyone who opens the site.
