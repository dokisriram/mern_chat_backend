import mongoose from "mongoose"

export const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('DB Connected')
    }).catch((err) => {
        console.log('Error conneting DB', err)
    })
}