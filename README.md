## Baemingo – Menu Builder + Order Screen

This is a small example of an app which acts like a POS for this specific assignment.

### How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

### Overview of approach / architecture

- **Stack**: Next.js App Router, React, TypeScript, Tailwind, shadcn/ui + Radix UI for components.

- **Data model**:
  - `MenuItem`: stored in `localStorage` (key `baemingo-menu`) via helpers in `lib/menu-storage.ts`.
  - `OrderLine`: current order lines stored in `localStorage` (key `baemingo-order`) via `lib/order-storage.ts`.
    This replicates two different tables in a database.

- **Menu Builder (`/menu-builder`)**:
  - CRUD for menu items with validation via Zod (`components/menu-builder/schema.ts`).
  - Split components into seperate files and folder for easier maintainance and readability.
  - Categories are selected from a dropdown (derived from existing items) with an “Add category” action.

- **Order Screen (`/order`)**:
  - Reads the same `MenuItem`s from `localStorage`.
  - Left side: category filter + grid of items (uses `OrderMenu` and `OrderItemCard` components).
  - Right side: order summary (`OrderSummary`) showing line items, quantity controls, total, and actions.
  - Open-price items (`price = 0`) prompt for a price using `OpenPriceDialog` before adding.

### Assumptions made

- Currency is **SEK**:
  - Display uses Swedish locale formatting (`sv-SE`) in both builder and order screen.
- (`Category`) for menu builder is a dropdown for existing categories. For adding new categories there's a seperate field.
- (`Clear Order` button for deleting the current cart, instead of deleting each item individually).
- An open price item which is a duplicate is not shown as a seperate item but added to the former one.

### What I’d improve with more time

Since this is supposed to be a small app I've tried not to over engineer it.
I kept the architecture intentionally simple. Part of being a good developer is paying attention to the task instructions / demands and knowing when to keep things simple.

Some things to improve:

- Add tests
- Have a proper backend with database instead of local storage, maybe something like Supabase.
- Adding a login page for users with auth setup.
- React Hook Form for handling forms depending on the complexity.
- Add order history for keeping track of orders made.
- Keep track of the status of orders (delivered, in progress, cancelled etc.)

- Improve UX:
  - Replace `alert` with a confirmation modal or page.
  - Give user feedback when adding / confirming orders with proper toasts and dialogs
  - Have a button for adding new categories instead of input. Preventing the user to accidentally type a new category.
