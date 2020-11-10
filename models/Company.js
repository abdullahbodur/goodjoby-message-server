const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide an username for account"],
    unique: [true, "This username is already taken"],
    lowercase: true,
    match: [
      /^[a-zA-Z0-9]+$/,
      "Username must includes number (0-9), capital (A-Z), lower (a-z)",
    ],
  },

  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "This email is used before"],
    lowercase: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Email type is not supported",
    ],
  },

  job: {
    sector_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Sector",
    },
    positions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "JobInfo",
      },
    ],
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
      "Password must includes symbol,number,capital",
    ],
    select: false,
  },

  sector: {
    type: mongoose.Schema.ObjectId,
    ref: "Sector",
  },

  profile_image: {
    type: String,
    default: "defualtProfile.png",
  },
  background_image: {
    type: String,
    default: "defaultBackground.png",
  },
  bio: {
    type: String,
    maxlength: [150, "Bio must be 150 character or fewer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  completed_works_count: {
    type: Number,
    default: 0,
  },

  rates: [
    {
      name: {
        type: String,
      },
      rate: {
        type: Number,
      },
    },
  ],

  workers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "CompanyWorker",
    },
  ],

  // Worker_count

  role: {
    type: String,
    default: "company",
    enum: ["client", "exper", "company", "admin"],
  },

  token: {
    type: String,
    unique : [true,"This token already taken"]
  },
  tokenExpire: {
    type: Date,
  },

  works: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Work",
    },
  ],

  offers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ExpertRequest",
    },
  ],

  job_announcements: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "JobApplication",
    },
  ],

  blocked: {
    type: Boolean,
    default: false,
  },
});



module.exports = mongoose.model("Company", CompanySchema);
