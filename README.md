# ESOL Teacher Resources

A free, open-source collection of ESOL teaching materials, activities, worksheets, and resources for English language educators.

## Site Structure

```
esol-teacher-resources/
├── index.html                 # Main landing page
├── activities/                 # All teaching activities organized by category
│   ├── grammar/               # Grammar activities (tenses, conditionals, etc.)
│   │   ├── tenses/
│   │   ├── present-perfect/
│   │   ├── relative-pronouns/
│   │   ├── sentence-builders/
│   │   ├── conditionals/
│   │   └── games/
│   ├── writing-reading/       # Writing and reading activities
│   ├── speaking/              # Speaking activities and conversation exercises
│   ├── vocab/                 # Vocabulary activities and word lists
│   └── unit-tests/            # Assessment materials and tests
├── assets/
│   ├── css/
│   │   └── main.css          # Shared design system and styles
│   └── js/
│       └── main.js           # Navigation and filtering functionality
└── README.md                  # This file
```

## Categories

The site is organized into 5 main categories:

1. **GRAMMAR** - Tenses, conditionals, modals, sentence structure, and other grammar topics
2. **WRITING/READING** - Writing exercises, reading comprehension, literacy activities
3. **SPEAKING** - Conversation activities, discussion topics, speaking practice
4. **VOCAB** - Vocabulary exercises, word lists, language building activities
5. **UNIT TESTS** - Assessment materials, unit tests, test preparation resources

## Adding New Activities

### Step 1: Choose the Right Category

Place your activity in the appropriate category folder:
- Grammar activities → `activities/grammar/` (with subfolders for specific topics)
- Writing/Reading → `activities/writing-reading/`
- Speaking → `activities/speaking/`
- Vocabulary → `activities/vocab/`
- Tests → `activities/unit-tests/`

### Step 2: Create Your Activity File

1. **File Naming**: Use kebab-case (lowercase with hyphens)
   - ✅ `present-perfect-guide.html`
   - ❌ `Present Perfect Guide.html` or `present_perfect_guide.html`

2. **HTML Structure**: Include standard metadata in the `<head>`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Activity Title - ESOL Teacher Resources</title>
     <meta name="description" content="Brief description of the activity">
     <link rel="stylesheet" href="../../assets/css/main.css">
   </head>
   ```

3. **For Slide Presentations**: Use `SLIDE_TEMPLATE.html` as a starting point. Slides are full-screen presentations perfect for classroom use. See the [Slides section](#slides) below for details.

4. **Page Header**: Include navigation and breadcrumbs:
   ```html
   <header class="site-header">
     <div class="container">
       <div class="header-content">
         <a href="../../index.html" class="site-logo">ESOL Teacher Resources</a>
         <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
         <nav class="nav">
           <!-- Navigation items -->
         </nav>
       </div>
     </div>
   </header>
   
   <main>
     <div class="breadcrumbs">
       <a href="../../index.html">Home</a>
       <span class="breadcrumbs-separator">/</span>
       <a href="../index.html">Category</a>
       <span class="breadcrumbs-separator">/</span>
       <span>Activity Name</span>
     </div>
     <!-- Your activity content -->
   </main>
   ```

### Step 3: Add Activity to Category Index

Update the category's `index.html` file to include your new activity:

```html
<a href="your-activity.html" class="activity-card" data-type="worksheet" data-level="intermediate">
  <div class="activity-card-header">
    <h3 class="activity-card-title">Your Activity Title</h3>
    <span class="activity-badge badge-worksheet">Worksheet</span>
  </div>
  <p class="activity-card-description">Brief description of what the activity covers.</p>
  <div class="activity-card-meta">
    <span>Intermediate</span>
  </div>
</a>
```

**Activity Types:**
- `worksheet` → Badge: `badge-worksheet`
- `game` → Badge: `badge-game`
- `guide` → Badge: `badge-guide`
- `quiz` → Badge: `badge-quiz`
- `slides` → Badge: `badge-slides`

**Levels:**
- `beginner`
- `intermediate`
- `advanced`

**Data Attributes:**
- `data-type` - Activity type (worksheet, game, guide, quiz, slides)
- `data-level` - Difficulty level (beginner, intermediate, advanced)

### Step 4: Styling

- Use the shared CSS design system (`assets/css/main.css`)
- CSS variables are available for colors, spacing, typography
- Activities should be print-friendly (print styles are included)
- Ensure mobile responsiveness (the design system handles this)

## Design System

The site uses a consistent design system with CSS variables:

- **Colors**: Primary blue (`--color-primary`), text colors, backgrounds
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standard spacing scale (`--spacing-xs` through `--spacing-3xl`)
- **Components**: Pre-built card, button, and form components

See `assets/css/main.css` for the complete design system.

## Features

- **Clean Navigation**: Simple, intuitive category-based navigation
- **Filtering**: Filter activities by type and level
- **Search**: Search activities by keyword
- **Mobile Responsive**: Works great on all devices
- **Print Friendly**: Activities can be printed for offline use
- **Slide Presentations**: Full-screen slide presentations for classroom use
- **Consistent Design**: All activities follow the same design system

## Slides

Slide presentations are perfect for classroom teaching. They provide a full-screen presentation mode with keyboard navigation, progress tracking, and interactive elements.

### Creating Slides

1. **Use the Template**: Start with `SLIDE_TEMPLATE.html` as your base
2. **Slide Structure**: Each slide is a `<section class="slide">` element
3. **Slide Types**: Use different slide classes for variety:
   - `slide-title` - Title slide
   - `slide-objectives` - Learning objectives
   - `slide-content` - Regular content
   - `slide-example` - Examples
   - `slide-formula` - Grammar structures
   - `slide-practice` - Practice exercises
   - `slide-warning` - Common mistakes
   - `slide-activity` - Class activities
   - `slide-summary` - Summary slide
   - `slide-closing` - Closing slide

### Slide Navigation

- **Keyboard Shortcuts**:
  - `→` or `Space` - Next slide
  - `←` - Previous slide
  - `Home` - First slide
  - `End` - Last slide
  - `Esc` - Exit presentation
  - `F` - Toggle fullscreen
  - `?` - Show keyboard shortcuts

- **Touch/Swipe**: Swipe left/right on mobile devices
- **Controls**: On-screen navigation buttons at the bottom

### Linking Slides from Activities

Add a link to slides from your activity pages:

```html
<div class="activity-actions" style="margin-top: var(--spacing-xl);">
  <a href="activity-slides.html" class="btn btn-primary">
    <i data-lucide="presentation" class="icon"></i>
    View Slides
  </a>
</div>
```

### Slide Features

- **Progress Bar**: Shows presentation progress at the top
- **Slide Counter**: Displays current slide number
- **Answer Keys**: Toggle-able answer keys for practice exercises
- **Teacher Notes**: Optional notes visible only to teachers
- **Fullscreen Mode**: Full-screen presentation for projectors
- **Print Support**: Print slides for handouts

## Contributing

1. Follow the file naming conventions (kebab-case)
2. Use the shared CSS design system
3. Include proper metadata and descriptions
4. Test on mobile devices
5. Ensure print styles work correctly

## License

Free for educational use. Created by teachers, for teachers.

## Questions?

If you have questions about adding activities or using the site, please refer to this README or check existing activities as examples.

