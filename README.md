# INTERN MANAGEMENT SYSTEM

## System Documentation

**Project:** Intern Management System

**Organization:** Capricorn District Municipality

**Developer:** Masola Ramokone Respector

**Year:** 2026


# 1. Introduction

## 1.1 Background

The Intern Management System is a web-based application developed to assist in the management and administration of interns within an organization.

The system provides a centralized platform where interns can access tasks assigned to them, submit task progress reports, apply for leave, view their leave applications, mark attendance, and receive feedback from supervisors.

The system is designed to reduce reliance on manual processes and improve communication between interns, supervisors, and administrators.

### 1.2 Problem Statement

Managing interns using manual processes such as paper-based leave applications, spreadsheets, emails, and physical attendance registers can result in:

* Loss of important records
* Difficulty tracking intern tasks
* Delays in leave approval
* Difficulty monitoring attendance
* Poor communication between interns and supervisors
* Difficulty generating reports
* Duplicate or inconsistent information

The Intern Management System addresses these challenges by providing a centralized digital platform for managing intern-related activities.

### 1.3 Aim of the System

The aim of the Intern Management System is to provide a centralized web-based platform for managing intern tasks, leave applications, attendance, and communication between interns and supervisors.

### 1.4 Objectives

The objectives of the system are to:

1. Allow interns to securely access their accounts.
2. Allow supervisors to assign tasks to interns.
3. Allow interns to view assigned tasks.
4. Allow interns to submit task progress reports.
5. Allow supervisors to provide feedback on tasks.
6. Allow interns to apply for leave electronically.
7. Allow interns to view their leave applications and statuses.
8. Allow interns to record attendance.
9. Provide administrators with centralized access to intern information.
10. Reduce manual paperwork and improve record keeping.

# 2. Scope of the System

The system focuses on the management of interns and their daily administrative activities.

The main functions within the system include:

### Intern Management

* Intern registration
* Intern login
* Profile/account management
* Role-based access

### Task Management

* Task assignment
* Viewing assigned tasks
* Task progress reporting
* Supervisor feedback

### Leave Management

* Leave application
* Leave type selection
* Leave balance
* Leave status tracking

### Attendance Management

* Recording attendance
* Maintaining attendance records

### Authentication

* Login
* Logout
* User authentication
* Role identification

# 3. System Users

The system contains different types of users.

### 3.1 Intern

The intern is able to:

* Log into the system
* View assigned tasks
* Submit task progress
* View supervisor feedback
* Apply for leave
* View previous leave applications
* Mark attendance
* Sign out

### 3.2 Supervisor

The supervisor is responsible for:
* Log into the system
* Viewing interns
* Assigning tasks
* Monitoring task progress
* Reviewing submitted reports
* Providing feedback
* Managing leave applications

### 3.3 Administrator

The administrator manages the overall system and can perform administrative activities such as:
* Log into the system
* Managing users
* Managing intern records
* Managing supervisors
* Monitoring system activities
* Managing system data

# 4. Intern Dashboard

The intern dashboard is the main interface available to an intern after successful authentication.

The dashboard provides access to the main intern functions.

The navigation menu contains:

* Apply Leave
* My Leaves
* View Tasks
* Mark Attendance
* Sign Out

The dashboard also displays the organization's branding and contact information.


# 5. Task Management

### 5.1 View Tasks

The system provides an interface where interns can view tasks assigned to them.

The task table contains:

| Field       | Description                          |
| ----------- | ------------------------------------ |
| ID          | Unique task identifier               |
| Description | Description of the assigned task     |
| Date        | Date associated with the task        |
| Report      | Allows the intern to submit progress |
| Feedback    | Displays supervisor feedback         |

### 5.2 Task Progress
An intern can submit the current status of a task.
The available progress statuses are:

* Complete
* Need Support
* In Progress

This allows supervisors to monitor the progress of assigned tasks.

## 5.3 Supervisor Feedback

After an intern submits a task report, the supervisor can review the report and provide feedback.

