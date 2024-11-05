// import { Auth } from "../Models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

// Şifreyi çıkarmak için yardımcı fonksiyon
const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const signUp = async (req, res) => {
  const {
    email,
    fullName,
    userName,
    password,
    confirmPassword,
    photo,
    isAdmin,
  } = req.body;

  const responseMessage = [
    ["fullName", "Geçerli"],
    ["userName", "Geçerli"],
    ["password", "Geçerli"],
    ["confirmPassword", "Geçerli"],
    ["photo", "Geçerli"],
    ["email", "Geçerli"],
    ["isAdmin", "Geçerli"],
  ];

  if (fullName.length < 3)
    responseMessage[0][1] = "Tam ad en az 3 karakter olmalıdır";
  if (userName.length < 3)
    responseMessage[1][1] = "Kullanıcı adı en az 3 karakter olmalıdır";
  if (password.length < 6)
    responseMessage[2][1] = "Şifre en az 6 karakter olmalıdır";
  if (confirmPassword !== password)
    responseMessage[3][1] = "Şifreler eşleşmiyor";
  if (!photo) responseMessage[4][1] = "Profil resmi URL'si gereklidir";

  if (responseMessage.some(([_, msg]) => msg !== "Geçerli")) {
    return res.status(400).json({ responseMessage });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET ortam değişkeni tanımlı değil");
    }

    const auth = await User.findOne({ userName });
    if (auth) {
      const userNameIndex = responseMessage.findIndex(
        ([field]) => field === "userName"
      );
      if (userNameIndex !== -1) {
        responseMessage[userNameIndex][1] = "Kullanıcı adı zaten mevcut";
      }
      return res.status(400).json({ responseMessage });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAuth = await User.create({
      email,
      photo,
      fullName,
      userName,
      password: hashedPassword,
      userName,
      isAdmin,
    });

    const token = jwt.sign({ id: newAuth._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.status(201).json({
      responseMessage: "Kullanıcı başarıyla oluşturuldu",
      data: omitPassword(newAuth),
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ responseMessage: "İç sunucu hatası" });
  }
};

export const signIn = async (req, res) => {
  const { userName, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET ortam değişkeni tanımlı değil");
    }

    const existingUser = await User.findOne({ userName });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).send("Yanlış kullanıcı adı veya şifre");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.status(200).send({
      message: "Başarıyla giriş yapıldı",
      data: omitPassword(existingUser),
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ responseMessage: "İç sunucu hatası" });
  }
};
export const logOut = (req, res) => {
  try {
    // Cookie'deki JWT'yi sil
    res.cookie("token", "", {
      expires: new Date(0), // Cookie'nin hemen sona ermesini sağlar
      httpOnly: true, // Güvenlik için sadece HTTP isteklerinde erişilebilir
      secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinden gönderilir (prod ortamında)
      sameSite: "Strict", // Cross-site request forgery (CSRF) saldırılarına karşı koruma sağlar
      path: "/", // Cookie'nin geçerli olduğu yol
    });

    // Başarılı çıkış mesajı gönder
    return res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "İç sunucu hatası" });
  }
};

// İhtiyaç duyulursa kullanmak için yorumdan çıkarın
// export const logout = async (req, res) => {
//   res.cookie("jwt", "", {
//     expires: new Date(0),
//     httpOnly: true,
//     path: "/",
//     sameSite: 'Strict'
//   });

//   res.status(200).send("Başarıyla çıkış yapıldı");
// };
