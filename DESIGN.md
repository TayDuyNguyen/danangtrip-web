# Design System Inspired by Airbnb

## 1. Visual Theme & Atmosphere

Airbnb's design system embodies a warm, approachable, and globally inclusive aesthetic that celebrates travel, belonging, and discovery. The visual language combines a bold, energetic primary color palette with clean, neutral typography and generous whitespace to create an inviting, trustworthy interface. The system emphasizes clarity and accessibility across diverse global markets while maintaining a playful, human-centered personality. Card-based layouts, intuitive navigation, and subtle interactive states encourage exploration and engagement without overwhelming users.

**Key Characteristics**
- Warm, vibrant energy balanced with refined restraint
- Global and inclusive visual language
- Trust-building through clarity and consistency
- Playful, human-centered interaction patterns
- Card-based information architecture
- Clean typography paired with bold accent colors
- Emphasis on imagery and storytelling
- Accessible and universally understandable design

## 2. Color Palette & Roles

### Primary
- **Airbnb Red** (`#FF385C`): Primary brand color used for CTAs, highlights, and interactive elements; creates immediate visual impact and drives user action
- **Airbnb Red Hover** (`#E31C5F`): Darker red for hover states and emphasis on interactive elements

### Accent Colors
- **Deep Magenta** (`#D70466`): Secondary brand accent for depth and visual hierarchy variation
- **Dark Berry** (`#BD1E59`): Tertiary accent for darker contextual uses and secondary CTAs
- **Deep Purple** (`#460479`): Rich accent for brand personality and design variation
- **Dark Purple** (`#6C0D63`): Deep purple for specialized accent contexts
- **Deep Maroon** (`#92174D`): Warm dark accent for visual depth

### Interactive
- **Search Action** (`#FF385C`): Primary interactive element color for search buttons and main CTAs
- **Interactive Hover** (`#E31C5F`): Darkened state for button interactions

### Neutral Scale
- **Text Primary** (`#222222`): Main text color for body copy and UI labels; ensures readability and hierarchy
- **Text Secondary** (`#6A6A6A`): Secondary text for supporting information and reduced emphasis
- **Text Tertiary** (`#C1C1C1`): Tertiary text for disabled states and minimal emphasis
- **White** (`#FFFFFF`): Pure white for backgrounds and inverse text
- **Black** (`#000000`): Pure black for maximum contrast and critical text

### Surface & Borders
- **Light Surface** (`#F7F7F7`): Subtle background for secondary surfaces and gentle visual separation
- **Very Light Surface** (`#EBEBEB`): Lightest background for tertiary surfaces
- **Light Border** (`#DDDDDD`): Border color for defined separation between sections
- **Mid Border** (`#C1C1C1`): Medium-weight border for input fields and cards
- **Light Gray** (`#FFFFFF`): Surface background for primary content areas

### Semantic / Status
- **Error Primary** (`#C13515`): Primary error state indicator
- **Error Secondary** (`#E61E4D`): Secondary error state for emphasis
- **Error Tertiary** (`#E00B41`): Alternative error state
- **Warning** (`#E74D2E`): Warning and caution states for alerts

## 3. Typography Rules

### Font Family
- **Primary Font**: Airbnb Cereal VF (variable font with comprehensive weight support)
- **Fallback Stack**: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica Neue, Arial, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display | Airbnb Cereal VF | 28px | 700 | 40px | 0px | Large hero headlines and main page titles |
| Heading 1 | Airbnb Cereal VF | 24px | 600 | 32px | 0px | Section headings and prominent titles |
| Heading 2 | Airbnb Cereal VF | 20px | 600 | 28px | 0px | Subsection titles and card headings |
| Heading 3 | Airbnb Cereal VF | 16px | 500 | 22px | 0px | Secondary titles and labels |
| Body | Airbnb Cereal VF | 14px | 400 | 20px | 0px | Standard body text and descriptions |
| Body Small | Airbnb Cereal VF | 12px | 400 | 18px | 0px | Supporting copy and secondary information |
| Button | Airbnb Cereal VF | 14px | 500 | 18px | 0px | Interactive button labels |
| Link | Airbnb Cereal VF | 14px | 400 | 20px | 0px | Inline and standalone links |
| Caption | Airbnb Cereal VF | 12px | 400 | 16px | 0px | Captions, footnotes, and metadata |
| Code | Monospace | 12px | 400 | 18px | 0px | Code snippets and technical text |

