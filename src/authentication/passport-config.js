const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialize = (passport) => {
  // Define the local strategy for Passport.js
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          // If user is not found
          if (!user) {
            return done(null, false, { message: 'Incorrect email' });
          }

          // Compare the password with bcrypt
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: 'Incorrect password' });
          }

          // Successful login
          return done(null, user);
        } catch (err) {
          console.error('Error in authentication:', err);
          return done(err, false, {
            message: 'An error occurred during authentication',
          });
        }
      }
    )
  );

  // Serialize user (store user ID in session)
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in the session
  });

  // Deserialize user (retrieve user from session)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      return done(null, user);
    } catch (err) {
      console.error('Error in deserialization:', err);
      return done(err, false, {
        message: 'An error occurred during user deserialization',
      });
    }
  });
};

module.exports = initialize;
