# TaskBuddy ([Demo Here](https://taskbuddy.natdanai.tech/))

A learning project as marketplace platform connecting users (Customers) with local service providers (e.g., cleaners, tutors, handymen).


## Core Features 

### Authentication
- Signup/Login with email/password
- JWT-based session
- Password hashing (bcrypt)

### 2. Service Listings
- Create/dit/delete services
- Fields: title, category, description, price, location, image(s)
- List & search services
- Filter by category, location

### 3. Booking System
- Customer books a service
- Booking request visible in provider dashboard
- Status: Pending → Accepted/Declined
- Calendar picker and scheduling time

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router DOM (routing)
- Shadcn (UI components)
- Tailwind CSS (styling)
- Axios (API calls)

**Backend**
- Node.js (Express)
- MySQL (database)
- JWT for authentication
- Multer (for image upload handling)

---

## Deployment
- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Homelab server (Dockerized)
  - Run Node.js + MySQL containers
  - Use Cloudflare Tunnel for secure public access

---
## License
This project is for educational and demonstration purposes only.

---