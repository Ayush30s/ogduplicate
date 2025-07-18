const equipmentCategories = {
  "Strength Training": [
    "Adjustable Dumbbells",
    "Ankle Weights",
    "Arm Blaster",
    "Barbell Clamps",
    "Barbell Curl Bar",
    "Barbell Pad",
    "Barbells",
    "Bench Presses",
    "Cable Attachments",
    "Cable Machines",
    "Calf Machines",
    "Chains (Weightlifting)",
    "Decline Benches",
    "Dip Bars",
    "Dumbbell Racks",
    "Dumbbells",
    "Ez Curl Bars",
    "Flat Benches",
    "Glute Ham Developers",
    "Grip Strengtheners",
    "Hack Squat Machines",
    "Hammer Strength Machines",
    "Incline Benches",
    "Jammer Arms",
    "Kettlebells",
    "Landmine Attachments",
    "Lat Pulldown Machines",
    "Leg Curl Machines",
    "Leg Extension Machines",
    "Leg Press Machines",
    "Leverage Machines",
    "Multi-Station Gyms",
    "Olympic Bars",
    "Olympic Rings",
    "Parallel Bars",
    "Plate Loaded Machines",
    "Power Racks",
    "Preacher Curl Benches",
    "Pull-Up Bars",
    "Pulley Systems",
    "Resistance Bands",
    "Reverse Hyper Machines",
    "Safety Squat Bars",
    "Smith Machines",
    "Squat Racks",
    "Standing Calf Machines",
    "Swiss Bars",
    "T-Bar Row Handles",
    "Trap Bars",
    "Triceps Bars",
    "Utility Benches",
    "Weight Plates",
    "Weight Trees",
    "Weighted Vests",
    "Wrist Rollers",
    "Wrist Weights",
    "Other",
  ],
  "Cardio Equipment": [
    "Air Bikes",
    "Assault Bikes",
    "Climbing Ropes",
    "Curved Treadmills",
    "Ellipticals",
    "Exercise Bikes",
    "Hydraulic Rowing Machines",
    "Jacobs Ladder",
    "Manual Treadmills",
    "Recumbent Bikes",
    "Rowing Machines",
    "SkiErgs",
    "Spin Bikes",
    "Stair Climbers",
    "Stairmasters",
    "Stationary Bikes",
    "Step Machines",
    "Treadmill Desks",
    "Treadmills",
    "Upper Body Ergometers",
    "VersaClimbers",
    "Water Rowers",
    "Other",
  ],
  "Functional Training / CrossFit": [
    "Ab Mats",
    "Agility Ladders",
    "Balance Boards",
    "Battle Ropes",
    "Box Jumps",
    "Bulgarian Bags",
    "Climbing Walls",
    "Cones (Training)",
    "Farmer's Walk Handles",
    "GHD Machines",
    "Gymnastic Rings",
    "Hurdles",
    "Indian Clubs",
    "Jump Boxes",
    "Kegs (Training)",
    "Log Bars",
    "Medicine Balls",
    "Monkey Bars",
    "Parallettes",
    "Plyo Boxes",
    "Prowlers",
    "Pull-Up Rig",
    "Reaction Balls",
    "Rope Climbing Anchors",
    "Sandbags",
    "Sleds & Push Carts",
    "Slosh Pipes",
    "Speed Ladders",
    "Suspension Trainers",
    "Tire Flips",
    "Training Tires",
    "TRX Systems",
    "Wall Balls",
    "Weight Sleds",
    "Wreck Bags",
    "Yoke Carry Bars",
    "Other",
  ],
  "Flexibility & Recovery": [
    "Acupressure Mats",
    "Balance Cushions",
    "Compression Boots",
    "Foam Rollers",
    "Handheld Massagers",
    "Hyperice Products",
    "Lacrosse Balls",
    "Massage Chairs",
    "Massage Guns",
    "Massage Tables",
    "Mobility Bands",
    "Muscle Rollers",
    "Percussion Massagers",
    "Resistance Loops",
    "Stretching Machines",
    "Stretching Straps",
    "Theragun",
    "Vibration Plates",
    "Yoga Blocks",
    "Yoga Bolsters",
    "Yoga Mats",
    "Yoga Straps",
    "Yoga Wheels",
    "Other",
  ],
  Accessories: [
    "Arm Sleeves",
    "Belt Buckles",
    "Chalk",
    "Chalk Bags",
    "Collars (Barbell)",
    "Deadlift Jacks",
    "Dip Belts",
    "Elbow Sleeves",
    "Finger Tape",
    "Fractional Plates",
    "Gloves & Grips",
    "Grip Pads",
    "Gym Bags",
    "Gym Towels",
    "Hand Grippers",
    "Hook Grip Tape",
    "Jump Ropes",
    "Knee Sleeves",
    "Lifting Belts",
    "Lifting Hooks",
    "Lifting Straps",
    "Liquid Chalk",
    "Microplates",
    "Neoprene Pads",
    "Plyometric Boxes",
    "Powerlifting Wraps",
    "Quick Locks",
    "Resistance Bands",
    "Safety Straps",
    "Shoe Covers",
    "Speed Ropes",
    "Spud Inc Straps",
    "Straps (Lifting)",
    "Tape (Athletic)",
    "Training Logs",
    "Water Bottles",
    "Whiprsnapper Straps",
    "Wrist Wraps",
    "Other",
  ],
  "Gym Infrastructure": [
    "Audio Systems",
    "Barbell Storage",
    "Battle Rope Anchors",
    "Ceiling Mounts",
    "Chalk Stations",
    "Climbing Rope Anchors",
    "Dumbbell Racks",
    "Fans / Ventilation",
    "Floor Mats",
    "Gym Signs",
    "Heating Systems",
    "Intercom Systems",
    "Kettlebell Racks",
    "LED Lighting",
    "Lockers",
    "Mirrors",
    "Plate Trees",
    "Power Towers",
    "Rubber Flooring",
    "Safety Platforms",
    "Scoreboards",
    "Shelving Units",
    "Showers",
    "Sound Systems",
    "Speaker Systems",
    "Storage Racks",
    "TV Mounts",
    "Turf",
    "Wall Mounts",
    "Weight Plate Holders",
    "Whiteboards",
    "Other",
  ],
  "Boxing & MMA": [
    "Boxing Gloves",
    "Boxing Rings",
    "Body Protectors",
    "Focus Mitts",
    "Grappling Dummies",
    "Headgear",
    "Heavy Bags",
    "Jump Ropes",
    "Kick Pads",
    "MMA Gloves",
    "Muay Thai Pads",
    "Punching Bags",
    "Referee Equipment",
    "Ring Ropes",
    "Speed Bags",
    "Standing Bags",
    "Strike Shields",
    "Tae Kwon Do Pads",
    "Training Dummies",
    "Other",
  ],
  Rehabilitation: [
    "Balance Discs",
    "Blood Flow Restriction Bands",
    "Bosu Balls",
    "CPM Machines",
    "Crutches",
    "Elastic Bandages",
    "Exercise Balls",
    "Gait Belts",
    "Hand Therapy Putty",
    "Inversion Tables",
    "Kinesiology Tape",
    "Neck Traction",
    "Parallel Bars",
    "Pedal Exercisers",
    "Posture Correctors",
    "Pulleys (Rehab)",
    "Resistance Tubes",
    "Shoulder Pulleys",
    "Stability Balls",
    "TENS Units",
    "Therapy Bands",
    "Tilt Tables",
    "Walkers",
    "Wobble Boards",
    "Other",
  ],
  "Sports Training": [
    "Agility Poles",
    "Baseball Bats",
    "Basketball Hoops",
    "Catching Nets",
    "Field Markers",
    "Football Dummies",
    "Golf Simulators",
    "Hockey Training Aids",
    "Juggling Balls",
    "Lacrosse Rebounders",
    "Pitching Machines",
    "Rebound Nets",
    "Soccer Cones",
    "Sports Nets",
    "Tennis Ball Machines",
    "Throwing Nets",
    "Training Hurdles",
    "Volleyball Nets",
    "Other",
  ],
  "Aquatic Fitness": [
    "Aqua Bells",
    "Aquatic Dumbbells",
    "Aquatic Exercise Bars",
    "Aquatic Gloves",
    "Aquatic Noodles",
    "Buoyancy Belts",
    "Floating Mats",
    "Pool Dumbbells",
    "Pool Fitness Equipment",
    "Resistance Paddles",
    "Swim Belts",
    "Swim Fins",
    "Water Aerobics Equipment",
    "Water Weights",
    "Other",
  ],
  "Technology & Tracking": [
    "Body Composition Scales",
    "Fitness Trackers",
    "GPS Watches",
    "Gym Management Software",
    "Heart Rate Monitors",
    "Rep Counting Devices",
    "Smart Benches",
    "Smart Dumbbells",
    "Smart Jump Ropes",
    "Smart Mirrors",
    "Smart Racks",
    "Speed Sensors",
    "VR Fitness Systems",
    "Wearable Tech",
    "Other",
  ],
  "Outdoor Fitness": [
    "Calisthenics Bars",
    "Climbing Frames",
    "Exercise Stations",
    "Outdoor Gym Equipment",
    "Park Fitness Equipment",
    "Pull-Up Stations",
    "Street Workout Equipment",
    "Trail Fitness Signs",
    "Workout Parks",
    "Other",
  ],
  Others: [
    "Animal Flow Equipment",
    "Arm Wrestling Tables",
    "Belt Squat Machines",
    "Branded Merchandise",
    "Breathing Trainers",
    "Custom Equipment",
    "Grip Strength Tools",
    "Gym Decor",
    "Miscellaneous",
    "Powerlifting Platforms",
    "Strongman Equipment",
    "Trampolines",
    "Tug of War Ropes",
    "Vibration Machines",
    "Other",
  ],
};

