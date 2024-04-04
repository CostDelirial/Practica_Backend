import mongoose,  { Schema } from "mongoose";  


const musicSchema: Schema = new Schema ({
   
    diskId: {type: Number},
    bandName: { type: String },
    diskName: { type: String }, 
    gender: { type: String, enum: ['Rock', 'Metal', 'Pop', 'Indie'] },
    format: { type: String, enum: ['CD', 'DVD', 'Acetate', 'Cassette'] },
    realeaseAge: { type: Number },
    quantity: { type: Number }

}, { collection: 'music' })

const Stock = mongoose.model('Music', musicSchema)

export default Stock