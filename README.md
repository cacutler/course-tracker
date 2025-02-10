# Course Tracker (Senior Project)

## Description

My senior project is a course tracker/planner meant as a streamlined, easy-to-use version of other methods of course planning like DegreeWorks and Excel spreadsheets.  I am using the Angular framework and TypeScript for the front-end and Google Firebase for the backend and web app hosting.  

### Figma Mockup
https://www.figma.com/design/LZoU9NSJAXmruuc4uv3OQE/Course-Planner?node-id=0-1&p=f&t=OTUoCZl0vSOBlOsc-0

### Database Design

**User Table:**
- First Name (String) - required for account creation
- Last Name (String) - required for account creation
- Username (String) - required for account creation
- Password (String) - required for account creation
- Major (String)
- Track (String)
- Credits (Number)
- GPA (Number) - optional future feature
- Plans (Array) - This is a list of plan JSON objects
- Passed Courses (Array)
- Future Courses (Array)
- Available Courses (Array)

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