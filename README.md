# CycleLimited — E-Commerce Website

A modern, responsive client-side E-Commerce web application built for browsing, filtering, and purchasing bicycles and cycling gear.
Features include user authentication, dynamic product catalog loading, multi-criteria filtering, local storage state management, and a interactive cart and checkout pipeline. Built using pure HTML5, CSS3, and modern Vanilla JavaScript (ES6+).


## Key Features

### User Capabilities
- Authentication System: User registration & login with session state persisted directly in localStorage (currentUser).
- Product Catalog: Asynchronously fetches product data from products.json using JavaScript fetch() API.
- Advanced Multi-Filtering & Sorting: Filter products dynamically by Category, Brand, Size, and Price Range (Min/Max inputs). Sort by Price (Low to High, High to Low) or Newest additions.
- Pagination & Search: Smooth client-side pagination (8 items per page) with auto-scroll to top and query parameter support (?category=, ?brand=, ?size=).
- Product Detail Navigation: Clickable product cards routing to dedicated view pages (product.html?id=X).
- Interactive Cart Drawer: Slide-out drawer displaying item images, product categories, quantities, and price calculations.
- User-Isolated Local Storage Cart: Item quantities, subtotals, and list states persist per user account key (carts[userIdentifier]).
- Checkout & Order Flow: Form validation for user address/payment on checkout.html, automatic cart clearing upon order submission, and confirmation feedback.

## Tech Stack
- Frontend Structure: HTML5 
- Styling & Layout: CSS3 (Flexbox, CSS Grid, Custom Variables, Responsive Media Queries)
- Icons & Typography: FontAwesome 6, Google Fonts (Plus Jakarta Sans & Inter)
- Client-Side Logic: Vanilla JavaScript ES6+ (DOM Manipulation, Event Delegation, Async/Await Fetch API, Array Methods .filter(), .sort(), .map())
- Data & Persistence: JSON (products.json), Browser localStorage API
  
```text
CycleLimited/
├── index.html              # Main storefront catalog & filter layout
├── product.html            # Dynamic single product view page
├── checkout.html           # Order placement & form validation page
├── login.html              # Authentication & registration view
├── products.json           # Mock backend product database
├── css/
│   └── style.css           # Global styles, variables, typography & layout grid
└── js/
    ├── app.js              # Catalog loader, dynamic filter engine, & pagination
    └── cart.js             # Cart state manager, DOM updates & LocalStorage sync

```
## Getting Started

### Prerequisites
Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
A local web server extension (such as VS Code Live Server) to support fetch() API calls to products.json.


### Installation & Setup
1. Clone the repository: git clone https://github.com/sranjit123/CycleLimited-Ecommerce-Website.git
2. Navigate into the project directory:cd cyclelimited-ecommerce
3. Run the Project:
4. Open the project folder in VS Code.
Right-click index.html and click Open with Live Server (or serve the folder using any HTTP server).
Open http://127.0.0.1:5500 in your web browser.

## Future Enhancements
- Integration with a Node.js / Express backend server.
- Database persistence using MongoDB / Mongoose.
- Integration of online payment gateways (Stripe / PayPal API).
