const prisma = require("../config/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const signupService = async function (userData){
    const {name, email, password} = userData;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existingUser){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    const {password: _, ...safeUser } = user;

    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET
    )

    return {
        message: "Signup service working",
        user: safeUser,
        token
    }
}


const loginService = async function(userData){
    const {email, password} = userData;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        throw new Error("Invalid email or password")
    }

    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET
    )
    const { password: _, ...safeUser} = user

    return {
        message: "Login successful",
        user: safeUser,
        token
    }
}





module.exports = {signupService, loginService}