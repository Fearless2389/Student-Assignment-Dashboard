# Component Structure & Design Decisions

## 1. Unified "SaaS" Design Language
To ensure the interface feels bright, spacious, and professional:
- **Spacing Scale:** A strict 8px layout grid is enforced across the board (`p-6`, `gap-6`, `mb-12`). This breathes life into data-heavy tables and grids.
- **Micro-Animations:** Driven entirely by `framer-motion`, panels elegantly slide, expand, and fade. `AnimatePresence` allows sub-menus and modals to unmount gracefully, eliminating jarring DOM layout shifts.
- **Flat Depth Elements:** Heavy borders are avoided in favor of the custom `.card` class which utilizes `rounded-2xl` corners combined with ultra-soft, widespread box shadows. 

## 2. View Modularity
- **`StudentDashboard.jsx`**: Focuses on individual accountability. Derived state from Context isolates only the specific individual's assigned modules. Dynamic filters sort views by submission flags.
- **`AdminDashboard.jsx`**: Functions as a control room. Calculates class-wide progress metrics dynamically via the `calculateProgress` utility before cascading data down into individual assignment card nodes.
- **Expandable Rows (`AdminAssignmentCard.jsx`)**: To circumvent visually overwhelming "data tables", each assignment is treated as a card component that recursively drops down to reveal dedicated, responsive internal progress bars for each registered student under that specific project constraint.

## 3. Responsive Foundation
All sub-trees are programmed 'Mobile-First'. By strategically pairing flexbox (`flex-col sm:flex-row`) inside data rows, the application perfectly maintains its structural integrity and readability natively across massive 1440p monitors down to small 375px mobile displays.
