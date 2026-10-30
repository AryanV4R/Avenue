# LinkBio

Setup:

    npm install
    npm run dev

Open http://localhost:3000

Routes:
- /                      landing
- /dashboard             links + social icons (one editor)
- /dashboard/appearance  public page theme
- /dashboard/profile     avatar, name, handle, bio
- /[handle]              public page

Where things live:
- Brand name / domain: lib/config.ts
- Data layer (swap for Supabase/Firebase later): lib/storage.ts
- Dashboard state + autosave: lib/profile-context.tsx
- Server-side SEO lookup stub: lib/server-data.ts
