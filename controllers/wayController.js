export function getWayPage(req, res) {
  res.render("way_web", {
    MAP_KEY: process.env.MAP_KEY,
  });
}
