import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import foodPartnerModel from '../models/foodpartner.model.js';

export async function registerUser(req, res) {
    try {
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const isUserAlreadyExists = await userModel.findOne({email});

        if(isUserAlreadyExists) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({fullName, email, password: hashedPassword});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export async function loginUser(req, res) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.cookie("token",token)
        res.status(200).json({
            message:"login successfully",
            user:{
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            },
        })


    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({message:"logout successful"});
}

export async function registerFoodPartner(req, res) {
    try {
      const { name, phone, address , contactName , email, password } = req.body;
  
      // 1. Check if account already exists
      const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
      if (isAccountAlreadyExists) {
        return res.status(400).json({
          message: "Food Partner account already exists",
        });
      }
  
      // 2. Hash password properly
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 3. Create food partner with HASHED password
      const foodpartner = await foodPartnerModel.create({
        name,
        email,
        address,
        contactName,
        phone,
        password: hashedPassword,
      });
  
      // 4. Generate JWT
      const token = jwt.sign(
        { id: foodpartner._id },
        "aq+5UOA[E.AA>{C^",
      );
  
      // 5. Set token in HTTP-only cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(201)
        .json({
          message: "Food Partner registered successfully",
          foodpartner: {
            _id: foodpartner._id,
            name: foodpartner.name,
            email: foodpartner.email,
            address: foodpartner.address,
            contactName: foodpartner.contactName,
            phone: foodpartner.phone,
          },
        });
  
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
}
  
export async function loginFoodPartner(req, res) {
    try {
      const { email, password } = req.body;
  
      // 1. Find food partner by email
      const foodpartner = await foodPartnerModel.findOne({ email });
      if (!foodpartner) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
  
      // 2. Compare passwords
      const isPasswordValid = await bcrypt.compare(password, foodpartner.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
  
      // 3. Generate JWT
      const token = jwt.sign(
        { id: foodpartner._id },
        "aq+5UOA[E.AA>{C^",
      );
  
      // 4. Set token in HTTP-only cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(200)
        .json({
          message: "Food Partner logged in successfully",
          foodpartner: {
            _id: foodpartner._id,
            name: foodpartner.name,
            email: foodpartner.email,
          },
        });
  
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
}

  export async function logoutFoodPartner(req,res){
    res.clearCookie('token');
    res.status(200).json({message:"Food Partner logout successful"});
}
