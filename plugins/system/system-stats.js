const os = require("os")

module.exports = app => {
  app.get("/stats", (req, res) => {
    res.json({
      platform: os.platform(),
      architecture: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      numCores: os.cpus().length,
      loadAverage: os.loadavg(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces(),
      osType: os.type(),
      osRelease: os.release(),
      userInfo: os.userInfo(),
      processId: process.pid,
      nodeVersion: process.version,
      execPath: process.execPath,
      cwd: process.cwd(),
      memoryUsage: process.memoryUsage()
    })
  })
}