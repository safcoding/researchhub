# ResearchHub - University Research Management Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Manual](#user-manual)
- [Available Scripts](#available-scripts)
- [Project Features](#project-features)
- [API Endpoints](#api-endpoints)
- [File Structure Explained](#file-structure-explained)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

ResearchHub is a comprehensive web-based platform designed for university research management. Built specifically for UTM (Universiti Teknologi Malaysia) MJIIT, it provides a centralized system for managing research grants, publications, laboratory information, announcements, and research achievements.

The platform serves as a digital hub where researchers, faculty members, and administrators can collaborate, track research progress, manage grants, and showcase research outputs.

## ✨ Features

### Core Features
- **Research Grant Management**: Track funding, applications, and grant status
- **Publication Management**: Organize and showcase research publications
- **Laboratory Information System**: Manage lab resources and information
- **Announcement System**: University-wide announcements and news
- **Achievement Showcase**: Highlight research milestones and awards
- **File Upload & Management**: Secure document storage with Supabase
- **User Authentication**: Secure login system with Clerk
- **Data Visualization**: Charts and analytics for research metrics
- **Excel Integration**: Import/export data from Excel files

### Technical Features
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data synchronization
- **Type Safety**: Full TypeScript implementation
- **Database Management**: PostgreSQL with Prisma ORM
- **Cloud Storage**: Supabase for file management
- **Modern UI**: Tailwind CSS for styling

## 🛠 Technology Stack

### Frontend
- **Next.js 15.3.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Supabase** - File storage and additional services

### Authentication & Security
- **Clerk** - User authentication and management

### Data Visualization
- **Chart.js** - Charts and graphs
- **React Chart.js 2** - React wrapper for Chart.js
- **Recharts** - React charting library

### File Processing
- **XLSX** - Excel file processing
- **Node Fetch** - HTTP requests

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📁 Project Structure

```
researchhub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── announcement-crud/ # Announcement management
│   │   ├── announcements/     # Public announcements
│   │   ├── grant/             # Grant management pages
│   │   ├── grant-db/          # Grant database operations
│   │   ├── grantupload/       # Grant file uploads
│   │   ├── labs/              # Laboratory management
│   │   ├── login/             # Authentication
│   │   ├── publication-add/   # Add publications
│   │   ├── publications/      # Publications showcase
│   │   ├── test-supabase/     # Supabase testing
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   │   ├── event-crud.tsx     # Event management
│   │   ├── grant-crud.tsx     # Grant CRUD operations
│   │   ├── lab-crud.tsx       # Lab management
│   │   ├── navbar.tsx         # Navigation component
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   ├── server/                # Server-side logic
│   ├── styles/                # Global styles
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── supabase/                  # Supabase configuration
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── Database migration files   # SQL migration scripts
```

## 📋 Prerequisites

Before running the ResearchHub platform, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

### Required Accounts
- **Clerk** account for authentication
- **Supabase** account for file storage
- **PostgreSQL** database (local or hosted)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd researchhub
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy the environment variables template:
```bash
cp .env.example .env
```

## ⚙️ Environment Configuration

Edit the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/research-hub"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for authentication | Yes |
| `CLERK_SECRET_KEY` | Clerk private key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

## 🗄️ Database Setup

### 1. Create Database
Create a PostgreSQL database named `research-hub`:
```sql
CREATE DATABASE "research-hub";
```

### 2. Run Migrations
Generate and deploy Prisma migrations:
```bash
# Generate Prisma client
npm run db:generate

# Deploy migrations
npm run db:migrate

# Push schema to database
npm run db:push
```

### 3. Database Studio (Optional)
View and edit your database with Prisma Studio:
```bash
npm run db:studio
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Preview Mode
```bash
npm run preview
```

## 👥 User Manual

This comprehensive user manual provides step-by-step instructions for using all features of the ResearchHub platform. Follow these guides to effectively navigate and utilize the system.

### 🚪 Getting Started

#### 1. Accessing the Platform
1. Open your web browser
2. Navigate to the ResearchHub URL (e.g., `http://localhost:3000` for development)
3. You'll see the homepage with UTM branding and navigation menu

#### 2. User Authentication
1. Click **"Login"** in the top navigation bar
2. You'll be redirected to the Clerk authentication page
3. **For new users:**
   - Click "Sign up" 
   - Fill in your details (name, email, password)
   - Verify your email address
   - Complete your profile setup
4. **For existing users:**
   - Enter your email and password
   - Click "Sign in"
5. After successful login, you'll be redirected to the homepage

### 📊 Grant Management

#### Viewing Grants
1. Click **"Grants"** in the navigation menu
2. You'll see a table with all existing grants showing:
   - Grant title and description
   - Funding amount
   - Status (Active, Pending, Completed)
   - Start and end dates
   - Principal investigator

#### Adding a New Grant
1. Navigate to the Grants section
2. Click the **"Add New Grant"** button
3. Fill in the grant form:
   - **Title**: Enter the grant title
   - **Description**: Provide detailed description
   - **Funding Amount**: Enter the total funding
   - **Status**: Select from dropdown (Pending, Active, Completed)
   - **Start Date**: Select the project start date
   - **End Date**: Select the project end date
   - **Principal Investigator**: Enter the lead researcher's name
   - **Co-Investigators**: Add team members (optional)
4. Click **"Save Grant"** to submit

#### Editing an Existing Grant
1. In the grants table, click the **"Edit"** button next to the grant
2. Modify the required fields in the edit form
3. Click **"Update Grant"** to save changes
4. Confirmation message will appear upon successful update

#### Uploading Grant Documents
1. Navigate to **"Grant Upload"** section
2. Click **"Choose File"** or drag and drop files
3. Supported formats: PDF, DOC, DOCX, XLS, XLSX
4. Add a description for the document
5. Select the associated grant from the dropdown
6. Click **"Upload"** to store the document
7. Files are securely stored in Supabase cloud storage

#### Viewing Grant Analytics
1. Click **"Grant Database"** in the navigation
2. View visual charts showing:
   - Total funding by year
   - Grant status distribution
   - Success rates
   - Department-wise grant allocation
3. Use filters to customize the view:
   - Date range
   - Department
   - Grant status

### 🔬 Laboratory Management

#### Viewing Laboratory Information
1. Click **"Labs"** in the main navigation
2. Browse the laboratory directory showing:
   - Lab name and location
   - Research focus areas
   - Equipment available
   - Lab manager contact
   - Current research projects

#### Adding a New Laboratory
1. In the Labs section, click **"Add New Lab"**
2. Complete the laboratory form:
   - **Lab Name**: Official laboratory name
   - **Location**: Building and room number
   - **Research Area**: Primary focus (e.g., AI, Biotechnology)
   - **Description**: Detailed lab description
   - **Equipment**: List major equipment
   - **Manager**: Lab manager's name and contact
   - **Capacity**: Number of researchers it can accommodate
3. Upload lab photos (optional)
4. Click **"Save Laboratory"**

#### Managing Lab Resources
1. Select a laboratory from the list
2. Click **"Manage Resources"**
3. Add or update:
   - Equipment inventory
   - Safety protocols
   - Booking schedule
   - Maintenance records
4. Set equipment availability status
5. Save changes

#### Booking Lab Time
1. Navigate to the desired laboratory
2. Click **"Book Time Slot"**
3. Select date and time
4. Specify research purpose
5. Add team members (if applicable)
6. Submit booking request
7. Receive confirmation email

### 📚 Publications Management

#### Viewing Publications
1. Click **"Publications"** in the navigation
2. Browse the publication catalog with:
   - Publication titles
   - Authors and co-authors
   - Publication date
   - Journal/Conference name
   - Publication type (Journal, Conference, Book Chapter)
   - Impact factor (if available)

#### Adding a New Publication
1. Navigate to **"Add Publication"**
2. Fill in the publication details:
   - **Title**: Complete publication title
   - **Authors**: List all authors (separate with commas)
   - **Publication Type**: Select from dropdown
   - **Journal/Conference**: Name of publication venue
   - **Publication Date**: Date of publication
   - **DOI**: Digital Object Identifier (if available)
   - **Abstract**: Brief summary
   - **Keywords**: Relevant keywords (comma-separated)
   - **Impact Factor**: Journal impact factor
3. Upload the publication file (PDF recommended)
4. Click **"Add Publication"**

#### Searching Publications
1. Use the search bar in the Publications section
2. Search by:
   - Title keywords
   - Author names
   - Publication year
   - Research area
3. Apply filters:
   - Publication type
   - Date range
   - Impact factor range
4. Sort results by date, relevance, or impact factor

#### Publication Analytics
1. View publication metrics dashboard
2. See statistics on:
   - Publications per year
   - Research area distribution
   - Author collaboration networks
   - Citation trends
3. Export publication lists in various formats (PDF, Excel, BibTeX)

### 📢 Announcements & Events

#### Viewing Announcements
1. Check the homepage for latest announcements
2. Click **"Announcements"** for full list
3. Announcements include:
   - University news
   - Research opportunities
   - Conference calls
   - Administrative updates
   - Event notifications

#### Creating Announcements (Admin Only)
1. Navigate to **"Announcement Management"**
2. Click **"Create New Announcement"**
3. Fill in announcement details:
   - **Title**: Announcement headline
   - **Content**: Detailed message (supports rich text)
   - **Category**: Select appropriate category
   - **Priority**: Set urgency level
   - **Target Audience**: Choose recipient groups
   - **Expiry Date**: When announcement should be removed
4. Add attachments if needed
5. Click **"Publish Announcement"**

#### Managing Events
1. Go to **"Event Management"** section
2. View calendar of upcoming events
3. **To add an event:**
   - Click **"Add Event"**
   - Enter event details (title, date, time, location)
   - Add description and agenda
   - Set registration requirements
   - Upload event materials
4. **To edit an event:**
   - Click on the event in the calendar
   - Modify details as needed
   - Save changes

### 📁 File Management

#### Uploading Files
1. Navigate to any section with file upload capability
2. Click **"Upload File"** or **"Choose File"**
3. Select files from your computer
4. Supported formats:
   - Documents: PDF, DOC, DOCX, TXT
   - Spreadsheets: XLS, XLSX, CSV
   - Images: JPG, PNG, GIF
   - Archives: ZIP, RAR
5. Add file description and tags
6. Choose access permissions
7. Click **"Upload"**

#### Organizing Files
1. Use the file browser to navigate folders
2. Create new folders by clicking **"New Folder"**
3. Move files by drag-and-drop or cut/paste
4. Rename files by right-clicking and selecting "Rename"
5. Set file permissions for sharing

#### Downloading Files
1. Browse to the desired file
2. Click the **"Download"** button
3. Files will be downloaded to your default download folder
4. Large files may take time depending on internet speed

### 📈 Data Import/Export

#### Excel Data Import
1. Navigate to the relevant section (Grants, Labs, Publications)
2. Click **"Import from Excel"**
3. Download the template file first
4. Fill in your data following the template format
5. Upload the completed Excel file
6. Review the data preview
7. Click **"Import Data"** to process

#### Excel Template Guidelines
- **Grants Template**: Includes columns for title, amount, dates, status
- **Labs Template**: Lab name, location, equipment, capacity
- **Publications Template**: Title, authors, journal, date, DOI
- **Do not modify column headers**
- **Use consistent date formats (YYYY-MM-DD)**
- **Leave optional fields blank rather than using "N/A"**

#### Data Export
1. In any data table, click **"Export"**
2. Choose export format:
   - Excel (.xlsx)
   - CSV (.csv)
   - PDF report
3. Select data range and filters
4. Click **"Download Export"**

### 🔍 Search and Filtering

#### Global Search
1. Use the search bar in the top navigation
2. Enter keywords to search across:
   - Grant titles and descriptions
   - Publication titles and abstracts
   - Lab names and research areas
   - Announcements and events
3. Results are categorized by type
4. Click on results to navigate to full details

#### Advanced Filtering
1. In each section, use the **"Filter"** options
2. Available filters vary by section:
   - **Date ranges**: Start/end dates
   - **Status**: Active, pending, completed
   - **Categories**: Research areas, types
   - **Amount ranges**: Funding amounts, impact factors
3. Apply multiple filters simultaneously
4. Save filter presets for frequent use

### 📊 Dashboard and Analytics

#### Personal Dashboard
1. After login, your dashboard shows:
   - Your recent grants and publications
   - Upcoming events and deadlines
   - Lab bookings and schedules
   - Pending tasks and approvals
2. Customize dashboard widgets by clicking **"Customize"**
3. Set notification preferences

#### Research Analytics
1. Navigate to **"Analytics"** section
2. View comprehensive reports on:
   - Research funding trends
   - Publication productivity
   - Lab utilization rates
   - Collaboration networks
3. Generate custom reports:
   - Select date ranges
   - Choose metrics to include
   - Export or print reports

### 👤 Profile Management

#### Updating Your Profile
1. Click your name/avatar in the top navigation
2. Select **"Profile Settings"**
3. Update your information:
   - Personal details (name, email, phone)
   - Academic information (department, position)
   - Research interests and expertise
   - Profile photo
4. Set notification preferences
5. Configure privacy settings
6. Click **"Save Changes"**

#### Managing Notifications
1. In Profile Settings, go to **"Notifications"**
2. Choose notification types:
   - Email notifications
   - In-app notifications
   - SMS alerts (if configured)
3. Set frequency:
   - Immediate
   - Daily digest
   - Weekly summary
4. Customize notification triggers:
   - New grant opportunities
   - Publication deadlines
   - Event reminders
   - System updates

### 🛠 System Preferences

#### Customizing Interface
1. Access **"Settings"** from the user menu
2. Customize your experience:
   - **Theme**: Light/dark mode
   - **Language**: Interface language
   - **Date Format**: Regional date preferences
   - **Time Zone**: Local time zone setting
3. Set default views for each section
4. Configure accessibility options

#### Data Backup and Security
1. Regularly export your important data
2. Use strong passwords and enable two-factor authentication
3. Log out from shared computers
4. Report any security concerns to administrators

### ❓ Getting Help

#### Built-in Help
1. Look for **"?"** icons next to complex features
2. Hover over buttons for tooltips
3. Check the **"Help"** section in navigation

#### Contact Support
- **Technical Issues**: Contact IT support
- **Content Questions**: Reach out to research office
- **Training Requests**: Schedule training sessions
- **Feature Requests**: Submit via feedback form

#### Keyboard Shortcuts
- **Ctrl+S**: Save current form
- **Ctrl+F**: Search current page
- **Ctrl+N**: Create new item (context-dependent)
- **Esc**: Close modal dialogs
- **Tab**: Navigate between form fields

### 🔄 Regular Maintenance Tasks

#### Weekly Tasks
- Review and update your active grants
- Check for new publication opportunities
- Update lab schedules and bookings
- Review announcements and events

#### Monthly Tasks
- Export data backups
- Update your research profile
- Review system notifications
- Check for software updates

#### Annual Tasks
- Archive completed projects
- Update research interests and expertise
- Review and clean up old files
- Participate in user feedback surveys

---

**💡 Pro Tips for Efficient Use:**
- Bookmark frequently used sections
- Use filters to quickly find relevant information
- Set up email notifications for important updates
- Regularly backup your important data
- Take advantage of batch operations for bulk updates
- Use the search function to quickly locate information
- Keep your profile updated for better collaboration opportunities
