const { json } = require("express");
const { prisma } = require("../prisma/prisma-client");

const post = async (req, res) => {
  try {
    const { discription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Необходимо загрузить видео" });
    }

    const video = await prisma.video.create({
      data: {
        file: req.file.path,
        userName: req.user.userName,
        discription: discription || "",
        likes: "0",
      },
    });

    if (video) {
      res.status(201).json(video);
    } else {
      res.status(500).json({ message: "Не удалось добавить видео" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = { post };
