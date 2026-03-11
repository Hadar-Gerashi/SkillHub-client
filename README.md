# SkillHub – Client-Side Course Management Interface

**SkillHub** is a modern, responsive client-side interface built for browsing and purchasing digital courses, managing orders, and handling user authentication. Built with React and a rich tech stack to deliver a fast, smart, and well-organized learning experience.

---

## **Main Features**

### **User Management**
- Registration and login secured with **JWT**
- User authentication data persisted in **LocalStorage**
- Update personal profile details (name, email, password)
- **Role-based access control (RBAC)** - three roles: `USER`, `INSTRUCTOR`, `ADMIN`

### **Instructor Flow**
- Any user can apply to become an instructor via a dedicated **Become an Instructor** page
- Request status is tracked live: `PENDING → APPROVED / REJECTED`
- Instructors can add, edit, and manage their own courses
- Instructors see their own course list with status indicators (pending / approved / rejected)
- After a rejection, instructors can resubmit for re-review

### **Admin Dashboard**
- Dedicated `/admin` page with two management tabs:
  - **Pending Instructors** - approve or reject instructor requests
  - **Pending Courses** - approve or reject new courses and pending edits
- Badge counters showing number of items awaiting review

### **Course Management**
- Display of all available courses with images and full details
- Filtering by **category** and **search by name**
- **Pagination** for course browsing
- Dedicated course details page
- **Add / Edit course** via a multi-step form (3 steps)
- Course images uploaded securely to Cloudinary via backend

### **AI Course Enhancement**
- When adding a course, instructors can type the course name and hit **"Enhance with AI"**
- The AI (Groq / LLaMA 3.3) auto-generates:
  - ✓ Detailed course description
  - ✓ Short motivational tagline
  - ✓ Recommended number of sessions
  - ✓ Relevant categories
  - ✓ Suggested price in NIS + pricing rationale

### **Smart Recommendations**
- Logged-in users see **personalized course recommendations** on the home page
- Powered by a hybrid algorithm: Collaborative Filtering + Category Affinity + Popularity Boost

### **External Course Search (Udemy)**
- Users can search for courses from **Udemy** directly within the platform
- Results are fetched via Google Search API (SerpAPI) and displayed alongside internal courses
- Each result shows title, description, link, and thumbnail

### **Location Autocomplete**
- Course location fields use **Nominatim (OpenStreetMap)** for address autocomplete
- Restricted to Israeli addresses, returns road + city + country

### **Order / Cart Management**
- Add and remove courses from the shopping **cart**
- Select/deselect items with checkboxes - total updates live
- Adjust quantity per course
- Checkout flow with order summary
- View order history
- Cart state persisted in **LocalStorage** via Redux

---

## **Technologies**

| Category | Technologies |
|---|---|
| **Frontend Core** | React, Axios |
| **State Management** | Redux Toolkit |
| **Form Handling** | React Hook Form |
| **Styling** | CSS, Tailwind CSS, Styled Components, Framer Motion |
| **UI Components** | Chakra UI, Flowbite React, MUI, shadcn/ui |
| **Authentication** | JWT (managed by backend) |
| **Storage** | LocalStorage |
| **AI Integration** | Groq / LLaMA 3.3 (via backend) |
| **External Search** | SerpAPI / Google (via backend) |
| **Location** | Nominatim (OpenStreetMap) |
| **Build Tool** | Vite |

---

## **Project Structure**

```
skillhub-client/
├── public/                    # Static assets (images, favicon)
├── src/
│   ├── api/                   # Axios service calls
│   │   ├── aiService.js           # AI course enhancement
│   │   ├── courseService.js       # Course CRUD + approval
│   │   ├── externalService.js     # Udemy search (SerpAPI)
│   │   ├── locationService.js     # Address autocomplete (Nominatim)
│   │   ├── ordersService.js       # Orders
│   │   ├── recommendedService.js  # Personalized recommendations
│   │   └── userService.js         # Auth + instructor requests
│   ├── app/
│   │   └── store.js               # Redux store (cart + user slices)
│   ├── component/             # Reusable UI components
│   │   ├── cart/                  # Cart drawer, course in cart
│   │   ├── common/                # Loading, Avatar, ClampedText, LocationsList, etc.
│   │   ├── course/                # Course card, carousel, external course card
│   │   ├── instructor/            # CourseManagementCard (shared by instructor + admin)
│   │   ├── layout/                # NavBar, Footer
│   │   └── order/                 # Order display components
│   ├── components/ui/         # shadcn/ui + Chakra UI base components
│   ├── features/              # Redux slices
│   │   ├── cartSlice.js
│   │   └── userSlice.js
│   ├── pages/                 # Page-level components
│   │   ├── auth/                  # Login, SignUp
│   │   ├── cart/                  # Cart, Checkout, EmptyCart
│   │   ├── courses/               # CoursesList, CourseDetails
│   │   │   └── addCourseForm/     # Multi-step add/edit form (Step1–3)
│   │   ├── home/                  # HomePage (recommendations + hero)
│   │   ├── instructor/            # AdminDashboard, BecomeInstructor, InstructorCourses
│   │   └── orders/                # MyOrders
│   └── utils/                 # Helper functions (course utils, session utils)
├── .env                       # Environment variables
├── index.html
├── package.json
└── vite.config.js
```

---

## **Pages & Routes**

| Route | Page | Access |
|---|---|---|
| `/` | Courses list | Public |
| `/details/:id` | Course details | Public |
| `/home` | Home page + recommendations | Public |
| `/login` | Login | Public |
| `/signUp` | Register | Public |
| `/cart` | Shopping cart | Public |
| `/checkout` | Checkout | Logged in |
| `/myOrders` | My orders | Logged in |
| `/orders` | All orders | Logged in |
| `/add` | Add course | Instructor / Admin |
| `/edit/:id` | Edit course | Instructor / Admin |
| `/my-courses` | Instructor's courses | Instructor |
| `/become-instructor` | Request instructor role | Logged in |
| `/admin` | Admin dashboard | Admin only |

---

## **Environment Configuration**

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

```
VITE_API_URL=http://localhost:8000
VITE_CLOUDINARY_URL=http://localhost:8000/api/upload
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

> **Security note:** Never store Cloudinary API keys in the client. The `VITE_CLOUDINARY_URL` points to a backend endpoint that handles the upload securely.

---

## **Installation & Running**

### Prerequisites
- Node.js 18+
- Backend server running at `http://localhost:8000`

### Install
```bash
git clone https://github.com/Hadar-Gerashi/SkillHub-client.git
cd skillhub-client
npm install
```

### Run in Development
```bash
npm run dev
```

Available at: [http://localhost:5173](http://localhost:5173)

---

## **Author**

**Hadar** - Software Engineering Student  
Developed as part of final studies project

## **Support**

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainer.

**Happy Learning!**