const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title : {type: String, required: true },
    description: { type: String, required: true },
    body : {type : String , required : true},
    covers: { type: [String], required: true },
    href: { type: String, required: true },
    categoryID: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });


const model = mongoose.model("Article", schema)

module.exports = model
