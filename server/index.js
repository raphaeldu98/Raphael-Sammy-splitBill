const express = require("express")
const connectDB = require("./db/index")
const cors = require("cors")
const {
    createNewGroup,
    updateMembersAmount,
    getAllGroups,
    deleteGroup,
    fetchGroupById
} = require("./controllers/group.controller.js")


const app = express();
const PORT=8000;

//Middleware
app.use(cors());
app.use(express.json());


connectDB("mongodb+srv://raphaeldu98:qewrtyuiop@raphael.tvtxz.mongodb.net/?retryWrites=true&w=majority&appName=Raphael")
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection Failed!!", err)
})

//Routes
app.post('/api/v1/create-group', createNewGroup)
app.post('/api/v1/update-members-amount', updateMembersAmount)
app.get('/api/v1/groups', getAllGroups)
app.delete('/api/v1/group/:groupId', deleteGroup)
app.get('/api/v1/groups/:groupId', fetchGroupById)