### Principles
- Single typeface for cohesive brand identity; weight and size variations drive hierarchy
- Line height scales with size; larger text receives more breathing room
- Generous line heights (1.4–1.5x) enhance readability, especially on mobile
- Weight hierarchy: 400 for body, 500 for labels, 600–700 for headings
- Letter spacing kept tight (0px) to maintain compactness and modern feel
- All text must meet WCAG AA contrast minimums against background colors

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background**: `#FF385C`
- **Text Color**: `#FFFFFF`
- **Padding**: `12px 24px`
- **Border Radius**: `20px`
- **Border**: `none`
- **Font Size**: `14px`
- **Font Weight**: `500`
- **Height**: `48px`
- **Box Shadow**: `none`
- **Hover State**: Background `#E31C5F`, text `#FFFFFF`
- **Active State**: Background `#D70466`, text `#FFFFFF`
- **Disabled State**: Background `#DDDDDD`, text `#C1C1C1`

#### Secondary Button
- **Background**: `#FFFFFF`
- **Text Color**: `#222222`
- **Padding**: `11px 12px`
- **Border Radius**: `20px`
- **Border**: `1px solid #DDDDDD`
- **Font Size**: `14px`
- **Font Weight**: `500`
- **Height**: `40px`
- **Box Shadow**: `none`
- **Hover State**: Background `#F7F7F7`, text `#222222`, border `#C1C1C1`
- **Active State**: Background `#EBEBEB`, text `#222222`
- **Disabled State**: Background `#EBEBEB`, text `#C1C1C1`

#### Ghost Button (Icon)
- **Background**: `#F2F2F2`
- **Text Color**: `#222222`
- **Padding**: `0px`
- **Border Radius**: `50%`
- **Border**: `none`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Height**: `40px`
- **Width**: `40px`
- **Box Shadow**: `none`
- **Hover State**: Background `#EBEBEB`, text `#222222`
- **Active State**: Background `#DDDDDD`
- **Disabled State**: Background `#F2F2F2`, text `#C1C1C1`

#### Small Icon Button
- **Background**: `#F2F2F2`
- **Text Color**: `#C1C1C1`
- **Padding**: `0px`
- **Border Radius**: `50%`
- **Border**: `none`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Height**: `28px`
- **Width**: `28px`
- **Box Shadow**: `none`
- **Hover State**: Background `#EBEBEB`, text `#6A6A6A`
- **Active State**: Background `#DDDDDD`, text `#222222`

#### Search Button (Circular Primary)
- **Background**: `#FF385C`
- **Text Color**: `#FFFFFF`
- **Padding**: `0px`
- **Border Radius**: `50%`
- **Border**: `none`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Height**: `48px`
- **Width**: `48px`
- **Box Shadow**: `none`
- **Hover State**: Background `#E31C5F`
- **Active State**: Background `#D70466`

### Cards & Containers

#### Listing Card
- **Background**: `#FFFFFF`
- **Border**: `1px solid #DDDDDD`
- **Border Radius**: `12px`
- **Padding**: `0px` (image overflow hidden)
- **Box Shadow**: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- **Hover State**: Box Shadow `0px 8px 16px rgba(0, 0, 0, 0.12)`, transform `translateY(-4px)`
- **Image Container**: Border Radius `12px` top only, overflow `hidden`
- **Favorite Button**: Position `absolute` top-right, z-index `10`

#### Modal
- **Background**: `#FFFFFF`
- **Border Radius**: `20px`
- **Padding**: `44px 48px`
- **Box Shadow**: `0px 16px 48px rgba(0, 0, 0, 0.2)`
- **Close Button**: Position `absolute` top-right `16px`, background `transparent`, border `none`
- **Overlay**: Background `rgba(0, 0, 0, 0.5)`, z-index `1000`

#### Search Container
- **Background**: `#FFFFFF`
- **Border Radius**: `32px`
- **Padding**: `8px 8px`
- **Box Shadow**: `0px 4px 16px rgba(0, 0, 0, 0.12)`
- **Display**: `flex`, gap `12px`
- **Responsive**: Stacks vertically on mobile, horizontal on desktop

### Inputs & Forms