The feedback is displayed to the intern through the dashboard.



# 6. Leave Management

### 6.1 Apply for Leave

The system provides a digital leave application form.

The intern must provide:

* Start date
* End date
* Reason
* Leave type
* Department

The available leave types include:

* Sick
* Annual
* Casual

After completing the form, the intern submits the application using the **Apply Leave** button.

### 6.2 View Leave Applications

The **My Leave Applications** section allows interns to view their previous leave applications.

The table displays:

| Field      | Description                                 |
| ---------- | ------------------------------------------- |
| Leave Code | Unique identifier for the leave application |
| Start Date | Beginning of leave                          |
| End Date   | End of leave                                |
| Leave Type | Type of leave requested                     |
| Reason     | Reason for the application                  |
| Balance    | Remaining leave balance                     |
| Department | Intern's department                         |
| Status     | Current application status                  |

The status allows the intern to determine whether the leave application has been approved, rejected, or is still pending.



### 7. Attendance Management

The system provides an attendance function that allows interns to record their attendance.

The intern accesses attendance through the **Mark Attendance** button.

The attendance module is implemented as a separate page and is accessed through:

`attendance.html`

The attendance module is responsible for recording the intern's attendance information.



### 8. Authentication and Security

The system includes authentication functionality to prevent unauthorized users from accessing protected areas.

Users are required to log in before accessing system functionality.

The system identifies users based on their roles.

Roles include:

* Intern
* Supervisor
* Administrator

Role-based access ensures that users only access functions appropriate to their responsibilities.

The system also provides 
 **Sign Out** function that allows users to terminate their active session.


# 9. User Interface
The intern dashboard uses a navigation-based interface.

### 9.1 Navigation Bar

The navigation bar contains:

* Organization logo
* System title
* Menu button

The menu can be opened and closed using the menu controls.

# 10. Technologies Used

The system uses web technologies for the frontend.

### 10.1 HTML

HTML is used to create the structure of the web pages.

The provided intern dashboard uses HTML elements such as:

* Forms
* Tables
* Buttons
* Inputs
* Select elements
* Navigation elements
* Images

### 10.2 CSS

CSS is used to control the appearance and layout of the application.

The dashboard references:

`internStyle.css`

The stylesheet is responsible for the visual presentation of the dashboard.

### 10.3 JavaScript

JavaScript provides the interactive functionality of the application.

The dashboard references:

`internScript.js`

JavaScript is responsible for functions such as:

* Opening and closing the menu
* Switching dashboard sections
* Loading tasks
* Loading leave applications
* Submitting task reports
* Submitting leave applications
* Signing out

### 10.4 Backend

The backend provides the application's business logic and communicates with the database.

The backend is responsible for:

* Authentication
* User management
* Task management
* Leave management
* Attendance management
* Database operations
* API communication

## 10.5 Database

The system uses a relational database to store application information.

Typical database entities:

* Users
* Tasks
* Leave applications
* Attendance records


# 11. System Architecture

The system follows a client-server architecture.

         1. Web Browser  
         
| HTML | CSS | JavaScript 

                │
                
       HTTP Requests
       
                ↓
                
        2. Backend/API  
        
| Authentication |Task Management | Leave Management  | Attendance  

                │
                
          Database Queries
          
                ↓
                
         3. Database   
         
│ Users | Tasks |  Leave | Attendance                       
                         
                
# 12. Functional Requirements

The system is able to do the following:

### Authentication

* Allow users to log in.
* Validate user credentials.
* Identify user roles.
* Allow users to sign out.

### Tasks

* Allow supervisors to assign tasks.
* Allow interns to view tasks.
* Allow interns to submit progress.
* Allow supervisors to provide feedback.
* Allow admin to view all tasks

### Leave

* Allow interns to submit leave applications.
* Store leave applications.
* Allow Supervisor to approve or reject leave 
* Display leave history.
* Display leave status.
* Display leave balance.
* Allow admin to view all leaves

