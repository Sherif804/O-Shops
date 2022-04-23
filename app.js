const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());
const connection = require("./config/db.config");
connection();
const upload = require('express-fileupload');
app.use(upload());
app.use('/uploads', express.static('uploads'));
app.use(require("./modules/admins/routes/admins.routes"));
app.use(require("./modules/categories/routes/categories.routes"));
app.use(require('./modules/products/routes/products.routes'));
app.use(require('./modules/stores/routes/stores.routes'));
app.use(require("./modules/users/routes/users.routes"));
app.use(require("./modules/wishlist/routes/wishlist.routes"));
app.use(require("./modules/advertisment/routes/advertisment.routes"));

const Product = require("./modules/products/model/products.model");

app.get('/', (req,res) =>{
    res.send("halloooo")
})

app.post('/getJSON', async (req, res) => {
    let jsonArray = req.body;
    let newJson = [];
    storesArray = ["6182c594302b85ed244fa34d", "6182c5de302b85ed244fa357",
        "6182c611302b85ed244fa35c", "6182c996302b85ed244fa3cb",
        "6182c761302b85ed244fa363", "6182c7b0302b85ed244fa368",
        "6182c80c302b85ed244fa36f", "6182c850302b85ed244fa374",
        "6182c888302b85ed244fa379"]

    categoriesArray = ["6182c428302b85ed244fa325", "6182c448302b85ed244fa329",
        "6182c465302b85ed244fa32d", "6182c473302b85ed244fa331"]


    for (let i = 0; i < jsonArray.length; i++) {
          
        switch (jsonArray[i].StoreID) {
            case '1':
                jsonArray[i].StoreID = storesArray[0]
                break;

            case '2':
                jsonArray[i].StoreID = storesArray[1]
                break;

            case '3':
                jsonArray[i].StoreID = storesArray[2]
                break;

            case '4':
                jsonArray[i].StoreID = storesArray[3]
                break;

            case '5':
                jsonArray[i].StoreID = storesArray[4]
                break;

            case '6':
                jsonArray[i].StoreID = storesArray[5]
                break;

            case '7':
                jsonArray[i].StoreID = storesArray[6]
                break;

            case '8':
                jsonArray[i].StoreID = storesArray[7]
                break;

            case '9':
                jsonArray[i].StoreID = storesArray[8]
                break;

            default:
                console.log("Switch");
                break;
        }
    }

    for (let i = 0; i < jsonArray.length; i++) {
          
        switch (jsonArray[i].Pcategory) {
            case '1':
                jsonArray[i].Pcategory = categoriesArray[0]
                break;

            case '2':
                jsonArray[i].Pcategory = categoriesArray[1]
                break;

            case '3':
                jsonArray[i].Pcategory = categoriesArray[2]
                break;

            case '4':
                jsonArray[i].Pcategory = categoriesArray[3]
                break;

            default:
                console.log("Switch");
                break;
        }
    }

    for (let i = 0; i < jsonArray.length; i++) {
        let productName = jsonArray[i].pName
        let productImageURL = jsonArray[i].pImage
        let price = jsonArray[i].pPrice
        let storeId = jsonArray[i].StoreID
        let categoryId = jsonArray[i].Pcategory

        newJson.push({productName, productImageURL, price, storeId, categoryId});
        let newProduct = new Product({productName, productImageURL, price, storeId, categoryId});
        await newProduct.save();
    }
    res.json({status: 200 ,message: "success"})
})

app.listen(process.env.PORT, console.log("Server is up and running"))