#### Text Input
- **Background**: `#FFFFFF`
- **Border**: `1px solid #DDDDDD`
- **Border Radius**: `12px`
- **Padding**: `12px 16px`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Text Color**: `#222222`
- **Placeholder Color**: `#6A6A6A`
- **Height**: `48px`
- **Line Height**: `20px`
- **Focus State**: Border `2px solid #FF385C`, padding adjusted `11px 15px` to maintain size
- **Error State**: Border `2px solid #C13515`, background `#FFF5F6`
- **Disabled State**: Background `#F7F7F7`, text `#C1C1C1`, border `#DDDDDD`, cursor `not-allowed`

#### Search Input
- **Background**: `rgba(0, 0, 0, 0.05)`
- **Border**: `none`
- **Border Radius**: `12px`
- **Padding**: `12px 16px`
- **Font Size**: `14px`
- **Font Weight**: `500`
- **Text Color**: `#222222`
- **Placeholder Color**: `#6A6A6A`
- **Height**: `48px`
- **Line Height**: `18px`
- **Focus State**: Background `#FFFFFF`, outline `2px solid #FF385C`

#### Dropdown/Select
- **Background**: `#FFFFFF`
- **Border**: `1px solid #DDDDDD`
- **Border Radius**: `12px`
- **Padding**: `12px 16px`
- **Font Size**: `14px`
- **Height**: `48px`
- **Focus State**: Border `2px solid #FF385C`
- **Hover State**: Border `1px solid #C1C1C1`

### Navigation

#### Header Navigation
- **Background**: `#FFFFFF`
- **Height**: `80px`
- **Display**: `flex`, align-items `center`, justify-content `space-between`
- **Padding**: `0px 48px`
- **Text Color**: `#222222`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Box Shadow**: `0px 1px 3px rgba(0, 0, 0, 0.08)` on scroll

#### Navigation Link
- **Color**: `#222222`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Padding**: `8px 12px`
- **Line Height**: `20px`
- **Hover State**: Color `#FF385C`, text-decoration `none`
- **Active State**: Color `#FF385C`, border-bottom `2px solid #FF385C`

#### Active Tab / Featured Link
- **Color**: `#FF385C`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Padding**: `8px 12px`
- **Line Height**: `20px`
- **Border Bottom**: `2px solid #FF385C`

### Badges & Labels

#### Badge
- **Background**: `#F7F7F7`
- **Text Color**: `#222222`
- **Padding**: `6px 12px`
- **Border Radius**: `12px`
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Height**: `28px`
- **Display**: `inline-flex`, align-items `center`

#### Badge - New
- **Background**: `#FFE5E5`
- **Text Color**: `#FF385C`
- **Padding**: `6px 12px`
- **Border Radius**: `12px`
- **Font Size**: `12px`
- **Font Weight**: `600`

#### Badge - Rating
- **Background**: `#FFFFFF`
- **Text Color**: `#222222`
- **Padding**: `4px 8px`
- **Border Radius**: `8px`
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Border**: `1px solid #DDDDDD`

### Tabs

#### Tab (Inactive)
- **Background**: `transparent`
- **Text Color**: `#6A6A6A`
- **Border Bottom**: `2px solid transparent`
- **Padding**: `16px 24px`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Cursor**: `pointer`
- **Hover State**: Text Color `#222222`, border-bottom `2px solid #DDDDDD`

#### Tab (Active)
- **Background**: `transparent`
- **Text Color**: `#222222`
- **Border Bottom**: `2px solid #222222`
- **Padding**: `16px 24px`
- **Font Size**: `14px`
- **Font Weight**: `500`

### Links

#### Text Link
- **Color**: `#FF385C`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Text Decoration**: `none`
- **Line Height**: `20px`
- **Hover State**: Text Decoration `underline`
- **Visited State**: Color `#92174D`

#### Secondary Link
- **Color**: `#222222`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Text Decoration**: `none`
- **Padding**: `0px 5px`
- **Height**: `36px`
- **Line Height**: `20px`
- **Hover State**: Text Decoration `underline`, color `#FF385C`

## 5. Layout Principles

### Spacing System

- **Base Unit**: `4px`
- **Spacing Scale**: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `36px`, `44px`, `48px`, `52px`, `132px`

**Usage Context**:
- `4px`: Micro-spacing between text and icons
- `8px`: Tight spacing in compact components
- `12px`: Gaps between small elements, chip padding
- `16px`: Standard padding for inputs and cards
- `24px`: Section margins, spacing between related content
- `32px`: Page section padding, major component spacing
- `36px`: Carousel and grid gaps
- `44px`: Large component padding (modals, containers)
- `48px`: Page horizontal padding, major spacing
- `52px`: Section top/bottom margins
- `132px`: Large hero and section spacing

