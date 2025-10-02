import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "admin",
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("user", UserSchema);
User.createIndexes(); // this is done so remove duplicacy when uniqueness is provided
export default User;