### Attendance

* Allow interns to mark attendance.
* Store attendance records.
* Allow authorized users to view attendance information.


# 13. Non-Functional Requirements

### Performance

The system respond to user requests within a reasonable amount of time.

### Usability

The interface is simple and easy for interns and supervisors to understand.

### Security

User information and authentication credentials are protected from unauthorized access.

### Reliability

The system  maintain accurate records and prevent loss of important information.

### Maintainability

The system is structured into separate frontend, backend, and database components to make future maintenance easier.

### Compatibility

The web application  work on modern browsers such as:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox


# 14. Error Handling

The system provide appropriate feedback when an operation fails.

Examples:

* Invalid login credentials
* Missing required fields
* Invalid dates
* Failed leave submission
* Failed task report submission
* Database errors
* Unauthorized access
Clear error messages should be displayed to the user.



### 15. Testing
Testing  be performed to verify that each system function works correctly.
test cases include:

| Test Case | Action                         | Expected Result                    |
| --------- | ------------------------------ | ---------------------------------- |
| TC001     | Login with valid credentials   | User successfully logs in          |
| TC002     | Login with invalid credentials | Error message is displayed         |
| TC003     | Submit leave application       | Leave application is stored        |
| TC004     | View leave applications        | User's leave records are displayed |
| TC005     | View assigned tasks            | Assigned tasks are displayed       |
| TC006     | Submit task progress           | Task report is submitted           |
| TC007     | Mark attendance                | Attendance record is created       |
| TC008     | Sign out                       | User session is terminated         | 



### 16. Future Improvements

Possible future improvements include:

1. Email notifications for leave approvals.
2. PDF report generation.
3. Excel report generation.
4. Supervisor notifications when interns submit reports.
5. Improved role-based permissions.
6. Password reset functionality.
7. Audit logs.
8. Mobile-responsive design.


### 17. Conclusion

The Intern Management System provides a centralized solution for managing intern-related activities within an organization.

The system improves the management of tasks, leave applications, attendance, and communication between interns and supervisors.

By replacing manual processes with a centralized web-based platform, the system can improve efficiency, record keeping, accessibility, and transparency.

The system will also be expanded with additional reporting, notification, security, and analytics functionality.


<img width="1838" height="863" alt="Screenshot (35)" src="https://github.com/user-attachments/assets/f71731d4-d3f9-4e55-96a2-f9000c18f55d" />
<img width="1856" height="913" alt="Screenshot (54)" src="https://github.com/user-attachments/assets/82262767-2472-4762-ab89-ad3b6a67f25b" />
<img width="1866" height="891" alt="Screenshot (57)" src="https://github.com/user-attachments/assets/b312f1c0-fcfc-4b0d-a37b-d75bf1d893dd" />

<img width="1920" height="1080" alt="Screenshot (55)" src="https://github.com/user-attachments/assets/e241b1ea-3412-466a-b005-fd94e5967e26" />
<img width="1850" height="843" alt="Screenshot (56)" src="https://github.com/user-attachments/assets/68817ec0-a8ab-4bb9-8342-16814b7e7076" />


<img width="1843" height="887" alt="Screenshot (34)" src="https://github.com/user-attachments/assets/7645533e-1fc1-4bed-9191-28207615c984" />

<img width="1867" height="882" alt="Screenshot (33)" src="https://github.com/user-attachments/assets/1def2ac6-200c-4fa0-bcf6-67ba522022ca" />

<img width="1844" height="901" alt="Screenshot (38)" src="https://github.com/user-attachments/assets/162f110e-3ce6-42b4-9f5c-d869998fdb1c" />

<img width="1860" height="697" alt="Screenshot (39)" src="https://github.com/user-attachments/assets/f4b92d44-b6df-4a5a-98ef-e9282fe995d5" />

<img width="1864" height="887" alt="Screenshot (40)" src="https://github.com/user-attachments/assets/3dc1bbd7-5872-4880-9d34-62adbf28e9ad" />