### Grid & Container

- **Max Width**: `1344px` (content width on desktop)
- **Horizontal Padding**: `48px` on desktop, `24px` on tablet, `16px` on mobile
- **Column Strategy**: 12-column flexible grid for content alignment
- **Gutter Width**: `24px` between columns
- **Section Patterns**: Full-width background sections with centered max-width containers
- **Card Grids**: 4 columns on desktop, 2 on tablet, 1 on mobile with `36px` gap

### Whitespace Philosophy

Airbnb's design emphasizes breathing room and visual clarity. Generous whitespace separates content sections, improves scannability, and creates a premium feel. Cards and containers use uniform padding (`16px` to `48px`) to establish consistent visual rhythm. Vertical spacing between sections increases (`24px` to `52px`) to create visual hierarchy and allow users to process information in digestible chunks. Images and text content are given ample surrounding space to prevent cognitive overload.

### Border Radius Scale

- `4px`: Subtle corner rounding for small UI elements (tiny buttons, small badges)
- `8px`: Minor component corners (small input fields, minor cards)
- `12px`: Standard component corners (cards, input fields, moderate buttons)
- `16px`: Prominent component corners (larger cards, modals)
- `20px`: Button corners (secondary and pill-shaped buttons)
- `32px`: Search bar and large interactive components
- `50px`: Fully rounded pill buttons (large CTAs)
- `50%`: Perfectly circular elements (icon buttons, avatars)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Surface 0 | `box-shadow: none` | Base background, flat surfaces |
| Elevation 1 | `box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.08)` | Cards at rest, subtle definition |
| Elevation 2 | `box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12)` | Hovered cards, medium depth |
| Elevation 3 | `box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.12)` | Lifted cards, strong emphasis |
| Elevation 4 | `box-shadow: 0px 16px 48px rgba(0, 0, 0, 0.20)` | Modals and popovers, maximum prominence |

**Shadow Philosophy**:
Airbnb uses soft, subtle shadows that increase gradually with component elevation. Shadows are primarily composed of darker transparent blacks with opacity varying from 8% (subtle) to 20% (prominent). This creates a sense of layering without harshness. Shadows scale with interaction importance—cards at rest receive minimal shadow, while modals and expanded menus receive maximum depth. The subtle shadow approach maintains a modern, clean aesthetic while preserving visual hierarchy.

## 7. Do's and Don'ts

### Do
- Use `#FF385C` for primary CTAs, search actions, and interactive highlights
- Maintain consistent `48px` horizontal page padding on desktop for visual balance
- Apply generous whitespace (`24px–52px`) between major content sections
- Use weight (`500–700`) hierarchy to establish clear reading order without excessive color change
- Pair accent colors with neutral grays (`#222222`, `#6A6A6A`) for optimal contrast and readability
- Employ subtle shadows (`0px 1px 3px` to `0px 8px 16px`) to create depth without distraction
- Scale card padding consistently (`16px` minimum, `24px` standard, `44px` for containers)
- Use border radius (`12px–20px`) for approachable, friendly UI components
- Center align long-form content and search experiences for user focus
- Test all text against WCAG AA contrast requirements at minimum
- Implement hover states consistently across all interactive elements
- Use variable weights of Airbnb Cereal VF for typographic hierarchy

### Don't
- Overuse the red accent color (`#FF385C`); reserve it for primary actions and top-level navigation
- Apply shadows heavier than `0px 16px 48px rgba(0, 0, 0, 0.20)` to avoid darkening UI
- Use text smaller than `12px` for body copy to maintain readability standards
- Combine multiple accent colors in proximity; alternate accent with neutrals
- Create components with inconsistent padding or spacing—always use the defined scale
- Nest cards or containers beyond two levels without clear visual separation
- Apply opacity-based text color changes when weight or size can establish hierarchy instead
- Force full-width layouts below `768px` breakpoint without adapting to mobile constraints
- Use more than two font weights in single component for visual clarity
- Create interactive elements smaller than `40px` × `40px` minimum touch target
- Apply border radius greater than `50px` unless intentionally creating pill-shaped buttons
- Use pure black (`#000000`) as a primary background; use whites and light grays instead

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|---|
| Mobile | `0px–480px` | Single column layout, `16px` horizontal padding, `36px` vertical spacing, stacked navigation |
| Tablet | `480px–768px` | Two-column grids, `24px` horizontal padding, `24px` vertical spacing, compact header |
| Desktop | `768px–1024px` | Three-column grids, `32px` horizontal padding, `32px` vertical spacing |
| Wide Desktop | `1024px+` | Four-column grids, `48px` horizontal padding, `48px–52px` vertical spacing, max-width `1344px` |

