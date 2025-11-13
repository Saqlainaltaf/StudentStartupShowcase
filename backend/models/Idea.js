// backend/models/Idea.js
import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },                 // startup name
  logoUrl: { type: String },                               // optional logo/image URL
  founders: { type: String },                              // names + year/program (free text)
  contact: {                                              // contact info or link
    email: String,
    phone: String,
    form: String
  },
  supportingDocument: {
  url: String,
  filename: String,
  originalName: String,
  size: Number,
  resource_type: String
},

  shortDescription: String,                                // 1-2 sentence blurb
  problemStatement: String,
  solution: String,
  currentStage: { type: String, enum: ["Ideation","Prototype","MVP","Market-ready"], default: "Ideation" },
  teamMembers: String,                                     // names, roles
  skillsNeeded: [String],                                  // array of strings
  achievements: String,                                    // traction, awards, metrics
  mentor: String,
  callToAction: String,                                    // e.g. "Join this Startup", or contact CTA
  category: String,
  documentUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending","approved"], default: "pending" },
  featured: { type: Boolean, default: false },             // <-- new: for carousel/spotlight
  createdAt: { type: Date, default: Date.now }
});

// after schema definition (below export)
ideaSchema.index({
  title: "text",
  shortDescription: "text",
  problemStatement: "text",
  solution: "text",
  founders: "text",
  teamMembers: "text",
  achievements: "text",
});


export default mongoose.model("Idea", ideaSchema);
