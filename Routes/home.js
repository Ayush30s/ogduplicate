const { Router } = require("express");
const gymModel = require("../Models/gym");
const userModel = require("../Models/user");
const ShiftModel = require("../Models/shift");
const followModel = require("../Models/follow");

const homeRoute = Router();

function getDaysInMonth(year, month) {
    // Month is 0-based: January is 0, February is 1, etc.
    const date = new Date(year, month + 1, 0);
    return date.getDate();
}

function getColorForExerciseTime(time) {
    // Define thresholds (in minutes)
    if (time === 0) {
        return 'bg-gray-200'; // Tailwind's light gray (equivalent to #f0f0f0)
    } else if (time <= 30) {
        return 'bg-blue-200'; // Tailwind's light blue (equivalent to #a8d5e2)
    } else if (time <= 60) {
        return 'bg-blue-500'; // Tailwind's medium blue (equivalent to #47a1c1)
    } else {
        return 'bg-teal-800'; // Tailwind's dark teal (equivalent to #005f73)
    }
}



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
                    focus: 'Chest, Triceps',
                    details: 'Lie on a flat bench holding dumbbells at chest level. Push them upwards while keeping your core tight.',
                    videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/db-bench-press-960x540.jpg'
                },
                {
                    name: 'Dumbbell Row',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Back, Biceps',
                    details: 'Place one knee and one hand on a bench while rowing the dumbbell with the other hand, pulling towards your waist.',
                    videoUrl: 'https://www.youtube.com/watch?v=MEt8zvEoSlA',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/one-arm-dumbbell-row-960x540.jpg'
                },
                {
                    name: 'Dumbbell Shoulder Press',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Shoulders, Triceps',
                    details: 'Sit upright and press dumbbells overhead until your arms are fully extended, then slowly lower them back.',
                    videoUrl: 'https://www.youtube.com/watch?v=B-aVuyhvLHU',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/seated-dumbbell-shoulder-press-960x540.jpg'
                },
                {
                    name: 'Dumbbell Bicep Curls',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Biceps',
                    details: 'Hold a dumbbell in each hand, curl them up to shoulder height, and slowly lower them back.',
                    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-biceps-curl-960x540.jpg'
                },
                {
                    name: 'Dumbbell Tricep Extensions',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Triceps',
                    details: 'Hold a dumbbell overhead with both hands and lower it behind your head, then lift it back up.',
                    videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-overhead-triceps-extension-960x540.jpg'
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
                    focus: 'Quadriceps',
                    details: 'Sit on a chair, place a dumbbell between your feet, and extend your legs out straight, then lower them back.',
                    videoUrl: 'https://www.youtube.com/watch?v=foUbbdz6Klg',
                    imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Seated-Leg-Extensions.jpg'
                },
                {
                    name: 'Dumbbell Deadlifts',
                    sets: 3,
                    reps: '10-12',
                    focus: 'Hamstrings, Glutes',
                    details: 'Hold dumbbells in front of you, keep your back straight, and lower them towards the floor while hinging at the hips.',
                    videoUrl: 'https://www.youtube.com/watch?v=r4MzxtBKyNE',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/romanian-deadlift-960x540.jpg'
                },
                {
                    name: 'Glute Bridges',
                    sets: 3,
                    reps: '15',
                    focus: 'Glutes, Lower Back',
                    details: 'Lie on your back with knees bent and feet flat, push your hips upward while squeezing your glutes, then lower.',
                    videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/glute-bridge-960x540.jpg'
                },
                {
                    name: 'Standing Calf Raises (Bodyweight)',
                    sets: 3,
                    reps: '15-20',
                    focus: 'Calves',
                    details: 'Stand upright and raise your heels off the ground as high as possible, then slowly lower back down.',
                    videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/calf-raise-960x540.jpg'
                },
                {
                    name: 'Dumbbell Russian Twists',
                    sets: 3,
                    reps: '15-20 (each side)',
                    focus: 'Core, Obliques',
                    details: 'Sit on the floor with knees bent, lean back slightly, and twist your torso side to side while holding a dumbbell.',
                    videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/russian-twist-960x540.jpg'
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
                    focus: 'Quads, Glutes',
                    details: 'Hold a dumbbell in each hand or use bodyweight, squat down while keeping your chest up and knees behind your toes.',
                    videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-squat-960x540.jpg'
                },
                {
                    name: 'Dumbbell Chest Flyes',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Chest',
                    details: 'Lie on a flat bench with dumbbells in both hands, extend arms out and then bring them back together above your chest.',
                    videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-chest-flye-960x540.jpg'
                },
                {
                    name: 'Dumbbell Shoulder Lateral Raises',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Shoulders',
                    details: 'Stand upright, raise your arms out to the sides until they are at shoulder height, then lower them back down.',
                    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-lateral-raise-960x540.jpg'
                },
                {
                    name: 'Dumbbell Hammer Curls',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Biceps',
                    details: 'Hold dumbbells with your palms facing each other, curl them up to shoulder level, and slowly lower them.',
                    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-hammer-curl-960x540.jpg'
                },
                {
                    name: 'Dumbbell Overhead Tricep Extensions',
                    sets: 3,
                    reps: '12-15',
                    focus: 'Triceps',
                    details: 'Hold a dumbbell overhead with both hands, lower it behind your head, then lift it back up while keeping your elbows in.',
                    videoUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
                    imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-overhead-triceps-extension-960x540.jpg'
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

        let ratingdone = false;
        gymData.ratedby.forEach((rate) => {
            if(rate.user.toString() == userId) {
                ratingdone = true;
            }
        })

        console.log(ratingdone);

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
        daysLeftToMonth = Number(daysInMonth) - day +  Number(daysInMonth) - (Number(daysInMonth) - Number(joinedDate));

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
            msg: req.query.msg,
            ratingdone: ratingdone
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

        return res.redirect(`/home/gym/${gymId}?success=Congratulations you have joined the gym successfully`);

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

    const monthJoined = userData.createdAt.getMonth();
    const joinedDate = userData.createdAt.getDate();
    const joinedYear = userData.createdAt.getYear();

    const dateObj = {
        "monthJoined": monthJoined,
        "joinedDate": joinedDate,
        "joinedYear": joinedYear
    }

    const today = new Date();
    // const currentMonth = today.getMonth();
    // const dayInCurrentMonth = getDaysInMonth(today.getYear(), today.getMonth());
    // const todattotaltime = 0;

    let exerciseArray = new Array(12);
    let exerciseName = new Map();
    let muscleGroup = new Map(); 

    for(let i = 1; i <= 12; i++) {

        const days = getDaysInMonth(today.getYear(), i);
        exerciseArray[i-1] = new Array(days);

        for(let j = 1; j <= days; j++) {
            let timeExercise = 0;

            userData.workout.forEach((day) => {
                if (exerciseName.has(day.focusPart)) {
                    exerciseName.set(day.focusPart, exerciseName.get(day.focusPart) + 1);  
                } else {
                    exerciseName.set(day.focusPart, 1);  
                }

                if (muscleGroup.has(day.name)) {
                    muscleGroup.set(day.name, muscleGroup.get(day.name) + 1);  
                } else {
                    muscleGroup.set(day.name, 1);  
                }

                if(day.pushedAt.getMonth() == i && day.pushedAt.getDate() == j) {
                    timeExercise += day.time;
                }
            })
            
            exerciseArray[i-1][j-1] = timeExercise;
        }
    }

    //fetching keys and value from map
    const muscles = []
    const muscleCount = []
    const exercise = []
    const exerciseCount = []
    let totalexerciseDone = 0;
    let tottalMuscleTrained = 0;

    exerciseName.forEach((value, key) => {
        totalexerciseDone += value;
    })

    muscleGroup.forEach((value, key) => {
        tottalMuscleTrained += value;
    })

    exerciseName.forEach((value, key) => {
        exerciseCount.push(((value/totalexerciseDone) * 100).toFixed(1));
        exercise.push(key);
    })

    muscleGroup.forEach((value, key) => {
        muscleCount.push(((value/tottalMuscleTrained) * 100).toFixed(1));
        muscles.push(key);
    })

    return res.render("profile", {
        userData: userData,
        user: req.user,
        usertype: usertype,
        showjoinedgym: showjoinedgym,
        showFollowButton: showFollowButton,
        followingOrNot: followingOrNot,
        followersCount: followersCount,
        followingCount: followingCount,
        userFollowMe:userFollowMe,
        exerciseArray: exerciseArray,
        muscles: muscles,
        muscleCount: muscleCount,
        exercise: exercise,
        exerciseCount: exerciseCount,
        totalexerciseDone: totalexerciseDone,
        tottalMuscleTrained: tottalMuscleTrained
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
                        focus: 'Chest, Triceps',
                        details: 'Lie on a flat bench holding dumbbells at chest level. Push them upwards while keeping your core tight.',
                        videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/db-bench-press-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Row',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Back, Biceps',
                        details: 'Place one knee and one hand on a bench while rowing the dumbbell with the other hand, pulling towards your waist.',
                        videoUrl: 'https://www.youtube.com/watch?v=MEt8zvEoSlA',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/one-arm-dumbbell-row-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Shoulder Press',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Shoulders, Triceps',
                        details: 'Sit upright and press dumbbells overhead until your arms are fully extended, then slowly lower them back.',
                        videoUrl: 'https://www.youtube.com/watch?v=B-aVuyhvLHU',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/seated-dumbbell-shoulder-press-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Bicep Curls',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Biceps',
                        details: 'Hold a dumbbell in each hand, curl them up to shoulder height, and slowly lower them back.',
                        videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-biceps-curl-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Tricep Extensions',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Triceps',
                        details: 'Hold a dumbbell overhead with both hands and lower it behind your head, then lift it back up.',
                        videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-overhead-triceps-extension-960x540.jpg'
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
                        focus: 'Quadriceps',
                        details: 'Sit on a chair, place a dumbbell between your feet, and extend your legs out straight, then lower them back.',
                        videoUrl: 'https://www.youtube.com/watch?v=foUbbdz6Klg',
                        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Seated-Leg-Extensions.jpg'
                    },
                    {
                        name: 'Dumbbell Deadlifts',
                        sets: 3,
                        reps: '10-12',
                        focus: 'Hamstrings, Glutes',
                        details: 'Hold dumbbells in front of you, keep your back straight, and lower them towards the floor while hinging at the hips.',
                        videoUrl: 'https://www.youtube.com/watch?v=r4MzxtBKyNE',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/romanian-deadlift-960x540.jpg'
                    },
                    {
                        name: 'Glute Bridges',
                        sets: 3,
                        reps: '15',
                        focus: 'Glutes, Lower Back',
                        details: 'Lie on your back with knees bent and feet flat, push your hips upward while squeezing your glutes, then lower.',
                        videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/glute-bridge-960x540.jpg'
                    },
                    {
                        name: 'Standing Calf Raises (Bodyweight)',
                        sets: 3,
                        reps: '15-20',
                        focus: 'Calves',
                        details: 'Stand upright and raise your heels off the ground as high as possible, then slowly lower back down.',
                        videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/calf-raise-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Russian Twists',
                        sets: 3,
                        reps: '15-20 (each side)',
                        focus: 'Core, Obliques',
                        details: 'Sit on the floor with knees bent, lean back slightly, and twist your torso side to side while holding a dumbbell.',
                        videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/russian-twist-960x540.jpg'
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
                        focus: 'Quads, Glutes',
                        details: 'Hold a dumbbell in each hand or use bodyweight, squat down while keeping your chest up and knees behind your toes.',
                        videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-squat-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Chest Flyes',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Chest',
                        details: 'Lie on a flat bench with dumbbells in both hands, extend arms out and then bring them back together above your chest.',
                        videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-chest-flye-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Shoulder Lateral Raises',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Shoulders',
                        details: 'Stand upright, raise your arms out to the sides until they are at shoulder height, then lower them back down.',
                        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-lateral-raise-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Hammer Curls',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Biceps',
                        details: 'Hold dumbbells with your palms facing each other, curl them up to shoulder level, and slowly lower them.',
                        videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-hammer-curl-960x540.jpg'
                    },
                    {
                        name: 'Dumbbell Overhead Tricep Extensions',
                        sets: 3,
                        reps: '12-15',
                        focus: 'Triceps',
                        details: 'Hold a dumbbell overhead with both hands, lower it behind your head, then lift it back up while keeping your elbows in.',
                        videoUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
                        imageUrl: 'https://www.bodybuilding.com/images/2021/xdb/originals/dumbbell-overhead-triceps-extension-960x540.jpg'
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
    let dayindex = Number(day)
 
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
        exerciseObj: exerciseObj,
        day: day
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

homeRoute.post('/rating/:gymId', async (req, res) => {
    const { gymId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    console.log(" ratingg", rating);
    const gym = await gymModel.findById(gymId);
    console.log(gym);

    if (gym) {

        let present = false;
        gym.ratedby.forEach((rate) => {
            if(rate.user.toString() == userId) {
                present = true;
            }
        })

        if(present) {
            return res.redirect(`/home/gym/${gymId}`);
        }

        // Add the new rating to the `ratedby` array
        gym.ratedby.push({ user: userId, rating: rating });

        // Recalculate average rating
        const totalRatings = gym.ratedby.length;
        const totalScore = gym.ratedby.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalScore / totalRatings;

        console.log(averageRating)

        // Update the gym's average rating
        gym.rating = averageRating;

        // Save the changes
        await gym.save();

        return res.redirect(`/home/gym/${gymId}`);
    } else {
        return res.send("Gym not Found!");
    }
});

homeRoute.post('/exercise/:exercisetype/:focuspart/:day', async (req, res) => {
    try {
        const { exercisetype, focuspart, day } = req.params; // Getting the params for exercise type and focus part
        const { time } = req.body;  // Extracting the workout time from the request body
        const userId = req.user._id;  // Assuming the user is authenticated and the ID is available in req.user

        // Check if the time is a valid number
        if (!time || isNaN(time)) {
            return res.status(400).send('Invalid time provided');
        }

        const workoutEntry = {
            time: parseInt(time),  // Store workout time
            pushedAt: new Date(),
            focusPart: focuspart,
            name: exercisetype 
        };
        

        // Update the user's workout array by pushing the new workout time
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    workout: workoutEntry,
                }
            },
            { new: true }  // Return the updated document
        );

        // If no user was found, return an error
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        let exerciseObj;
        workoutPlan.workoutDays.forEach((day) => {
            day.exercises.forEach((exercise) => {
                if(exercise.name == exercisetype) { 
                    exerciseObj = exercise;
                }
            })
        })

        // Send a success response
        return res.render("exercisepage", {
            exerciseObj: exerciseObj
        });
    } catch (error) {
        console.error("Error updating workout time:", error);
        return res.status(500).send("Internal Server Error");
    }
});


module.exports = {
    homeRoute
}

  
