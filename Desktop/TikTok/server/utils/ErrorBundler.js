const Bundler = (func, req, res) => {
  try {
    func();
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = {
  Bundler,
};
