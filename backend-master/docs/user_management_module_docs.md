# Documentation for User Management Module

## Authentication and Authorization

**All the routes in this module, i.e in the route /api/uses/ are protected with role-based access and token based authentication***.
The role of the user is identified with the access token in the request header.
So make sure to include the accessToken for each request to these routes

### How to include the accessToken header

***For every request made to the following routes should have the headers***

| key | value | 
| -------- | -------- | 
| Authorization | access-token |

Note: access-token can be obtained after login using Auth0 Sign-Ins

## Currently Available Roles
The following are the currently available roles:
1. superadmin
2. technician

So when dealing with Roles, such as creating new user, the value given to employeeRole field should be from a drop-down menu of these available values. Any other value for employeeRole might cause inconsistency

## How to build the Login Page

The login page functionality is provided by Auth0 Library. So the auth0 login page is available for 
all environment including web and mobile(flutter).

### Mobile (flutter)

Follow this official docs to set up the auth0 Login page for flutter
https://auth0.com/docs/quickstart/native/flutter/interactive


### Web (NextJS)
    
Follow this official docs to set up the auth0 Login page for web
https://auth0.com/docs/quickstart/webapp/nextjs/interactive

### Login Flow
1. Set up the universal login page for both platform using the above Auth0 official guides.
2. While setting up, provide callback url as the application homepage and extract the token from callback url for saving the token. 
3. After successful login, a token is sent to the client side. Save that token as a global state of the application and use that token while making the api requests. See the below Routes on how to use the tokens.
4. Also provide logout urls in auth0 setup of the application to where redirect the users after logout.

Note: The login ,ideally ,should not be storing the tokens in session storage as it will cause persistent login.

Note: You can optionally customize the design and logo in the universal login page using the auth0 dashboard

## Routes


### 1. Create new User

Note: Only the user with employeeRole 'superadmin' can create a new user
The role of the user is identified with the access token in the request header.
So make sure to include the accessToken for each request to these routes

Route
```
    /api/users/createUser
```

Required Role: superadmin

Method: POST   
Type: urlencoded  

Fields
| value | type | 
| -------- | -------- |
email|email
name|String
phone|String
employeeRole|String
password|String

The response contains a automatically generated, unique employeeID

Note: Creating new user would require the emailID verification of the user. This step is very important for authentication system. After a new user is created, an email is sent to the newly created user's emailID, containing a verfication link, the user must click on the link and verify the email.

The email-verification status of the user can be viewed from the results of **getEmployeeInfo**, indicated by "isEmailVerified" key.

### Login In to Employee Account

Route
```
    /api/users/signInUser
```
Method: POST,

Fields
| value | type | 
| -------- | -------- |
email|String
password|String

Responds with the Access Token and Employee Role.

```
{
    "accessToken": token,
    "employeeRole": "technician"
}
```

### 2. Reset User/Employee Password

Resetting password can be entirely done with the auth0 frontend app; whether it's Flutter or Web.
Click on "forgot password" button on Auth0's Universal Login Box. Then follow the next steps.

### 3. Upload User Profile Photo

This same route can be used to add or update the image of the user which are currently present in the db.

Route:
```
    /api/users/uploadUserProfilePhoto?id=_id
```
Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

Note: _id refers to mongodb _id. The value of _id is present in the API response of creating new users


We create a new FormData object from the form and use the fetch API to send a POST request to the /api/users/uploadUserProfilePhoto endpoint with the FormData object as the request body.

The field of file should be 'image'


Method: POST,

Fields: _id from the database as query parameter

