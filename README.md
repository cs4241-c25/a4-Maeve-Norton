# Assigment 4: Submit SkiRuns

Glitch Link: https://a4-maeve-norton.glitch.me/

My code first starts with a login page where the user is able to login using their GitHub account. Once the user is authenticated they are redirected to a webpage where they can submit a Ski Run by filling out the Ski Run Form. Once the form is submitted, their ski run will be visible to them via the results table. This results table only show the ski run data for the specific authenticated user. The user can also modify and delete their ski runs from the ski run table.

- **server.js**
    - Express server
    - Passport GitHub authentication

- **React**
    - App.jsx
    - main.jsx
    - index.css = color palette from a1
    - login.jsx
        - login page for the user, redirects to the SkiRunForm after authentication
    - SkiRunForm.jsx
        - Includes the ski run form and the results table
        - functions to submit, delete, modify, logout

- **Bootstrap**
    - used bootstrap as my style framework for the form, table, and login page

- **MongoDB**
    - used MongoDB for the database