### Touch Targets

- **Minimum Touch Target**: `40px` × `40px` (icon buttons, navigation items)
- **Standard Button Height**: `48px`
- **Recommended Spacing Between Targets**: `8px` minimum (to prevent accidental taps)
- **Icon Size Within Button**: `24px` centered within `40px–48px` button
- **Link Padding**: `8px` vertical, `12px` horizontal minimum for inline links

### Collapsing Strategy

**Mobile (`0px–480px`)**:
- Navigation collapses to hamburger menu with `40px` × `40px` icon button
- Search bar stacks vertically; date/guest inputs appear in sequence
- Card grids reduce to single column
- Horizontal padding reduces to `16px`
- Modal padding reduces to `24px`
- Button width adjusts to `100%` or appropriate mobile proportion

**Tablet (`480px–768px`)**:
- Navigation remains visible with selective item hiding (Experiences/Services stack into dropdown)
- Search bar maintains horizontal layout with reduced padding
- Card grids display two columns
- Horizontal padding adjusts to `24px`
- Modal maintains centered layout with reduced max-width (`90vw`)

**Desktop (`768px+`)**:
- Full navigation visible with all items
- Search bar maintains full horizontal layout
- Card grids scale to 3–4 columns based on available width
- Horizontal padding stabilizes at `32px–48px`
- Modal positioned center with max-width `800px–1000px`

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Airbnb Red (`#FF385C`) — all primary buttons, search action, main interactive focus
- **Primary CTA Hover**: Airbnb Red Darker (`#E31C5F`) — hover state for primary buttons
- **Primary CTA Active**: Deep Magenta (`#D70466`) — pressed/active state for primary buttons
- **Text Primary**: Text Primary (`#222222`) — body copy, headings, main content
- **Text Secondary**: Text Secondary (`#6A6A6A`) — supporting text, secondary information
- **Text Tertiary**: Text Tertiary (`#C1C1C1`) — disabled states, minimal emphasis
- **Background Surface**: White (`#FFFFFF`) — primary content background
- **Background Subtle**: Light Surface (`#F7F7F7`) — secondary surfaces, subtle separation
- **Border**: Light Border (`#DDDDDD`) — input borders, card borders, light dividers
- **Error State**: Error Primary (`#C13515`) — validation errors, error alerts

### Iteration Guide

1. **Always use Airbnb Cereal VF with weight-based hierarchy** (`400` body, `500` labels, `600–700` headings); do not rely on color alone for emphasis
2. **Primary action color is always `#FF385C`**; reserve darker reds (`#E31C5F`, `#D70466`) for hover/active states
3. **Text hierarchy follows size and weight, never size alone**; pair `14px 400` body with `14px 500` labels or `16px 500` headings
4. **Spacing uses defined scale: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `36px`, `44px`, `48px`, `52px`, `132px`**; do not introduce arbitrary spacing
5. **Card components use `16px` padding minimum, `24px` standard, with `12px` border radius** and subtle shadow `0px 1px 3px rgba(0, 0, 0, 0.08)` at rest
6. **Input fields maintain `48px` height** with `12px 16px` padding, `12px` border radius, and `2px solid #FF385C` focus state
7. **Buttons scale from `28px` (small icon) to `48px` (standard) with consistent `20px` border radius** for secondary, `50px` for pill shapes
8. **Hover states increase shadow depth**: cards `0px 8px 16px`, modals remain at `0px 16px 48px`
9. **Mobile layouts at `0px–480px` use `16px` horizontal padding, single-column cards, stacked search**; tablet `480px–768px` uses `24px` padding, two-column cards; desktop `768px+` uses `48px` padding, three-to-four-column grids
10. **Contrast ratio minimum WCAG AA (`4.5:1` for text)`; pair `#222222` text on `#FFFFFF` background, never light text on light backgrounds**
11. **Modal layouts center with `44px–48px` padding, `20px` border radius, and `0px 16px 48px rgba(0, 0, 0, 0.20)` shadow**; overlay uses `rgba(0, 0, 0, 0.5)` at z-index `1000`
12. **Navigation header maintains `80px` height on desktop**, `64px` on mobile, with `#FFFFFF` background and `1px solid #DDDDDD` bottom border on scroll