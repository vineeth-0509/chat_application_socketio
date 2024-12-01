import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res)=>{
    try {
        const loggedInUsersId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUsersId}}).select("-password");
        //finding the allUsers from the database and notequal to the loggedInUsersId , except the userIs we are getting the users from the database
        res.status(200).json(filteredUsers);

        
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({
            error: "Internal server error"
        })
    }
};