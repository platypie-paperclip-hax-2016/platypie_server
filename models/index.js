const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    password: String,
    displayName: String,
    summary: String,
    fbId: String,
    enrolledAt: [{
        startYear: Number,
        endYear: Number,
        university: {type: Schema.Types.ObjectId, ref: 'University'},
        major: {type: Schema.Types.ObjectId, ref: 'Major'}
    }],
    City: {type: Schema.Types.ObjectId, ref: 'City'}
})

const UniversitySchema = new Schema({
    name: String,
    majors: [{type: Schema.Types.ObjectId, ref: 'Major'}],
    applicationDeadline: Date,
    city: {type: Schema.Types.ObjectId, ref: 'City'},
    rank: Number
})

const MajorSchema = new Schema({
    name: String,
    wikiUrl: String,
    courses: [String]
})

const IndustrySchema = new Schema({
    name: String,
    wikiUrl: String,
    summary: String,
    majors: [{type: Schema.Types.Object, ref: 'Major'}],
    jobs: [String]
})

const CitySchema = new Schema({
    name: String,
    wikiUrl: String,
    industries: [{type: Schema.Types.Object, ref: 'Industry'}],
    latlng: String,
    country: String
})

exports.User = mongoose.model('User', UserSchema)
exports.University = mongoose.model('University', UniversitySchema)
exports.Major = mongoose.model('Major', MajorSchema)
exports.Industry = mongoose.model('Industry', IndustrySchema)
exports.City = mongoose.model('City', CitySchema)
