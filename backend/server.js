const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

const connectSocket = require("./socketServer");
const connectToDatabase = require("./dbConnections");
const userRoute = require("./authentication/userRoute");
const feedRoute = require("./Feed/feedRoute");
const commentRoute = require("./comments/commentRoute");
const likeRoute = require("./like/likeRouter");
const imageRoute = require("./Images/imageRoute");
// const UserModel = require("./authentication/userModel");
// const FeedModel = require("./Feed/feedModel");
// const CommentModel = require("./comments/commentModel");

const app = express();
const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(`false: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(userRoute);
app.use(feedRoute);
app.use(commentRoute);
app.use(likeRoute);
app.use(imageRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const socketServer = connectSocket.connectSocketServer(server);
socketServer.on("connection", (socket) => {

});

// syncTable(user, { force: true });
// associationOneToMany(UserModel, FeedModel, { onDelete: "CASCADE" });
// associationOneToMany(UserModel, CommentModel);
// associationOneToMany(FeedModel, CommentModel, { onDelete: "CASCADE" });

// sequelize.sync();

connectToDatabase();
