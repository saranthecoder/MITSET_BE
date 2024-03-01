import jwt from 'jsonwebtoken';

const generateTokenSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.cookie("jwt", token, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    // Send the token in the response as well
   // res.status(200).json({ token });
}

export default generateTokenSetCookie;
