module.exports = (app) => {
  app.get("/api/example", async (req, res) => {
    const { text } = req.query
    if (!text) {
      return res.status(400).json({
        error: "Parameter text wajib diisi"
      })
    }

    res.json({
      data: {
        input: text,
        message: "Ini contoh endpoint"
      }
    })
  })
}