const equipments = [
  "Ab Mats",
  "Acupressure Mats",
  "Adjustable Dumbbells",
  "Agility Ladders",
  "Agility Poles",
  "Air Bikes",
  "Ankle Weights",
  "Animal Flow Equipment",
  "Aqua Bells",
  "Aquatic Dumbbells",
  "Aquatic Exercise Bars",
  "Aquatic Gloves",
  "Aquatic Noodles",
  "Arm Blaster",
  "Arm Sleeves",
  "Arm Wrestling Tables",
  "Assault Bikes",
  "Audio Systems",
  "Balance Boards",
  "Balance Cushions",
  "Balance Discs",
  "Barbell Clamps",
  "Barbell Curl Bar",
  "Barbell Pad",
  "Barbell Storage",
  "Barbells",
  "Baseball Bats",
  "Basketball Hoops",
  "Battle Rope Anchors",
  "Battle Ropes",
  "Belt Buckles",
  "Belt Squat Machines",
  "Bench Presses",
  "Blood Flow Restriction Bands",
  "Body Composition Scales",
  "Body Protectors",
  "Bosu Balls",
  "Box Jumps",
  "Boxing Gloves",
  "Boxing Rings",
  "Branded Merchandise",
  "Breathing Trainers",
  "Bulgarian Bags",
  "Buoyancy Belts",
  "Cable Attachments",
  "Cable Machines",
  "Calf Machines",
  "Calisthenics Bars",
  "Catching Nets",
  "Ceiling Mounts",
  "Chains (Weightlifting)",
  "Chalk",
  "Chalk Bags",
  "Chalk Stations",
  "Climbing Frames",
  "Climbing Rope Anchors",
  "Climbing Ropes",
  "Climbing Walls",
  "Collars (Barbell)",
  "Compression Boots",
  "Cones (Training)",
  "CPM Machines",
  "Crutches",
  "Curved Treadmills",
  "Custom Equipment",
  "Decline Benches",
  "Deadlift Jacks",
  "Dip Bars",
  "Dip Belts",
  "Dumbbell Racks",
  "Dumbbells",
  "Elastic Bandages",
  "Elbow Sleeves",
  "Ellipticals",
  "Exercise Balls",
  "Exercise Bikes",
  "Exercise Stations",
  "Ez Curl Bars",
  "Farmer's Walk Handles",
  "Fans / Ventilation",
  "Field Markers",
  "Finger Tape",
  "Flat Benches",
  "Floating Mats",
  "Floor Mats",
  "Foam Rollers",
  "Focus Mitts",
  "Football Dummies",
  "Fractional Plates",
  "Gait Belts",
  "GHD Machines",
  "Gloves & Grips",
  "Glute Ham Developers",
  "Golf Simulators",
  "GPS Watches",
  "Grappling Dummies",
  "Grip Pads",
  "Grip Strengtheners",
  "Grip Strength Tools",
  "Gymnastic Rings",
  "Gym Bags",
  "Gym Decor",
  "Gym Management Software",
  "Gym Signs",
  "Gym Towels",
  "Hack Squat Machines",
  "Hammer Strength Machines",
  "Hand Grippers",
  "Hand Therapy Putty",
  "Handheld Massagers",
  "Headgear",
  "Heating Systems",
  "Heavy Bags",
  "Hook Grip Tape",
  "Hockey Training Aids",
  "Hurdles",
  "Hyperice Products",
  "Hydraulic Rowing Machines",
  "Incline Benches",
  "Indian Clubs",
  "Intercom Systems",
  "Inversion Tables",
  "Jacobs Ladder",
  "Jammer Arms",
  "Jump Boxes",
  "Jump Ropes",
  "Kegs (Training)",
  "Kettlebell Racks",
  "Kettlebells",
  "Kick Pads",
  "Kinesiology Tape",
  "Knee Sleeves",
  "Lacrosse Balls",
  "Lacrosse Rebounders",
  "Landmine Attachments",
  "Lat Pulldown Machines",
  "LED Lighting",
  "Leg Curl Machines",
  "Leg Extension Machines",
  "Leg Press Machines",
  "Leverage Machines",
  "Lifting Belts",
  "Lifting Hooks",
  "Lifting Straps",
  "Liquid Chalk",
  "Lockers",
  "Log Bars",
  "Manual Treadmills",
  "Massage Chairs",
  "Massage Guns",
  "Massage Tables",
  "Medicine Balls",
  "Microplates",
  "Mirrors",
  "Miscellaneous",
  "Mobility Bands",
  "MMA Gloves",
  "Monkey Bars",
  "Muay Thai Pads",
  "Multi-Station Gyms",
  "Muscle Rollers",
  "Neck Traction",
  "Neoprene Pads",
  "Olympic Bars",
  "Olympic Rings",
  "Outdoor Gym Equipment",
  "Parallel Bars",
  "Parallettes",
  "Park Fitness Equipment",
  "Pedal Exercisers",
  "Percussion Massagers",
  "Pitching Machines",
  "Plate Loaded Machines",
  "Plate Trees",
  "Plyo Boxes",
  "Plyometric Boxes",
  "Pool Dumbbells",
  "Pool Fitness Equipment",
  "Posture Correctors",
  "Power Racks",
  "Power Towers",
  "Powerlifting Platforms",
  "Powerlifting Wraps",
  "Preacher Curl Benches",
  "Prowlers",
  "Pull-Up Bars",
  "Pull-Up Rig",
  "Pull-Up Stations",
  "Pulleys (Rehab)",
  "Pulley Systems",
  "Punching Bags",
  "Quick Locks",
  "Reaction Balls",
  "Rebound Nets",
  "Recumbent Bikes",
  "Referee Equipment",
  "Resistance Bands",
  "Resistance Loops",
  "Resistance Paddles",
  "Resistance Tubes",
  "Reverse Hyper Machines",
  "Ring Ropes",
  "Rope Climbing Anchors",
  "Rowing Machines",
  "Rubber Flooring",
  "Safety Platforms",
  "Safety Squat Bars",
  "Safety Straps",
  "Sandbags",
  "Scoreboards",
  "Shelving Units",
  "Showers",
  "Shoe Covers",
  "Shoulder Pulleys",
  "SkiErgs",
  "Sleds & Push Carts",
  "Slosh Pipes",
  "Smith Machines",
  "Soccer Cones",
  "Sound Systems",
  "Speaker Systems",
  "Speed Bags",
  "Speed Ladders",
  "Speed Ropes",
  "Speed Sensors",
  "Spin Bikes",
  "Sports Nets",
  "Squat Racks",
  "Stability Balls",
  "Stair Climbers",
  "Stairmasters",
  "Standing Bags",
  "Standing Calf Machines",
  "Stationary Bikes",
  "Step Machines",
  "Storage Racks",
  "Street Workout Equipment",
  "Strength Training",
  "Stretching Machines",
  "Stretching Straps",
  "Strongman Equipment",
  "Strike Shields",
  "Suspension Trainers",
  "Swim Belts",
  "Swim Fins",
  "Swiss Bars",
  "T-Bar Row Handles",
  "Tae Kwon Do Pads",
  "Tape (Athletic)",
  "TENS Units",
  "Tennis Ball Machines",
  "Theragun",
  "Therapy Bands",
  "Throwing Nets",
  "Tilt Tables",
  "Tire Flips",
  "Trampolines",
  "Training Dummies",
  "Training Hurdles",
  "Training Logs",
  "Training Tires",
  "Trap Bars",
  "TRX Systems",
  "Treadmill Desks",
  "Treadmills",
  "Tug of War Ropes",
  "Turf",
  "TV Mounts",
  "Upper Body Ergometers",
  "Utility Benches",
  "Vibration Machines",
  "Vibration Plates",
  "VersaClimbers",
  "VR Fitness Systems",
  "Volleyball Nets",
  "Walkers",
  "Wall Balls",
  "Wall Mounts",
  "Water Aerobics Equipment",
  "Water Rowers",
  "Water Weights",
  "Wearable Tech",
  "Weight Plate Holders",
  "Weight Plates",
  "Weight Sleds",
  "Weight Trees",
  "Weighted Vests",
  "Whiteboards",
  "Whiprsnapper Straps",
  "Wobble Boards",
  "Workout Parks",
  "Wreck Bags",
  "Wrist Rollers",
  "Wrist Weights",
  "Wrist Wraps",
  "Yoga Blocks",
  "Yoga Bolsters",
  "Yoga Mats",
  "Yoga Straps",
  "Yoga Wheels",
  "Yoke Carry Bars",
  "Other",
];

