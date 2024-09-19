const { Router } = require("express");
const gymModel = require("../Models/gym");
const userModel = require("../Models/user");
const ShiftModel = require("../Models/shift");
const followModel = require("../Models/follow");

const followRoute = Router();

// followRoute.post("/user/:user_id", async (req, res) => {
//     const userToFollow = req.params.user_id;
//     const currentUser = req.user._id;

//     const currentUserData = await userModel.findById(currentUser);
//     if(currentUserData == null) {
//         return res.redirect(`/home/profile/${userToFollow}`);
//     }

//     if (!userToFollow || !currentUser) {
//         return res.status(404).send("User Not Found");
//     }

//     let followed = false;
//     try {
//         // Find or create the follow document for the current user
//         let currentUserFollowData = await followModel.findOne({ _id: currentUser });
//         if (!currentUserFollowData) {
//             currentUserFollowData = new followModel({ _id: currentUser });
//         }
        
//         // Add the user to follow to the current user's following list
//         if (!currentUserFollowData.following.includes(userToFollow)) {
//             currentUserFollowData.following.push(userToFollow);
//             await currentUserFollowData.save();
//         } else {
//             currentUserFollowData.following.pull(userToFollow);
//             await currentUserFollowData.save();
//         }

//         // Find or create the follow document for the user to be followed
//         let userToFollowFollowData = await followModel.findOne({ _id: userToFollow });
//         if (!userToFollowFollowData) {
//             userToFollowFollowData = new followModel({ _id: userToFollow });
//         }

//         // Add the current user to the user-to-follow's followers list
//         if (!userToFollowFollowData.followers.includes(currentUser)) {
//             userToFollowFollowData.followers.push(currentUser);
//             await userToFollowFollowData.save();
//         } else {
//             userToFollowFollowData.followers.pull(currentUser);
//             await userToFollowFollowData.save();
//         }

//         return res.redirect(`/home/profile/${userToFollow}`);
//     } catch (error) {
//         console.error("Error following user:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// });

followRoute.post(`/unfollow/user/:user_Id` , async (req, res) => {
    const {user_Id} = req.params;
    const userId = req.user._id;

    console.log(user_Id,  " ", userId);

    const prfilefollowData = await followModel.findById(user_Id);
    console.log(prfilefollowData);

    prfilefollowData.followers.pull(userId);
    await prfilefollowData.save();

    const loginUserFollowData = await followModel.findById(userId);
    loginUserFollowData.following.pull(user_Id);
    await loginUserFollowData.save();

    return res.redirect(`/home/profile/${user_Id}`);
})

followRoute.post('/follow/user/:user_Id', async (req, res) => {
    const { user_Id } = req.params;
    const userId = req.user._id;

    try {
        // Find the follow document for the profile user being followed
        let profileUserData = await followModel.findById(user_Id);
        
        if (profileUserData) {
            // If the profile user's follow document exists, add the logged-in user to their followers
            if (!profileUserData.followers.includes(userId)) {
                profileUserData.followers.push(userId);
                await profileUserData.save();
            }
        } else {
            // If the profile user's follow document doesn't exist, create it
            profileUserData = new followModel({ _id: user_Id, followers: [userId] });
            await profileUserData.save();
        }

        // Find the follow document for the logged-in user
        let loginUserFollowData = await followModel.findById(userId);

        if (loginUserFollowData) {
            // If the logged-in user's follow document exists, add the profile user to their following
            if (!loginUserFollowData.following.includes(user_Id)) {
                loginUserFollowData.following.push(user_Id);
                await loginUserFollowData.save();
            }
        } else {
            // If the logged-in user's follow document doesn't exist, create it
            loginUserFollowData = new followModel({ _id: userId, following: [user_Id] });
            await loginUserFollowData.save();
        }

        // Send a success response
        return res.redirect(`/home/profile/${user_Id}`);

    } catch (error) {
        console.error("Error following user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

followRoute.get(`/user/followingList/:user_id`, async (req, res) => {
    try {
        const { user_id } = req.params;
        const userId = req.user._id;

        console.log(user_id, userId);

        // Fetch the follow data for the user
        const FollowData = await followModel.findById(user_id);
        let followingMeOrNot = false;

        console.log(FollowData)

        // If no follow data is found or if the following list is empty
        if (!FollowData || FollowData.following.length == 0) {
            return res.render("FollowingList", {
                followingUsers: [],
                user: req.user,
                msg: "You are currently not following anyone."
            })
        }

        // Check if the current user is trying to view their own following list
        if (userId != user_id) {

            // Check if the logged-in user follows the user being viewed
            if (userId == user_id || FollowData.following.includes(userId.toString())) {
                followingMeOrNot = true;
            }

            // If the current user does not follow the user specified by user_id
            if (!followingMeOrNot) {
                return res.redirect(`/home/profile/${user_id}`);
            }
        }

        // Fetch profile data for all users in the following list
        const followingUsers = FollowData.following;
        const dataForFollowingPage = await Promise.all(followingUsers.map(async (followedUserId) => {
            // Fetch user data for each user in the following list
            let data = await userModel.findById(followedUserId);
            if(!data) {
                data = await gymModel.findById(followedUserId);
            }
            return data;
        }));

        return res.render("FollowingList", {
            followingUsers: dataForFollowingPage,
            user: req.user
        });
    } catch (error) {
        console.error("Error fetching following list:", error);
        return res.status(500).send("Internal Server Error");
    }
});
followRoute.get("/user/followersList/:user_id", async (req, res) => {
    try {
        const userId = req.user._id;
        const { user_id } = req.params;

        // Fetch follow data for the specified user
        const userFollowData = await followModel.findById(user_id);

        console.log(userFollowData)

        // If no follow data is found or if the following list is empty
        if (!userFollowData || userFollowData.followers.length == 0) {
            return res.render("FollowersList", {
                userFollowersData: [],
                user: req.user,
                msg: "You don't have any Followers"
            });
        }

        if (userId != user_id) {
            // If follow data is not found or no followers
            if (!userFollowData || userFollowData.followers.length === 0) {
                return res.redirect(`/home/profile/${user_id}`);
            }

            let followingMeOrNot = false;

            // Check if the current user follows the user specified by user_id
            if (userFollowData.following.includes(userId.toString())) {
                followingMeOrNot = true;
            }

            // If the current user does not follow the user specified by user_id
            if (!followingMeOrNot) {
                return res.redirect(`/home/profile/${user_id}`);
            }
        }

        // Fetch all user data for the followers list
        const userFollowList = userFollowData.followers;
        const userFollowersData = await Promise.all(
            userFollowList.map(async (followerId) => {
                // Fetch profile data for each follower
                let data = await userModel.findById(followerId);
                if(!data) {
                    data = await gymModel.findById(followerId);
                }
                return data;
            })
        );

        return res.render("FollowersList", {
            userFollowersData,
            user: req.user
        });
    } catch (err) {
        console.error("Error fetching followers list:", err);
        return res.status(500).send("Server Error");
    }
});

module.exports = followRoute;