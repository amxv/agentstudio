# Scripts

This directory contains utility scripts for managing the application.

## create-user.ts

A script to create new user accounts while signups are disabled.

### Usage

```bash
# Create user with auto-generated password
npm run create-user user@example.com

# Create user with specific password
npm run create-user user@example.com mypassword123

# Show help
npm run create-user --help
```

### Features

- ✅ Creates users while signups are disabled
- ✅ Validates email format
- ✅ Checks for existing users
- ✅ Auto-generates secure passwords if not provided
- ✅ Uses the same password hashing as the main application
- ✅ Provides clear success/error messages

### Examples

```bash
# Create a user with a random password
$ npm run create-user john@example.com
✅ User created successfully!
📧 Email: john@example.com
🔑 Password: abc123def456
💡 A random password was generated. Make sure to share it with the user.

# Create a user with a specific password
$ npm run create-user jane@example.com mypassword
✅ User created successfully!
📧 Email: jane@example.com
🔑 Password: mypassword
💡 User can now sign in with the provided credentials
```

### Error Handling

The script will exit with an error if:

- No email is provided
- Email format is invalid
- User already exists
- Database connection fails
