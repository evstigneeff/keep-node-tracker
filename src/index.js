const { getECDSA, getYourECDSA } = require("./ecdsa")
const { getRB, getYourRB } = require("./rb")

const path = require("path")
const express = require("express")
const exphbs = require("express-handlebars")
const hbs = require("hbs")

const app = express()
app.engine("hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"
}))
const publicDir = path.join(__dirname, "../public")
const partialDir = path.join(__dirname, "../views/partials")

app.set("view engine", "hbs")
hbs.registerPartials(partialDir)

app.use(express.static(publicDir))
app.use(express.json())

const getListRB = async () => {
    const resp = await getRB()
    return resp
}

const getListECDSA = async () => {
    const resp = await getECDSA()
    return resp
}

const getTxRB = async (addr) => {
    const resp = await getYourRB(addr)
    return resp
}

const getTxECDSA = async (addr) => {
    const resp = await getYourECDSA(addr)
    return resp
}


app.get("/", async (req, res) => {
    res.render("home", {
        data: {
            title: "Keep Node Info (Mainnet)"
        }
    })
})

app.get("/rb", async (req, res) => {
    const arrayAddr = await getListRB()
    res.render("rb", {
        data: {
            title: "Random Beacon Nodes",
            rbID: arrayAddr,
            rbNum: arrayAddr.length
        }
    })
})

app.get("/ecdsa", async (req, res) => {
    const arrayAddr = await getListECDSA()
    res.render("ecdsa", {
        data: {
            title: "ECDSA Nodes",
            ecdsaID: arrayAddr,
            ecdsaNum: arrayAddr.length
        }
    })
})

app.get("/rb/:id", async (req, res) => {
    const id = req.params.id
    const arrayTxs = await getTxRB(id)
    res.render("rb_id", {
        data: {
            title: `Random Beacon Node ${id}`,
            // url: process.env.ETHERSCAN_TESTNET_URL,
            rbTx: arrayTxs
        }
    })
})

app.get("/ecdsa/:id", async (req, res) => {
    const id = req.params.id
    const arrayTxs = await getTxECDSA(id)
    res.render("ecdsa_id", {
        data: {
            title: `ECDSA Node ${id}`,
            // url: process.env.ETHERSCAN_TESTNET_URL,
            ecdsaTx: arrayTxs
        }
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        data: {
            title: "Error",
            errorText: "Page not found"
        }
    })
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Server started on port 8080");
})