import mongoose, { Schema, SchemaType } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  // url
            required: true,
        },
        coverImage: {
            type: String,  // url
        },
        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String,
        }
    }, 
    {
        timestamps: true,
    }
)

/*
- bcrypt is used for hashing of password
- mongoose provide hook pre to do something extra modification before the user sends the data
- the pre hook has many use-cases one of them is save that is do some modification in the data before it is saved in the database
*/

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) return next(); // if the field is not modified then get out

    this.password = bcrypt.hash(this.password, 10) // this method will only run when the password is modified
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)    
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )   
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )  
}

export const User = mongoose.model("User", userSchema)
