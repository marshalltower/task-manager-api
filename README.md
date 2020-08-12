The following functionality & API endpoints are available:

Read User Profile
-GET:  {{url}}/users/me

Get User
-GET: {{url}}/users/5f0dff3f0d22111384127b56

Create User
-POST: {{url}}/users
    body: {name, email, password}

Update User
-PATCH: {{url}}/users/me
    body: {name, email, password}

Remove User
-DEL: {{url}}/users/me

Log In User
-POST: {{url}}/users/login
    body: {email, password}

Log Out User
-POST: {{url}}/users/logout

Log Out All Users (for multi-device logins)
-POST: {{url}}/users/logoutAll

Upload Profile Picture
-POST: {{url}}/users/me/avatar
    body: {avatar}

Delete Profile Picture
-DEL: {{url}}/users/me/avatar

Get Tasks
-GET: {{url}}/tasks?sortBy=description_asc&completed=false&limit=0&skip=0

Get Task
-GET: {{url}}/tasks/5f1a4ea76e86712220660565

Create Task
-POST: {{url}}/tasks
    body: {description, completed}

Update Task
-PATCH: {{url}}/tasks/5f1a4ea76e86712220660565
    body: {description, completed}

Remove Task
-DEL: {{url}}/tasks/5f1a4ead6e86712220660566
