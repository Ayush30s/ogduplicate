const { Router } = require("express");
const gymModel = require("../Models/gym");
const userModel = require("../Models/user");
const ShiftModel = require("../Models/shift");
const followModel = require("../Models/follow");

const homeRoute = Router();

homeRoute.get("/", async (req, res) => {
    const userId = req.user._id;
    
    try {
        // Fetch all gyms with the joinedby array populated
        const allGyms = await gymModel.find({}).populate('joinedby.user').exec();  
        const gymNotJoined = [];

        allGyms.forEach((gym) => {
            // Check if the user is in the joinedby array
            const hasJoined = gym.joinedby.some(join => join.user._id.toString() === userId.toString());
            
            if (!hasJoined) {
                gymNotJoined.push(gym);
            }
        });

        return res.render("landing", {
            allgyms: gymNotJoined,
            user: req.user,
        });
    } catch (error) {
        console.error("Error fetching gyms:", error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/joinedgyms", async(req,res) => {
    const userId = req.user._id;
    let mygyms = await userModel.findById(userId).populate("joinedgym");

    if(!mygyms)
        mygyms = await gymModel.findById(userId).populate("joinedgym");

    
    if(mygyms?.joinedgym?.length == 0) {
        return res.render("joinedgyms", {
            msg: "You don't have joined any gym",
            user: req.user
        })
    }

    return res.render("joinedgyms", {
        mygyms: mygyms?.joinedgym,
        user: req.user
    });
});

homeRoute.get("/gym/:gymId", async (req, res) => {
    
    const {success} = req.query;
    const userId = req.user._id;
    const { gymId } = req.params;

    // If the owner tries to access their own gym, redirect to /home/mygyms
    if (userId == gymId) {
        return res.redirect("/home/mygyms");
    }

    try {
        const gymData = await gymModel.findById(gymId)
            .populate({
                path: 'joinedby.user', // Populate the user field inside joinedby
            })
            .populate('shifts');

        if (!gymData) {
            return res.status(404).send("Gym not found");
        }

        // Check if the user is in the joinedby list
        let isUserJoined;
        let joinedDate;
        let daysLeftToMonth = 0;
        gymData.joinedby.some((joined) => {
            if(`${joined.user._id}` === `${userId}`) {
                isUserJoined = true
                joinedDate = joined.joinedAt.getDate()
            }
        });
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
        const day = currentDate.getDate().toString().padStart(2, '0');
        const daysInMonth = new Date(year, month, 0).getDate() + 1;
        daysLeftToMonth = daysInMonth - Number(day) - Number(joinedDate);
        

        // Determine if the user has joined any shift
        let shiftJoined = -1;
        if (isUserJoined && gymData.shifts.length > 0) {
            gymData.shifts.forEach((shift, index) => {
                shift.joinedby.forEach(user_id => {
                    if (`${user_id}` === `${userId}`) {
                        shiftJoined = index;
                    }
                });
            });
        }

        return res.render("gympage", {
            gymData: gymData,
            user: req.user,
            flag: isUserJoined,
            shiftJoined: shiftJoined + 1,
            daysLeftToMonth: daysLeftToMonth,
            success: success
        });
    } catch (error) {
        console.error("Error fetching gym data:", error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/:gymId/joingym", async (req, res) => {
    const { gymId } = req.params;
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId);
        let gymData = await gymModel.findById(gymId)
            .populate({
                path: 'joinedby.user',
            })
            .populate("shifts");

        // If the user does not exist, prevent joining if the user is an owner
        if (!user) {
            return res.render("gympage", {
                gymData: gymData,
                user: req.user,
                msg: "You can't join, if you are an owner of any Gym, use another Id!",
                shiftJoined: null
            });
        }

        // Check if the user has already joined the gym
        const isUserJoined = gymData.joinedby.some(joined => `${joined.user._id}` === `${userId}`);

        // If the user has not joined the gym
        if (!isUserJoined) {
            // Add the user to the gym's joinedby array
            const result = await gymModel.findByIdAndUpdate(
                gymId,
                { $push: { joinedby: { user: userId, joinedAt: new Date() } } },
                { new: true } // Return the updated document
            );

            if (!result) {
                return res.status(404).send("Gym not found");
            }

            // Add the gym to the user's joinedgym array
            await userModel.findByIdAndUpdate(
                userId,
                { $push: { joinedgym: gymId } }
            );
        }

        return res.redirect(`/home/gym/${gymId}?success="Congratulations you have joined the gym successfully"`);

    } catch (error) {
        console.error("Error joining gym:", error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/mygyms", async (req, res) => {
    try {
        // Fetch the gym data associated with the user
        const Mygymdata = await gymModel.findById(req.user._id)
            .populate({
                path: 'joinedby.user',
                select: '_id' // Only fetch user IDs
            })
            .populate("shifts");


        // Check if the gym ID matches the user ID
        let gymIdSameUserId = false;
        if (Mygymdata._id.toString() === req.user._id.toString()) {
            gymIdSameUserId = true;
        }

        // Create a Map to store user ID to shift index mapping
        const userToshiftMap = new Map();

        Mygymdata.shifts.forEach((shift, shiftIndex) => {
            shift.joinedby.forEach((joined) => {
                // joined is an object with user field
                const userId = joined.user.toString();
                userToshiftMap.set(userId, shiftIndex + 1);
            });
        });

        return res.render("mygympage", {
            gymData: Mygymdata,
            user: req.user,
            gymIdSameUserId: gymIdSameUserId,
            userToshiftMap: userToshiftMap
        });

    } catch (error) {
        console.error("Error fetching gym data:", error);
        return res.status(500).send("Internal Server Error");
    }
});


homeRoute.get("/profile/:userId", async (req, res) => {
    const id = req.params.userId;

    if (!id) {
        return res.render("home", {
            msg: "Register to use"
        });
    }

    let followersCount = 0;
    let followingCount = 0;
    let followingOrNot = "Follow";
    const followData = await followModel.findById(id);

    if (!followData) {
        followersCount = 0;
        followingCount = 0;
    } else {
        followersCount = followData.followers.length;
        followingCount = followData.following.length;

        if (followData.followers.includes(req.user._id)) {
            followingOrNot = "Following";
        } else if (followData.followRequests.includes(req.user._id)) {
            followingOrNot = "Requested";
        }
    }

    let showFollowButton = true;
    if (id === req.user._id) {
        showFollowButton = false;
    }

    let userData = await userModel.findById(id);

    if (!userData) {
        userData = await gymModel.findById(id)
            .populate({
                path: 'joinedby.user',
                select: '_id' // Only fetch user IDs
            });
    }

    let usertype = userData?.usertype;

    // Check if the logged-in user has joined the gym (if the profile is of a gym)
    let showjoinedgym = false;
    if (usertype === "OWNER" && userData) {
        // Check if the logged-in user has joined this gym
        showjoinedgym = userData.joinedby.some(joined => joined.user.toString() === req.user._id.toString());
    }

    if (usertype === "OWNER") {
        return res.redirect(`/home/gym/${id}`);
    } else {
        return res.render("profile", {
            userData: userData,
            user: req.user,
            usertype: usertype,
            showjoinedgym: showjoinedgym,
            showFollowButton: showFollowButton,
            followingOrNot: followingOrNot,
            followersCount: followersCount,
            followingCount: followingCount
        });
    }
});

homeRoute.get("/:gymId/leavegym", async (req, res) => {
    const gymId = req.params.gymId;
    const userId = req.user._id;

    try {
        // Remove user from the gym's joinedby array
        await gymModel.findOneAndUpdate(
            { _id: gymId },
            { $pull: { joinedby: { user: userId } } } // Adjusted to match the new schema structure
        );

        // Retrieve the gym's shifts
        const gymData = await gymModel.findById(gymId).populate('shifts');

        if (gymData && gymData.shifts) {
            // Iterate over each shift and remove the user
            for (let shift of gymData.shifts) {
                await ShiftModel.findOneAndUpdate(
                    { _id: shift._id },
                    { $pull: { joinedby: userId } } // Assuming ShiftModel has a similar structure
                );
            }
        }

        // Remove gym from the user's joinedgym array
        await userModel.updateOne(
            { _id: userId },
            { $pull: { joinedgym: gymId } }
        );

        return res.redirect(`/home/gym/${gymId}`);
    } catch (error) {
        console.error('Error leaving gym:', error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/about", async(req,res) => {
    return res.render("about", {
        user: req.user
    });
})

homeRoute.post("/update-profile/:userId", async (req, res) => {
    const { fullname, contactnumber, bio } = req.body;
    const { userId } = req.params;  // Correctly extract userId from params

    // Ensure that the user is updating their own profile
    if (req.user._id.toString() !== userId) {
        return res.redirect(`/home/profile/${userId}`);
    }

    // Fetch user or gym data based on user type
    let data = await userModel.findById(userId);
    if (!data) {
        data = await gymModel.findById(userId);
    }

    if (!data) {
        return res.status(404).send("User or Gym not found");
    }

    // Determine user type and update accordingly
    const usertype = data.usertype;
    if (usertype === "OWNER") {
        const updates = {
            fullname: fullname,
            contactnumber: contactnumber,
            description: bio
        };

        await gymModel.updateOne(
            { _id: userId },
            { $set: updates }
        );
    } else {
        const updates = {
            fullname: fullname,
            contactnumber: contactnumber,
            bio: bio
        };

        await userModel.updateOne(
            { _id: userId },
            { $set: updates }
        );
    }

    return res.redirect(`/home/profile/${userId}`);
});


homeRoute.post("/edit-gym/:gymId", async (req, res) => {
    const { gymId } = req.params;
    const { members, sex, limit, starttime, endtime } = req.body;

    try {
        // Create a new shift
        const shift = await ShiftModel.create({
            members,
            sex,
            limit,
            starttime,
            endtime
        });

        const shiftId = shift._id;

        // Add the created shift to the gym's shifts array
        await gymModel.findByIdAndUpdate(
            { _id: gymId },
            { $push: { shifts: shiftId } }
        );


        return res.redirect("/home/mygyms");
    } catch (error) {
        console.error("Error creating or updating shift:", error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/gym/:gymId/join-shift/:shiftId", async (req, res) => {
    const userId = req.user._id.toString();
    const { shiftId, gymId } = req.params;

    try {
        let gymData = await gymModel.findById(gymId)
            .populate("joinedby")
            .populate("shifts");


        // Check if the user has joined the gym
        let userJoinedOrNot = false;
        gymData.joinedby.some(user => {
            if(user.user._id.toString() === userId) {
                userJoinedOrNot = true;
            }
        });

        if (userJoinedOrNot) {
            let currentShift = null;

            // Find if the user has already joined any shift
            for (let shift of gymData.shifts) {
                if (shift.joinedby.some(user => user._id.toString() === userId)) {
                    currentShift = shift;
                    break;
                }
            }

            // If user is trying to join the same shift, no need to update anything
            if (currentShift && currentShift._id.toString() === shiftId) {
                return res.redirect(`/home/gym/${gymId}`);
            }

            // Remove user from the current shift if exists
            if (currentShift) {
                await ShiftModel.findByIdAndUpdate(
                    currentShift._id,
                    { $pull: { joinedby: userId } }
                );
            }

            // Add user to the new shift
            await ShiftModel.findByIdAndUpdate(
                shiftId,
                { $push: { joinedby: userId } }
            );
        }

        return res.redirect(`/home/gym/${gymId}`)
    } catch (error) {
        console.error("Error joining shift:", error);
        return res.status(500).send("Internal Server Error");
    }
});


homeRoute.get("/profile/shiftdetail/:shiftId", async (req, res) => {
    try {
        const { shiftId } = req.params;
        const shiftDetail = await ShiftModel.findById(shiftId);

        const userDetailPromises = shiftDetail.joinedby.map(async (user_id) => {
            const userdata = await userModel.findById(user_id);
            return {
                img: userdata.profileImage,
                _id: userdata._id,
                name: userdata.fullname
            };
        });

        const userDetail = await Promise.all(userDetailPromises);

        return res.render("shiftpage", {
            shiftDetail: shiftDetail,
            userDetail: userDetail,
            user: req.user
        });
    } catch (error) {
        console.error("Error fetching shift details:", error);
        return res.status(500).send("Internal Server Error");
    }
});


// homeRoute.post("/user/follow/:user_id", async (req, res) => {
//     const userToFollow = req.params.user_id;
//     const currentUser = req.user._id;

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

// homeRoute.get(`/user/followingList/:user_id`, async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         const userId = req.user._id;

//         const FollowData = await followModel.findById(user_id);
//         let followingMeOrnot = false;

//         // If no following model is initialized yet for this user or if the model created by the followers but the following is empty
//         if (!FollowData || FollowData.following.length == 0) {
//             return res.redirect(`/home/profile/${user_id}`);
//         } else {
//             //check if the user on which profile we are viweing is following me or not
//             // const followersDataofLoggineduser = await followModel.findById(userId)
//             if(userId == user_id) {
//                 followingMeOrnot = true;
//             }
//             else if(FollowData.following.includes((userId).toString())) {
//                 followingMeOrnot = true;
//             }
//         }

//         // If the current user does not follow the user specified by user_id
//         if (!followingMeOrnot) {
//             return res.redirect(`/home/profile/${user_id}`);
//         }

//         const followingUsers = FollowData.following;

//         // Use Promise.all to wait for all user data to be fetched
//         const dataForFollowingPage = await Promise.all(followingUsers.map(async (user_id) => {
//             const profileUserData = await userModel.findById(user_id);
//             return profileUserData;
//         }));

//         return res.render("FollowingList", {
//             followingUsers: dataForFollowingPage,
//             user: req.user
//         });
//     } catch (error) {
//         console.error("Error fetching following list:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// });
// homeRoute.get("/user/followersList/:user_id", async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { user_id } = req.params;

//         const userFollowData = await followModel.findById(user_id);
//         if (!userFollowData || userFollowData.followers.length === 0) {
//             return res.redirect(`/home/profile/${user_id}`);
//         }

//         let followingMeOrNot = false;

//         // Check if the current user follows the user specified by user_id
//         if (user_id.toString() === userId.toString() || userFollowData.following.includes(userId.toString())) {
//             followingMeOrNot = true;
//         }

//         // If the current user does not follow the user specified by user_id
//         if (!followingMeOrNot) {
//             return res.redirect(`/home/profile/${user_id}`);
//         }

//         const userFollowList = userFollowData.followers;

//         // Fetch all user data for the followers list
//         const userFollowersData = await Promise.all(
//             userFollowList.map(async (followerId) => {
//                 const profileUserData = await userModel.findById(followerId);
//                 return profileUserData;
//             })
//         );

//         return res.render("FollowersList", {
//             userFollowersData,
//             user: req.user
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Server Error");
//     }
// });

module.exports = {
    homeRoute
}

  
