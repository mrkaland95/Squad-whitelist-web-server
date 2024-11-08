// import * as mongoose from "mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";


export interface IUser extends Document {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    Whitelist64IDs: { steamID: string; name?: string }[];
    AdminRole64ID?: string;
    Enabled: boolean;
}
export interface IAPIKeys extends Document {

}


/**
 *
 */
export const userSchema = new mongoose.Schema<IUser>({
    DiscordID: { type: String, unique: true, required: true },
    DiscordName: { type: String, required: true },
    Roles: { type: [String], required: true },
    Whitelist64IDs: [
        {
            steamID: { type: String, required: true },
            name: { type: String, required: false },
        },
    ],
    AdminRole64ID: { type: String, required: false },
    Enabled: { type: Boolean, required: true },
    }, {
        timestamps: true
});

