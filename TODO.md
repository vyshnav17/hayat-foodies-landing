# Dynamic Website Enhancements

- [x] Add Social Media Integration: Display Instagram feed in Footer
- [x] Add Loading Animations: Implement skeleton loaders for images
- [x] Include Contact Form with Validation: Replace static contact info with interactive form

# Product Popup Implementation

- [x] Expand products array with additional fields: images (array), ingredients, calories, price, gst
- [x] Import Dialog and Carousel components in Products.tsx
- [x] Add state for selectedProduct and dialog open
- [x] Make product cards clickable by wrapping in DialogTrigger
- [x] Create DialogContent with grid layout: left side carousel of images, right side product details
- [x] Display description, ingredients, calories, and final price (price + gst) in the right side
- [x] Test the popup functionality

# Admin Panel Query Management

- [x] Add resolved status to ContactSubmission interface
- [x] Separate submissions into active and resolved arrays
- [x] Create tabbed interface for Active and Resolved queries
- [x] Add resolve button (green checkmark) to active submissions
- [x] Move resolved submissions to resolved tab with green styling
- [x] Keep resolved submissions in localStorage for customer database
- [x] Update CSV export to include status and resolved timestamp
- [x] Allow deletion of resolved queries while maintaining customer data
