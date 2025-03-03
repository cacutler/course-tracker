# Course Tracker (Senior Project)

## Description

My senior project is a course tracker/planner meant as a streamlined, easy-to-use version of other methods of course planning like DegreeWorks and Excel spreadsheets.  I am using the Angular framework and TypeScript for the front-end and Google Firebase for the backend and web app hosting.  

### Figma Mockup
https://www.figma.com/design/LZoU9NSJAXmruuc4uv3OQE/Course-Planner?node-id=0-1&p=f&t=OTUoCZl0vSOBlOsc-0

### Database Design

**User Table:**
- First Name (String) - required for account creation; this is the student's first name
- Last Name (String) - required for account creation; this is the student's last name
- Username (String) - required for account creation; this is the student's username
- Password (String) - required for account creation; this is the student's password
- Major (String) - This is the student's major
- Track (String) - This is the student's major degree track if their chosen major requires a track
- Credits (Number) - This is the number of credits the student has taken and passed
- GPA (Number) - optional future feature; this is the student's GPA based on previous classes and grades
- Plans (Array of Plans) - This is a list of plan JSON objects
- Passed Courses (Array of Courses) - This is a list of passed courses the student has completed where courses are objects
- Future Courses (Array of Courses) - This is a list of future courses required for the student's major where courses are objects
- Available Courses (Array of Courses) - This is a list of available courses the student can take where courses are objects

**Degree Table:**
- Degree Title (String)
- Degree Tracks (Array of Strings)
- Required Courses (Array of Courses)
- Default Plan (Plan)

**Course Table:**
- Course Title (String)
- Course Number (String)
- Prerequisite Courses (Array of Strings)
- Corequisite Courses (Array of Strings)
- Semester Availability (Array of Strings)
- Credit Hours (Number)

**Plan Table:**
- Plan Title (String)
- First Semester (Array of Strings)
- Second Semester (Array of Strings)
- Third Semester (Array of Strings)
- Fourth Semester (Array of Strings)
- Fifth Semester (Array of Strings)
- Sixth Semester (Array of Strings)
- Seventh Semester (Array of Strings)
- Eighth Semester (Array of Strings)