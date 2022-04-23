const mongoose = require("mongoose");

const connection = () => {
    return mongoose.connect('mongodb+srv://admin:admin@apptestingcluster.vnr36.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = connection;