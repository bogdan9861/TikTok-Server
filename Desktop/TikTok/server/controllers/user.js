const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const registredUser = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (registredUser) {
      return res.status(400).json({
        message: "Пользователь с таким номером телефона уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        userName: `user${Math.floor(Math.random() * 1000000000)}`,
        photo: "",
        phone,
        password: hashedPassword,
      },
    });

    const secret = process.env.SECRET;

    if (user && secret) {
      return res.json({
        id: user.id,
        name: user.name,
        photo: user.photo,
        phone: user.phone,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      res.status(400).json({ message: "Не удалось создать пользователя" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res.status(400).json({ message: "Все поля обязательны" });

    const user = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    const secret = process.env.SECRET;

    if (user && isPasswordCorrect) {
      res.status(200).json({
        name: user.name,
        phone: user.phone,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      res
        .status(404)
        .json({ message: "Номер телефона или пароль не совпадают" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = { register, login };
