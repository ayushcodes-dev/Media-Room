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
            collectionName: "sessions"
        }),

        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: Number.parseInt(process.env.SESSION_AGE)
        }
    });
}

export default Handlesession;
