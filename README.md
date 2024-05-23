SpamGuard
SpamGuard is a web application designed to help users identify and manage spam contacts efficiently. With SpamGuard, users can search for contacts by name or phone number, mark contacts as spam, and view detailed information about each contact.

Features
Search Contacts: Users can search for contacts by name or phone number.
Mark as Spam: Users can mark contacts as spam to help filter unwanted communication.
Detailed Contact Information: Users can view detailed information about each contact, including name, phone number, spam status, and email (if available).
Installation
To install SpamGuard, follow these steps:

Clone the repository:
git clone https://github.com/adityapal1748/spamster.git


Navigate to the project directory:
cd spamster

Install dependencies:
npm install
Set up environment variables:

Create a .env file in the project root directory.
Define the following environment variables in the .env file:
makefile
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
Run the application:
npm start

Usage
Search Contacts: Use the search feature to find contacts by name or phone number.
Mark as Spam: To mark a contact as spam, select the contact and choose the "Mark as Spam" option.
View Contact Details: Click on a contact to view detailed information, including spam status and email (if available).
Populate Data

The project includes a feature to populate the database with sample data for testing purposes. To populate the database, run the following command:
npm run populate-data
This command will generate random user and contact data and add it to the database.
