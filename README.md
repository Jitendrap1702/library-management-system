# library-management-system

    A Library management system , ExpressJs learning project

    This is a library management API Backend for the management of users and the books.

# Routes and the Endpoints

## /users
GET: Get list of users in the system
POST: Create/Register a new user

## /users/{id}
GET: Get a user by its ID
PUT: Updating a user by its ID
DELETE: Deleting a user by its ID (Check if user still have a issued book) && (Is there any fine/penalty to be collected)

## /users/subscription-details/{id}
GET: Get a user subscription details by their ID
    >> Date of subscription
    >> Valid till ?
    >> fine any ?


## /books
GET: Get all the books in the system
POST: Add a new book to the system

## /books/{id}
GET: Get a book by its ID
PUT: Update a boo by its ID
DELETE: Delete a book by its ID

## /books/issued
GET: Get all the issued books

## /books/issued/withFine
GET: Get all the books with their fine amount

### Subscription Types
    >> Basic (3 months)
    >> Standard (6 months)
    >> Premium (12 months)


>> If a user missed the renewal date, then user need to pay $100
>> If a user missed the subscription, then user is expected to pay $100
>> if user missed both renewal & subscription, then the collected amount should be $200


## Commands:
npm init
npm i express
npm i nodemon --save-dev

npm run dev

To restore node_modules and package_lock.json --> npm i/npm install

Created By Jitendra Patel
