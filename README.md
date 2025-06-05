# Bookstore



          
This project appears to be a **Bookstore Application**. Based on the file structure and our previous interactions, it seems to have the following key components and functionalities:

*   **Frontend (React/Vite):** Located in the `src` directory, it includes pages for:
    *   `Home.jsx`: Displays books.
    *   `Cart.jsx`: Manages the shopping cart.
    *   `Checkout.jsx`: Handles the checkout process.
    *   `Orders.jsx`: Shows user orders.
    *   `Login.jsx` and `Register.jsx`: For user authentication.
    *   `AdminDashboard.jsx`: An administrative interface, likely for managing books and orders.
    *   `Navbar.jsx`: A common navigation component.
    *   Contexts (`AuthContext.jsx`, `CartContext.jsx`, `ThemeContext.jsx`): For state management across the application.
    *   `locationData.js`: Contains data for countries, states, and districts, used in forms like registration.

*   **Backend (Node.js/Express):** Located in the `server` directory, it includes:
    *   `index.js`: The main server entry point.
    *   `models` (`Book.js`, `Order.js`, `User.js`): Defines the Mongoose schemas for data storage.
    *   `routes` (`auth.js`, `books.js`, `orders.js`): Handles API endpoints for authentication, book management, and order processing.

In essence, it's a full-stack application designed for users to browse and purchase books, with administrative capabilities for managing the book catalog and orders.
        ****
