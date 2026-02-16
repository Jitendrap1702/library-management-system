const express = require('express');
const {users} = require('../data/users.json');

const router = express.Router();

/**
 * ROUTE: /users
 * METHOD: GET
 * DESCRIPTION: Get all users
 * ACCESS: Public
 * PARAMS: None
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success : true,
        data : users
    })
});

/**
 * ROUTE: /users/:id
 * METHOD: GET
 * DESCRIPTION: Get a user by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.get('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find(user => user.id === id);
    if(!user){
        res.status(404).json({
            success : false,
            message : 'User not found for id: ' + id
        });
    }else{
        res.status(200).json({
            success : true,
            data : user
        });
    }
});

/**
 * ROUTE: /users
 * METHOD: POST
 * DESCRIPTION: Create/Register a new user
 * ACCESS: Public
 * PARAMS: None
 * BODY: {
 *      id : String,
 *      name : String,
 *     email : String,
 *    subscriptionType : String,
 *   subscriptionDate : String
 * }
 */
router.post('/', (req, res) => {
    // Destructuring the required fields from the request body
    const {id, name, email, subscriptionType, subscriptionDate} = req.body;

    // Validating that all required fields are present in the request body
    if(!id || !name || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            success : false,
            message : 'All fields are required: id, name, email, subscriptionType, subscriptionDate'
        });
    }
    // Checking if a user with the same id already exists in the users array
    const user = users.find(user => user.id === id);
    if(user){
        res.status(409).json({ 
            success : false,
            message : 'User already exists with id: ' + id
        });
    }else{
        // Creating a new user object with the provided data
        const newUser = {
            id,
            name,
            email,
            subscriptionType,
            subscriptionDate
        };
        // Adding the new user to the users array
        users.push(newUser);
        res.status(201).json({
            success : true,
            message : 'User created successfully',
            data : newUser
        });
    }
});

/**
 * ROUTE: /users/:id
 * METHOD: PUT
 * DESCRIPTION: Update a user by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data} = req.body;
    if(!data){
        return res.status(400).json({
            success : false,
            message : 'Data field is required in the request body'
        });
    }
    const user = users.find(user => user.id === id);
    if(!user){
        res.status(404).json({
            success : false,
            message : 'User not found for id: ' + id
        });
    }else{
        const updatedUser = users.map((user) => {
            if(user.id === id){
                return {...user, ...data};
            }
            return user;
        });
        users.splice(0, users.length, ...updatedUser);
        res.status(200).json({
            success : true,
            message : 'User updated successfully',
            data : updatedUser
        });
    }
});

/**
 * ROUTE: /users/:id
 * METHOD: DELETE
 * DESCRIPTION: Delete a user by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find(user => user.id === id);
    if(!user){
        res.status(404).json({
            success : false,
            message : 'User not found for id: ' + id
        });
    }else{
        /* Method 1: Using filter to create a new array without the user to be deleted and then replacing the original users array with the new array
        const updatedUsers = users.filter(user => user.id !== id);
        users.splice(0, users.length, ...updatedUsers);
        */
        const index = users.indexOf(user);
        users.splice(index, 1);
        res.status(200).json({
            success : true,
            message : 'User deleted successfully',
            data : users
        });
    }
});

/**
 * ROUTE: /subscription-details/:id
 * METHOD: GET
 * DESCRIPTION: Get subscription details of a user by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.get('/subscription-details/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find(user => user.id === id);
    if(!user){
        res.status(404).json({
            success : false,
            message : 'User not found for id: ' + id
        });
    }else{

        const getDateInDays = (data) => {
            let date;
            if(data){
                date = new Date(data);
            }else{
                date = new Date();
            }
            const days = Math.ceil(date.getTime() / (1000 * 60 * 60 * 24));
            return days;
        }

        const subscriptionType = (date) => {
            if(user.subscriptionType === 'Basic'){
                date = date + 90;
            }else if(user.subscriptionType === 'Standard'){
                date = date + 180;
            }else if(user.subscriptionType === 'Premium'){
                date = date + 365;
            }
            return date;
        }

        let returnDate = getDateInDays(user.returnDate);
        let currentDate = getDateInDays();
        let subscriptionDate = getDateInDays(user.subscriptionDate);
        let subcriptionExpiryDate = subscriptionType(subscriptionDate);

        const subscriptionDetails = {
            ...user,
            subscriptionType : user.subscriptionType,
            subscriptionDate : user.subscriptionDate,
            // subscriptionExpired : subcriptionExpiryDate < currentDate,
            subscriptionDaysLeft : subcriptionExpiryDate - currentDate, 
            daysLeftForReturn : returnDate - currentDate,
            returnDate : returnDate < currentDate ? "Book is overdue" : returnDate,
            fine : returnDate < currentDate ? subcriptionExpiryDate <= currentDate ? 200 : 100 : 0
        };
        res.status(200).json({
            success : true,
            data : subscriptionDetails
        });
    }
});

// Helper function to calculate the subscription expiry date based on the subscription type and subscription date
function calculateSubscriptionExpiryDate(subscriptionType, subscriptionDate){
    const date = new Date(subscriptionDate);
    switch(subscriptionType){
        case 'Basic':
            // Adding 1 month to the subscription date for Basic subscription type
            date.setMonth(date.getMonth() + 1);
            break;
        case 'Standard':
            date.setMonth(date.getMonth() + 6);
            break;
        case 'Premium':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            return null;
    }
    return date.toISOString().split('T')[0];
}

// Exporting the router object to be used in other parts of the application
module.exports = router;