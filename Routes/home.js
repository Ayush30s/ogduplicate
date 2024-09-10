const { Router } = require("express");
const gymModel = require("../Models/gym");
const userModel = require("../Models/user");
const ShiftModel = require("../Models/shift");
const followModel = require("../Models/follow");

const homeRoute = Router();

const workoutPlan = {
    user: {
        height: 145, // cm
        weight: 40,  // kg
        fitnessGoal: 'Muscle Gain',
        experienceLevel: 'Beginner',
        availableEquipment: 'Dumbbell',
        workoutFrequency: 3, // days per week
        injuriesLimitations: "Pain in left leg, can't lift heavy weights"
    },
    workoutDays: [
        {
            day: 'Day 1',
            focus: 'Upper Body (Chest, Shoulders, Triceps)',
            exercises: [
                {
                    name: 'Dumbbell Bench Press',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Chest, Triceps'
                },
                {
                    name: 'Dumbbell Row',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Back, Biceps'
                },
                {
                    name: 'Dumbbell Shoulder Press',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Shoulders, Triceps'
                },
                {
                    name: 'Dumbbell Bicep Curls',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Biceps'
                },
                {
                    name: 'Dumbbell Tricep Extensions',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Triceps'
                }
            ]
        },
        {
            day: 'Day 2',
            focus: 'Lower Body (Leg-Friendly) and Core',
            exercises: [
                {
                    name: 'Seated Dumbbell Leg Extensions',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Quadriceps'
                },
                {
                    name: 'Dumbbell Deadlifts',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Hamstrings, Glutes'
                },
                {
                    name: 'Glute Bridges',
                    sets: 3,
                    reps: '15',
                    focus: 'Glutes, Lower Back'
                },
                {
                    name: 'Standing Calf Raises (Bodyweight)',
                    sets: 3,
                    reps: '15-20',
                    focus: 'Calves'
                },
                {
                    name: 'Dumbbell Russian Twists',
                    sets: 3,
                    reps: '15-20 (each side)',
                    focus: 'Core, Obliques'
                }
            ]
        },
        {
            day: 'Day 3',
            focus: 'Full Body',
            exercises: [
                {
                    name: 'Dumbbell Squats (Bodyweight or Light Dumbbells)',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Quads, Glutes'
                },
                {
                    name: 'Dumbbell Chest Flyes',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Chest'
                },
                {
                    name: 'Dumbbell Shoulder Lateral Raises',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Shoulders'
                },
                {
                    name: 'Dumbbell Hammer Curls',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Biceps'
                },
                {
                    name: 'Dumbbell Overhead Tricep Extensions',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Triceps'
                }
            ]
        }
    ],
    additionalNotes: [
        'Warm-Up: 5-10 minutes of light cardio or dynamic stretching',
        'Cool-Down: 5-10 minutes of static stretching',
        'Rest Between Sets: 60-90 seconds',
        'Progress by gradually increasing the weight as strength improves, but prioritize form and safety.',
        'Avoid exercises that heavily strain the injured leg; focus on proper form and use lighter weights if necessary.'
    ]
};


