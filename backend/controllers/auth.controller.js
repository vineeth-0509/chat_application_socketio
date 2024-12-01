import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req, res) => {
	try {
		const { fullName, userName, password, confirmPassword, gender } = req.body;

        if(!userName || userName.trim() === ""){
            return res.status(400).json({
                error:"Username is requried and cannot be empty"
            });
        }
        
        if(!fullName || !password || !confirmPassword || !gender){
            return res.status(400).json({
                error:"All field are required "
            });
        }
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ userName });
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const profilePic = gender == "male"? boyProfilePic: girlProfilePic;

		const newUser = new User({
			fullName,
			userName,
			password: hashedPassword,
			gender,
			profilePic
		});		

        if(newUser){
            //Generating jwt token
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				profilePic: newUser.profilePic,
			});
        }else{
            res.status(400).json({
                error:"Invalid user Data"
            });
        }
	} catch (error) {
		if (error.code === 11000){
            return res.status(400).json({
                error:"Username already exists"
            });
        }
        console.error("Error in signup controller", error.message);
        res.status(500).json({
            error:"Internal server error"
        })
	}
};


export const login = async (req, res)=>{
	try {
		const {userName, password}= req.body;
		const user = await User.findOne({userName});
		const isValidPassword = await bcrypt.compare(password, user?.password || "");
		if(!user || !isValidPassword){
			return res.status(400).json({
				error:"invalid username or password"
			})
		}
		generateTokenAndSetCookie(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			userName: user.userName,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("error in login controller",error.message);
		return res.status(400).json({
			error:"Internal server error"
		})
	}
};

export const logout = async (req,res)=>{
	try {
		res.clearCookie("jwt");
		res.status(500).json({message:"Logged Out successfully"});
		
	} catch (error) {
console.log("Error in logout", error.message);
res.status(500).json({error:"internal server error"});
	}
}