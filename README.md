# Credit Card Validation

## How to Run the project

1. open the terminal in path of the project
2. install all dependencies using ```npm install```
3. add .env file having the required parameters that are included in the project
4. after adding the .env file now you need to create the db in postgresql
5. In order to create db you can add it manually through pgAdmin or you can use db-migrate that can add db
6. to use db-migrate please make sure you modify the database.json data to have the same as you are using
7. when all of these are done now in terminal run ``` db-migrate db:create DB_NAME ```

After completing all these steps now you can run the code with ```nodemon app.js ``` and validate the apis


## Project Structure

### utils

Here is where the encryption and decryption functions are made in order to not having security data shown for everyone.
I have used node-forge which is used for cryptography and security reasons

### queries.js

this where the functions and queries are made.
In this code I have implemented 3 apis ***GET*** ***GETBYID***& ***POST*** you add your desired queries and CRUD methods

Also the table is created alone without having to add it manually 

### app.js

This is the engine of the project where most things are declared and used 
inside it there is the data validation of the requested data and calling api methods and functions

## TODO LIST
 1. Generate payment links for using the card in another page
 2. add more securitites for dealing with the data link encryption of the data in the api# CarmaTechnicalTestBackend
