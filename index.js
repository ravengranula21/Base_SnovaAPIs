const express = require("express")
const cors = require("cors")
const secure = require("ssl-express-www")
const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

const app = express()
const PORT = 3000

app.enable("trust proxy")
app.set("json spaces", 2)

app.use(cors())
app.use(secure)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const configPath = path.join(__dirname, "config.json")
const settings = JSON.parse(fs.readFileSync(configPath, "utf-8"))

app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname, "pages")))
app.use("/plugins", express.static(path.join(__dirname, "plugins")))

app.use((req, res, next) => {
  const originalJson = res.json
  res.json = function (data) {
    if (data && typeof data === "object") {
      return originalJson.call(this, {
        status: data.status ?? res.statusCode ?? 200,
        creator: settings.creator,
        ...data
      })
    }
    return originalJson.call(this, data)
  }
  next()
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/index.html"))
})

const pluginDir = path.join(__dirname, "plugins")
let totalRoutes = 0

function loadPlugins() {
  totalRoutes = 0
  if (!fs.existsSync(pluginDir)) return

  fs.readdirSync(pluginDir).forEach(category => {
    const categoryPath = path.join(pluginDir, category)
    if (!fs.statSync(categoryPath).isDirectory()) return

    fs.readdirSync(categoryPath).forEach(file => {
      if (!file.endsWith(".js")) return

      const filePath = path.join(categoryPath, file)
      delete require.cache[require.resolve(filePath)]
      require(filePath)(app)
      totalRoutes++

      console.log(
        chalk.bgHex("#FFFF99").hex("#333").bold(
          ` Loaded Plugin: ${path.relative(pluginDir, filePath)} `
        )
      )
    })
  })

  console.log(
    chalk.bgHex("#90EE90").hex("#333").bold(
      ` Plugins Loaded: ${totalRoutes} `
    )
  )
}

loadPlugins()

app.use((err, req, res, next) => {
  res.status(500).json({
    status: 500,
    error: err.message || "Internal Server Error"
  })
})

app.listen(PORT, () => {
  console.log(
    chalk.bgHex("#87CEFA").hex("#333").bold(
      `${settings.apititle} running on http://localhost:${PORT}`
    )
  )
})

module.exports = app