const indianStatesLoksabhaConstituencies = {
  "Andhra Pradesh": [
    "Adilabad (ST)",
    "Bhongir",
    "Chevella",
    "Guntur",
    "Hyderabad",
    "Khammam",
    "Kurnool",
    "Medak",
    "Malkajgiri",
    "Mahbubnagar",
    "Mahabubabad (ST)",
    "Medak",
    "Nalgonda",
    "Nagarkurnool (SC)",
    "Nellore",
    "Nizamabad",
    "Peddapalle (SC)",
    "Rajahmundry",
    "Secunderabad",
    "Visakhapatnam",
    "Warangal (SC)",
    "Zahirabad",
  ],
  "Arunachal Pradesh": [
    "Arunachal East",
    "Arunachal West",
  ],
  Assam: [
    "Autonomous District (ST)",
    "Barpeta",
    "Barpeta Road",
    "Bongaigaon",
    "Dhubri",
    "Dibrugarh",
    "Guwahati",
    "Jorhat",
    "Karimganj (SC)",
    "Kokrajhar (ST)",
    "Lakhimpur",
    "Mangaldoi",
    "Nowgong",
    "Silchar",
    "Tezpur",
  ],
  Bihar: [
    "Arrah",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Buxar",
    "Darbhanga",
    "Gaya",
    "Jamui",
    "Jahanabad",
    "Karakat",
    "Khagaria",
    "Madhepura",
    "Madhubani",
    "Muzaffarpur",
    "Nawada",
    "Patna Sahib",
    "Pataliputra",
    "Purnia",
    "Sasaram",
    "Samastipur",
    "Saran",
    "Sitamarhi",
    "Ujiarpur",
    "Vaishali",
    "Valmiki Nagar",
  ],
  Chhattisgarh: [
    "Bastar (ST)",
    "Bilaspur",
    "Durg",
    "Janjgir-Champa",
    "Korba",
    "Raigarh (ST)",
    "Raipur",
    "Rajnandgaon",
    "Surguja (ST)",
  ],
  Goa: [
    "North Goa",
    "South Goa",
  ],
  Gujarat: [
    "Ahmedabad East",
    "Ahmedabad West",
    "Amreli",
    "Anand",
    "Bardoli",
    "Banaskantha",
    "Bhavnagar",
    "Chhota Udaipur",
    "Dahod",
    "Gandhinagar",
    "Jamnagar",
    "Junagadh",
    "Kachchh",
    "Mahesana",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani-Mahendragarh",
    "Faridabad",
    "Gurgaon",
    "Hisar",
    "Karnal",
    "Kurukshetra",
    "Rohtak",
    "Sirsa",
    "Sonipat",
  ],
  "Himachal Pradesh": [
    "Hamirpur",
    "Kangra",
    "Mandi",
    "Shimla",
  ],
  Jharkhand: [
    "Chatra",
    "Dhanbad",
    "Dumka (ST)",
    "Giridih",
    "Godda",
    "Jamshedpur",
    "Kodarma",
    "Khunti (ST)",
    "Lohardaga (ST)",
    "Palamau (SC)",
    "Rajmahal (ST)",
    "Ranchi",
  ],
  Karnataka: [
    "Bagalkot",
    "Belgaum",
    "Bangalore Central",
    "Bangalore North",
    "Bangalore Rural",
    "Bangalore South",
    "Bijapur",
    "Chamarajanagar",
    "Chitradurga",
    "Chikkaballapur",
    "Chikkodi",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Hassan",
    "Haveri",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysore",
    "Raichur",
    "Shimoga",
    "Tumkur",
    "Udupi Chikmagalur",
    "Uttara Kannada",
  ],
  Kerala: [
    "Alappuzha",
    "Alathur",
    "Attingal",
    "Chalakudy",
    "Chennai South",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Malappuram",
    "Mavelikkara",
    "Pathanamthitta",
    "Ponnani",
    "Thrissur",
    "Vatakara",
    "Wayanad",
  ],
  "Madhya Pradesh": [
    "Balaghat",
    "Bhopal",
    "Chhindwara",
    "Damoh",
    "Dewas",
    "Dhar",
    "Guna",
    "Gwalior",
    "Indore",
    "Jabalpur",
    "Khajuraho",
    "Khargone",
    "Mandsaur",
    "Mandla",
    "Morena",
    "Mughalsarai",
    "Pali",
    "Rewa",
    "Ratlam",
    "Sagar",
    "Satna",
    "Shahdol",
    "Sidhi",
    "Tikamgarh",
    "Ujjain",
    "Vidisha",
  ],
  Maharashtra: [
    "Akola",
    "Amravati",
    "Aurangabad",
    "Baramati",
    "Bhiwandi",
    "Bhandara-Gondiya",
    "Beed",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli-Chimur",
    "Hingoli",
    "Kolhapur",
    "Latur",
    "Mumbai North",
    "Mumbai North Central",
    "Mumbai North West",
    "Mumbai South",
    "Mumbai South Central",
    "Nagpur",
    "Nashik",
    "Nanded",
    "Osmanabad",
    "Parbhani",
    "Pune",
    "Raigad",
    "Sangli",
    "Satara",
    "Shirdi",
    "Shirur",
    "Solapur",
    "Thane",
    "Wardha",
    "Yavatmal-Washim",
  ],
  Manipur: [
    "Inner Manipur",
    "Outer Manipur",
  ],
  Meghalaya: [
    "Shillong",
    "Tura",
  ],
  Mizoram: [
    "Mizoram",
  ],
  Nagaland: [
    "Nagaland",
  ],
  Odisha: [
    "Aska",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Bhubaneswar",
    "Cuttack",
    "Dhenkanal",
    "Jajpur",
    "Keonjhar",
    "Koraput",
    "Kendrapara",
    "Mayurbhanj",
    "Nabarangpur",
    "Nowrangpur",
    "Puri",
    "Sambalpur",
    "Sundargarh",
  ],
  Punjab: [
    "Amritsar",
    "Anandpur Sahib",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Firozpur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Khadoor Sahib",
    "Ludhiana",
    "Patiala",
    "Sangrur",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Barmer-Jaisalmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Ganganagar",
    "Jaipur",
    "Jaipur Rural",
    "Jalore",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli-Dholpur",
    "Kota",
    "Nagaur",
    "Pali",
    "Rajsamand",
    "Sikar",
    "Tonk-Sawai Madhopur",
    "Udaipur",
  ],
  Sikkim: [
    "Sikkim",
  ],
  "Tamil Nadu": [
    "Arakkonam",
    "Chennai Central",
    "Chennai North",
    "Chennai South",
    "Coimbatore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Namakkal",
    "Nagapattinam",
    "Nilgiris",
    "Perambalur",
    "Pollachi",
    "Ramanathapuram",
    "Salem",
    "Sivaganga",
    "Thanjavur",
    "Theni",
    "Tenkasi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Tiruvallur",
    "Vellore",
    "Virudhunagar",
    "Villupuram",
    "Chidambaram",
  ],
  Telangana: [
    "Adilabad",
    "Chevella",
    "Hyderabad",
    "Khammam",
    "Kurnool",
    "Mahabubnagar",
    "Medak",
    "Malkajgiri",
    "Nalgonda",
    "Nizamabad",
    "Peddapalle",
    "Rangareddy",
    "Secunderabad",
    "Warangal",
    "Zahirabad",
  ],
  Tripura: [
    "Tripura West",
    "Tripura East",
  ],
  UttarPradesh: [
    "Agra",
    "Aligarh",
    "Amethi",
    "Amroha",
    "Anupshahr",
    "Azamgarh",
    "Ballia",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddh Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hathras",
    "Hazaribagh",
    "Jaunpur",
    "Jhansi",
    "Jalaun",
    "Kheri",
    "Kanpur",
    "Kasganj",
    "Khushinagar",
    "Kushinagar",
    "Lucknow",
    "Mathura",
    "Meerut",
    "Moradabad",
    "Muzaffarnagar",
    "Pratapgarh",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sitapur",
    "Sultanpur",
    "Unnao",
  ],
  Uttarakhand: [
    "Almora",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Tehri Garhwal",
    "Udhamsingh Nagar",
    "Rudraprayag",
  ],
  WestBengal: [
    "Asansol",
    "Bardhaman Purba",
    "Bardhaman-Durgapur",
    "Birbhum",
    "Cooch Behar",
    "Diamond Harbour",
    "Jadavpur",
    "Howrah",
    "Kolkata Dakshin",
    "Kolkata Uttar",
    "Medinipur",
    "Murshidabad",
    "North Howrah",
    "South Howrah",
    "Siliguri",
    "Tamluk",
    "Uluberia",
    "Krishnanagar",
    "Basirhat",
    "Malda",
    "Bankura",
  ],
};


export { equipmentCategories, equipments, indianStatesLoksabhaConstituencies };
