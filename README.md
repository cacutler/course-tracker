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
- Plans (Array) - This is a list of plan JSON objects
- Passed Courses (Array) - This is a list of passed courses the student has completed where courses are objects
- Future Courses (Array) - This is a list of future courses required for the student's major where courses are objects
- Available Courses (Array) - This is a list of available courses the student can take where courses are objects

**Degree Table:**
- Degree Title
- Degree Tracks
- Required Courses
- Default Plan

**Course Object:**
- Course Title
- Course Number
- Prerequisite Courses
- Corequisite Courses
- Semester Availability (Array)

**Plan Object:**
- Plan Title
- First Semester
- Second Semester
- Third Semester
- Fourth Semester
- Fifth Semester
- Sixth Semester
- Seventh Semester
- Eighth Semester