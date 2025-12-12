# Project Structure

This document outlines the organization of the ESOL Teacher Resources project.

## Directory Structure

```
ESOL_Teacher_Resources/
├── src/                    # Next.js application source code
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── content/           # Content data (grammar guides, etc.)
│   └── lib/               # Utility functions and libraries
│
├── public/                # Static assets (images, icons, etc.)
│   └── icon-generator.html
│
├── prisma/                # Database schema and related files
│   ├── schema.prisma      # Database schema definition
│   ├── seed.js            # Database seeding script
│   ├── seed.ts            # TypeScript seed file
│   ├── seed-achievements.ts
│   └── backups/           # Database backup files
│
├── scripts/               # Utility scripts
│   ├── db/               # Database management scripts
│   │   ├── backup-database.js
│   │   ├── check-users.js
│   │   ├── create-marlie.js
│   │   ├── delete-student.js
│   │   ├── fix-student-password.js
│   │   └── reset-weekly-points.js
│   ├── import/           # Legacy data import scripts
│   │   ├── convert-grammar-guide.js
│   │   ├── export-sqlite-activities.js
│   │   ├── fix-legacy-imports.mjs
│   │   ├── import-legacy-activity.ts
│   │   ├── import-present-perfect-guide.js
│   │   ├── import-simple-tenses.js
│   │   ├── import-simple-tenses.mjs
│   │   ├── import-simple-tenses.ts
│   │   └── import-simple-tenses-v2.mjs
│   ├── archive/          # Deprecated/old scripts
│   ├── update-all-vocab.js
│   ├── create-vocab-games.js
│   ├── create-numbers-game.js
│   ├── generate-icons.js
│   └── create-png-icons.js
│
├── _legacy/              # Legacy HTML activities (pre-migration)
│   ├── activities/       # Old standalone HTML guides
│   └── imported/         # Imported legacy content
│
├── handouts/             # Student handouts and worksheets
│   ├── student-login-cards.html
│   └── present-perfect-worksheet.html
│
├── docs/                 # Documentation and reference materials
│   └── level-3-vocabulary-list.pdf
│
└── Configuration files
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    └── eslint.config.mjs
```

## Key Directories

### `/src`
Main application code for the Next.js web application. This is where all active development happens.

### `/scripts`
Utility scripts organized by purpose:
- **db/**: Database management and user administration
- **import/**: Legacy content migration and import tools
- **archive/**: Old scripts kept for reference

### `/prisma`
Database-related files:
- Schema definitions
- Seed data
- Backups (in `/backups` subdirectory)

### `/_legacy`
Old standalone HTML files and activities that have been migrated to the database-driven app.

### `/handouts`
Printable worksheets and student materials.

### `/docs`
Reference documentation, curriculum guides, and other teaching resources.

## Scripts Usage

### Database Scripts
```bash
# Backup database
node scripts/db/backup-database.js

# Reset weekly points
node scripts/db/reset-weekly-points.js

# Check users
node scripts/db/check-users.js
```

### Active Game Scripts
```bash
# Update vocabulary games
node scripts/update-all-vocab.js

# Create vocab games
node scripts/create-vocab-games.js

# Create numbers game
node scripts/create-numbers-game.js
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed
```
