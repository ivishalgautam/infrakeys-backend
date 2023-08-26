passport.use(
  new GoogleStrategy(
    {
      clientID: "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database based on their email
        const existingUser = await db.oneOrNone(
          "SELECT * FROM users WHERE email = $1",
          [profile.emails[0].value]
        );

        if (existingUser) {
          // User already exists, pass the user data to the callback
          return done(null, existingUser);
        } else {
          // User doesn't exist, insert a new record into the users table
          const newUser = await db.one(
            "INSERT INTO users (fullname, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [
              profile.displayName,
              profile.emails[0].value,
              "user",
              new Date(),
              new Date(),
            ]
          );
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
