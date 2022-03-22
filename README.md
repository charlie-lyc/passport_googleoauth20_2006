# Passport & Google OAuth20
Learning Passport & Google OAuth20 with building 'Storybooks' app.


## Backend

- MongoDB, Mongoose 
- Express
- NodeJS
- Passport
- Passport Google OAuth20


## Template Engine

- Express Handlebars


## API

### Google Authentication
- Register or login user : [GET] /auth/google
- Logout user            : [GET] /auth/logout

### Storybooks

- Ensure Guest
    - Landing and login page  : [GET] /

- Ensure Authentication
    - Get logged in user's stories : [GET]    /dashboard
    - Show all stories             : [GET]    /stories
    - Add story form page          : [GET]    /stories/add
    - Add story                    : [POST]   /stories
    - Get single story             : [GET]    /stories/:id
    - Get specific user's stories  : [GET]    /stories/user/:id
    - Edit story form page         : [GET]    /stories/edit/:id
    - Edit story                   : [PUT]    /stories/:id
    - Delete story                 : [DELETE] /stories/:id