homeRoute.get("/", async (req, res) => {
    const userId = req.user._id;
    const {msg} = req.query;
    
    try {
        // Fetch all gyms with the joinedby array populated
        const allGyms = await gymModel.find({}).populate('joinedby.user').exec();
        console.log(allGyms);

        const currentuser = await gymModel.findById(userId);
        let gymNotJoined = [];

        //if you are owner then show all gyms except yours
        if(currentuser) {
            allGyms.forEach((gym) => {
                if(gym._id.toString() != userId) {
                    gymNotJoined.push(gym);
                }
            });
        } else {
            //if you are user show all the gyms you have not joined
            gymNotJoined = [];
            allGyms.forEach((gym) => {
                // Check if the user is in the joinedby array
                let hasJoined;
                if(gym.joinedby.length > 0) {
                    hasJoined = gym.joinedby.some(join => join.user._id.toString() === userId.toString());
                }
                
                if (!hasJoined) {
                    gymNotJoined.push(gym);
                }
            });
        }

        console.log(gymNotJoined)
        return res.render("landing", {
            allgyms: gymNotJoined,
            user: req.user,
            msg: msg
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
            success: success,
            msg: req.query.msg
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
            })
            .populate("shifts");
                
        if(!Mygymdata) {
            return res.redirect("/home?msg=You do not have ownership of any gym. Please use a different ID to register a new gym.");
        }

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
                const userId = joined._id.toString();
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

    let userData = await userModel.findById(id)
        .populate("joinedgym")
        .populate("followData")
        .populate("phy")

    if (!userData) {
        return res.redirect(`/home/gym/${id}`);
    }

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

    let userFollowMe = false;
    if(followData?.following?.includes(req.user._id)) {
        userFollowMe = true;
    }

    let showFollowButton = true;
    if (id === req.user._id) {
        showFollowButton = false;
    }

    userData = await userModel.findById(id)
        .populate("joinedgym")
        .populate("followData")
        .populate("phy")

    let {usertype} = userData;

    // Check if the logged-in user has joined the gym (if the profile is of a gym)
    let showjoinedgym = false;
    if (usertype === "OWNER" && userData) {
        // Check if the logged-in user has joined this gym
        showjoinedgym = userData.joinedby.some(joined => joined.user.toString() === req.user._id.toString());
    }
   
    return res.render("profile", {
        userData: userData,
        user: req.user,
        usertype: usertype,
        showjoinedgym: showjoinedgym,
        showFollowButton: showFollowButton,
        followingOrNot: followingOrNot,
        followersCount: followersCount,
        followingCount: followingCount,
        userFollowMe:userFollowMe
    });
    
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

    const shiftData = await ShiftModel.find({
        members: members,
        sex: sex, 
        limit: limit, 
        starttime: starttime, 
        endtime: endtime
    });

    console.log("found: ",shiftData);

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
homeRoute.post("/edit-gym/:gymId/:shiftId", async (req, res) => {
    const { gymId, shiftId } = req.params;
    const { members, sex, limit, starttime, endtime } = req.body;

    if(gymId != req.user._id) {
        return res.send("Invalid Request");
    }

    try {
        // Use shiftId directly, not wrapped in an object
        const data = await ShiftModel.findByIdAndUpdate(
            shiftId, 
            {
                $set: {
                    members: members,
                    sex: sex, 
                    limit: limit, 
                    starttime: starttime, 
                    endtime: endtime
                }
            },
            { new: true } // This option returns the updated document
        );

        console.log(data);
        return res.redirect(`/home/gym/${gymId}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while updating the shift.");
    }
});


homeRoute.get("/gym/:gymId/join-shift/:shiftId", async (req, res) => {
    const userId = req.user._id.toString();
    const { shiftId, gymId } = req.params;
    let msg;

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

            // if user is trying to get into another shift
            // 1st check if the limit is not exceeded
            // Remove user from the current shift if exists
            // Add user to the new shift
            const data = await ShiftModel.findById(shiftId);
            const { limit } = data;

            if(limit > data.joinedby.length) {
                if (currentShift) {
                    await ShiftModel.findByIdAndUpdate(
                        currentShift._id,
                        { $pull: { joinedby: userId } }
                    );
                }

                await ShiftModel.findByIdAndUpdate(
                    shiftId,
                    { $push: { joinedby: userId } }
                );
            } else {
                msg = "limit is full in this shift"
            }
        }
        if(msg != undefined) {
            return res.redirect(`/home/gym/${gymId}?msg=${msg}`)
        } else {
            return res.redirect(`/home/gym/${gymId}?success=${"Shift joined successfully"}`);
        }
        
    } catch (error) {
        console.error("Error joining shift:", error);
        return res.status(500).send("Internal Server Error");
    }
});


homeRoute.get("/profile/shiftdetail/:gymId/:shiftId", async (req, res) => {
    try {
        //avoid problem of user trying to get access of other gym owner shift details using their id in url
        const { shiftId, gymId } = req.params;
        if(req.user._id != gymId) {
            return res.status(404).send("Invalid Request"); 
        }

        //avoid problem of  , owner trying to get access of other owners shift details
        const gymData = await gymModel.findById(gymId).populate("shifts");
        if(!gymData) {
            return res.status(404).send("Invalid Request");
        } 

        let shiftDetail;
        gymData.shifts.forEach((shift) => {
            if(shift._id == shiftId) {
                shiftDetail = shift;
            }
        })

        //the owner is trying to access a shift that dosen't exists
        if(!shiftDetail) {
            return res.status(404).send("Invalid Request");
        }

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
            user: req.user,
            gymId: gymId
        });
    } catch (error) {
        console.error("Error fetching shift details:", error);
        return res.status(500).send("Internal Server Error");
    }
});

homeRoute.get("/profile/:userId/workoutplan", async(req,res) => {
    const workoutPlan = {
        user: {
            height: 145, // cm
            weight: 40,  // kg
            fitnessGoal: 'Muscle Gain',
            experienceLevel: 'Beginner',
            availableEquipment: 'Dumbbell',
            workoutFrequency: 3, // days per week
            injuriesLimitations: "Pain in left leg, can't lift heavy weights"
        },
        workoutDays: [
            {
                day: 'Day 1',
                focus: 'Upper Body (Chest, Shoulders, Triceps)',
                exercises: [
                    {
                        name: 'Dumbbell Bench Press',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Chest, Triceps'
                    },
                    {
                        name: 'Dumbbell Row',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Back, Biceps'
                    },
                    {
                        name: 'Dumbbell Shoulder Press',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Shoulders, Triceps'
                    },
                    {
                        name: 'Dumbbell Bicep Curls',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Biceps'
                    },
                    {
                        name: 'Dumbbell Tricep Extensions',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Triceps'
                    }
                ]
            },
            {
                day: 'Day 2',
                focus: 'Lower Body (Leg-Friendly) and Core',
                exercises: [
                    {
                        name: 'Seated Dumbbell Leg Extensions',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Quadriceps'
                    },
                    {
                        name: 'Dumbbell Deadlifts',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Hamstrings, Glutes'
                    },
                    {
                        name: 'Glute Bridges',
                        sets: 3,
                        reps: '15',
                        focus: 'Glutes, Lower Back'
                    },
                    {
                        name: 'Standing Calf Raises (Bodyweight)',
                        sets: 3,
                        reps: '15-20',
                        focus: 'Calves'
                    },
                    {
                        name: 'Dumbbell Russian Twists',
                        sets: 3,
                        reps: '15-20 (each side)',
                        focus: 'Core, Obliques'
                    }
                ]
            },
            {
                day: 'Day 3',
                focus: 'Full Body',
                exercises: [
                    {
                        name: 'Dumbbell Squats (Bodyweight or Light Dumbbells)',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Quads, Glutes'
                    },
                    {
                        name: 'Dumbbell Chest Flyes',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Chest'
                    },
                    {
                        name: 'Dumbbell Shoulder Lateral Raises',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Shoulders'
                    },
                    {
                        name: 'Dumbbell Hammer Curls',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Biceps'
                    },
                    {
                        name: 'Dumbbell Overhead Tricep Extensions',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Triceps'
                    }
                ]
            }
        ],
        additionalNotes: [
            'Warm-Up: 5-10 minutes of light cardio or dynamic stretching',
            'Cool-Down: 5-10 minutes of static stretching',
            'Rest Between Sets: 60-90 seconds',
            'Progress by gradually increasing the weight as strength improves, but prioritize form and safety.',
            'Avoid exercises that heavily strain the injured leg; focus on proper form and use lighter weights if necessary.'
        ]
    };

    //get data from chat gpt in the above format about the exercise for the user and render it on the page
    return res.render("dailyworkoutplan", { 
        workoutPlan: workoutPlan,
        user: req.user
    })
})


homeRoute.get("/workout-day/:index", async(req,res) => {
    const {index} = req.params;
    return res.render("workoutday", {
        workoutDays: workoutPlan.workoutDays[index-1],
        day: Number(index)
    });
})

homeRoute.get("/workout-day/:day/workout/:index/:exercisename", async(req,res) => {
    const { day, index, exercisename } = req.params;
    console.log("exerciseName:", typeof(day), index, exercisename)
    let dayindex = Number(day)
    console.log((dayindex))

    let exerciseObj;

    workoutPlan.workoutDays.forEach((day) => {
        day.exercises.forEach((exercise) => {
            if(exercise.name == exercisename) {
                exerciseObj = exercise;
            }
        })
    })

    //make a call to chatgpt which will give data about that "exerciseObj"
    return res.render("exercisepage", {
        exerciseObj: exerciseObj
    });
})

homeRoute.post("/profile/shiftdetail/update/:shiftId", async(req,res) => {
    const {shiftId} = req.params;
    const { limit, starttime, endtime } = req.body;
    const newshiftData = await ShiftModel.findByIdAndUpdate(
        { shiftId },
        { 
            limit: limit,
            starttime: starttime,
            endtime: endtime
        }
    )

    console.log(newshiftData);
})

module.exports = {
    homeRoute
}

  
