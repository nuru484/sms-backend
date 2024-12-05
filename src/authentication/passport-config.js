import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from '../../prismaClient.js';

const initialize = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'credential',
        passwordField: 'password',
      },
      async (credential, password, done) => {
        try {
          // Check if the credential is an email or username
          const isEmail = credential.includes('@');

          // Find user by email or username
          const user = await prisma.user.findUnique({
            where: isEmail ? { email: credential } : { username: credential },
          });

          // If user is not found
          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          // Compare the password with bcrypt
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: 'Invalid credentials' });
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
    done(null, user.id);
  });

  // Deserialize user (retrieve user from session)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
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

export default initialize;
