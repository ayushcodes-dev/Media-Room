import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

function Handlesession() {
  
    return session({
      secret: "supersecretkey",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: "sessions",
      }),

      cookie: {
        httpOnly: true, // process.env.DEPLOYMENT === "production",
        secure: process.env.NODE_ENV === "production", // process.env.DEPLOYMENT === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: Number.parseInt(process.env.SESSION_AGE),
      },
    });
}

export default Handlesession;
