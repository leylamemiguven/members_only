# Members Only

## Overview

Members Only is a web application that allows users to create an account, join an exclusive club, and post anonymous messages. Members can see the authors of the messages while non-members can only view the content. This project is built using Node.js, Express, and PostgreSQL, and showcases user authentication, role management, and basic CRUD operations.

## Features

- **User Registration**: New users can register and create an account.
![Screenshot (133)](https://github.com/user-attachments/assets/284de9d7-d921-49df-b0fb-418b42c0fd03)
![Screenshot (136)](https://github.com/user-attachments/assets/294b8644-368e-423a-ac3d-a0e760942742)
- **User Login**: Registered users can log in to access exclusive features.
![Screenshot (134)](https://github.com/user-attachments/assets/55e6c991-8848-4ea2-8319-2e311ba2b875)
- **Membership Management**: Users must enter a secret passcode to become members.
![Screenshot (137)](https://github.com/user-attachments/assets/cd34e884-829f-4a9f-bc9b-4b268066eea4)
- **Create Messages**: Logged-in users can create new anonymous messages.
![Screenshot (138)](https://github.com/user-attachments/assets/116b9ce2-cd92-4d25-baa7-9242a4692a28)
- **View Messages**: All users can view messages; only members can see the authors.
![Screenshot (133)](https://github.com/user-attachments/assets/b585dcdf-7411-4912-be02-627c1e6d4b61)
![Screenshot (140)](https://github.com/user-attachments/assets/74d674a1-333e-4eb1-a577-c09bdf523cb8)
- **Admin Controls**: Admin users can delete messages.
- ![Screenshot (135)](https://github.com/user-attachments/assets/02b8a731-c279-4eca-b657-956fd8c08546)


## Tech Stack

- **Frontend**: EJS (Embedded JavaScript), HTML, CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Environment Variables**: dotenv for managing sensitive information

## Installation

### Prerequisites

- Node.js (latest LTS version recommended)
- PostgreSQL (for local development)

### Clone the Repository

```bash
git clone https://github.com/leylamemiguven/members_only.git
cd members_only
```

## Setup Environment Variables

1. Create a `.env` file in the root of your project directory.
2. Add the following variables to the `.env` file:

   ```plaintext
   DB_USER=your_database_username
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_NAME=your_database_name
   DB_PORT=5432
   ```

   
## Install Dependencies

Run the following command to install the necessary packages:

```bash
npm install
```

## Run the Application Locally

To start the application, use the following command:

```bash
node app.js
```

