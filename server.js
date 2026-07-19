import app from './api/index.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ StadiumPulse Local Express DB Server listening on http://localhost:${PORT}`);
});

export default app;
