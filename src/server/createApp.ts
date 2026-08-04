import express from "express";

export function createApp() {
  const app = express();
  const PORT = 3000;

  app.get("/api/helloworld", (req, res) => {
    res.json({ hello: "world" });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  return app;
}