Example Request: 
    Route:

    ```
    /api/users/uploadUserProfilePhoto?id=6548fd6efd62a2f2b6318e36
    ```
    formData.append(fileInput.name, fileInput.file);

    fetch(`/api/users/uploadUserProfilePhoto?id=6548fd6efd62a2f2b6318e36`, {
              method: 'POST',
                body: formData



This request will update the profile pic of the user


### 4. List All Users/Employees

Lists all the users/employees in the database with all the information

Route
```
    /api/users/listAllEmployees
```

Required Role: superadmin

Method: GET

Responds with an array of all the users/employees


### 5. List Employee By Role

Lists the users/employee by their specified role

Route 
```
    /api/users/listEmployeeByRole 
```

Required Role: superadmin,

Method : GET,
required query params
?employeeRole=role_of_employee

Example:
```
api/users/listEmployeeByRole?employeeRole=technician
```

Responds with an array of all the users/employees of given role


### 6. Update User Or Employee Profile

This route can be used to update the user/employee profile.

Note: The emailID of the user/employee acts as primary authentication method. Therefore updating emailID of user should not be done.

Route 
```
    api/users/updateUserProfile
```

Required Role: superadmin

Method: POST,

Fields:
| value | type |
| -------- | -------- |
|employeeName|String |
|employeePhoneNumber|String|
|employeeRole|String|
|employeeID (its not updated, but used to ID the User)| String |

Responds with a successful message

### 7. Delete User Or Employee

This route can be used to delete a user / employee from the DB.
Note: Deletion of employee will remove the entries from main DB and auth0_db.

Route:
```
    api/users/deleteUser
```
Method: POST,

Required Employee role: superadmin,

Fields
| value | type | 
| -------- | -------- |
|employeeID|String|

### 8. Create Or Assign New Task To Employee

Route
```
    api/users/assignTask
```

Method: POST,
Required Role: superadmin,

Fields
| value | type | 
| -------- | -------- |
employeeID|String
taskName|String
taskDescription|String

### 9. View All Task or Assignments

Lists the tasks/assignments in the database

Route 
```
    /api/users/viewAllTasks
```

Required Role: superadmin,

Method : GET,

Responds with an array of all the tasks/assignments

### View All Orders Details From an End User

Returns an array of all the repair orders from an end user.
Route
```
    api/users/viewEndUserOrder
```

Method: GET

Fields: 
UserID of the end user as id query param. See the below example

Example
```
    api/users/viewEndUserOrder?id=657ea314257831e73de81ced
```

### View All Assigned Tasks

Returns an array of all assigned tasks including to whom its is allocated to.

Route
```
    api/users/viewAssignedTasks
```
Method: GET,


### 10. View My Tasks

Lists all the tasks assigned to the logged in user/employee

Route
```
    /api/users/viewMyTasks
```

Responds with an array of tasks assigned to the currently logged in user

### 11. Update My Task

Update the tasks of the logged in user/employee


Route
```
   api/users/updateMyTask?id=_id
```
Fields:
| value | type | 
| -------- | -------- |
|taskName|String|
|taskDescription|String|
|taskStatus|String|

Note: This is route is primarily intended for updating task status by alloted user.
Since the task to be updated is selected using its actual _id from DB as a query params, logged in 
user can only update his own tasks. So ideally, this should be used to update information about taskStatus.

Note2: The _id can be derived from listing all the tasks assigned to the loggeed in user using 
the above route of **viewMyTasks**

Note3: the taskStatus field should be having one of the values of: 'rejected', 'completed', 'in-process'. So make sure to send one of these values only, ideally use a drop-down.

Responds with updated task.

### View Individual Repair Orders

Can be used to get an individual repair order details using its id

Route
```
    /api/users/updateTasks?id=658045bf7f10df44aabad032&staffName=staffNameFromCLerk
```
Method: POST
Note: Provide the orderId as id and staffName(fetched from clerk) as query params. see the example Request-Response below.

Example:
```
    /api/users/updateTasks?id=658045bf7f10df44aabad032&staffName=ram
```
Response:
```json
{
    "_id": "658045bf7f10df44aabad032",
    "taskName": "Service 1, ",
    "taskDescription": "Category: Category 2, Brand: Brand 1, Model: Model 1, Services: Service 1 - 10000.0, Payment Method: Online Mode, Delivery Mode: Deliver to Address",
    "taskStatus": "pending",
    "orderDate": "2023-12-18T13:14:39.697Z",
    "reqUserId": "65740102d9f0689e8d9fb4a4",
    "reqUserStreet": "ejejj",
    "reqUserCity": "",
    "reqUserState": "",
    "reqUserEmail": "pkraj@gmail.com",
    "__v": 0
}
```

### View Order History 

An array of history entries of the order

Route
```
    /api/users/viewOrderHistory
```
Method: GET,
Provide the repair Order id as the query param id. See the example below.

Example:
```
    /api/users/viewOrderHistory?id=658045bf7f10df44aabad032
```

Response:
```json
[
    {
        "datetime": "12/24/2023, 4:32:53 PM",
        "comment": "put in pending state",
        "taskStatus": "pending",
        "staffName": "superadmin"
    },
    {
        "datetime": "12/24/2023, 4:40:37 PM",
        "comment": "put in processing state",
        "taskStatus": "in-process",
        "staffName": "superadmin"
    }
]
```

###  Update Any Tasks

Can be used to update any tasks in the database by the superadmin

Route
```
   api/users/updateTasks?id=_id
```
Method: POST,

Fields:
| value | type | 
| -------- | -------- |
|taskName|String|
|taskDescription|String|
|taskStatus|String|
|assignedEmployeeID|String|
| comment | String |


Note1: The _id can be derived from listing all the tasks in the DB using 
the above route of **viewAllTasks**

Note2: the taskStatus field should be having one of the values of: 'rejected', 'completed', 'in-process'. So make sure to send one of these values only, ideally use a drop-down.

Responds with updated task.

See the example Request-Response Below.

Example:
```
    api/users/updateTasks?id=658045bf7f10df44aabad032
```
Method: POST,

Body: json-body
```json
{
    "taskStatus":"in-process"
}

```

Response:
```json
{
    "info": "Updated Successfully",
    "result": {
        "_id": "658045bf7f10df44aabad032",
        "taskName": "Service 1, ",
        "taskDescription": "Category: Category 2, Brand: Brand 1, Model: Model 1, Services: Service 1 - 10000.0, Payment Method: Online Mode, Delivery Mode: Deliver to Address",
        "taskStatus": "in-process",
        "orderDate": "2023-12-18T13:14:39.697Z",
        "reqUserId": "65740102d9f0689e8d9fb4a4",
        "reqUserStreet": "ejejj",
        "reqUserCity": "",
        "reqUserState": "",
        "reqUserEmail": "pkraj@gmail.com",
        "__v": 0
    }
}

```
