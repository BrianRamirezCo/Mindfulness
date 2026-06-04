const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const {
  sendPasswordResetEmail,
  sendVerificationEmail,
} = require("../../helpers/email");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "Ya existe una cuenta con ese email",
      });

    const hashPassword = await bcrypt.hash(password, 12);

    // Generar código de verificación de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpiry,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Registro exitoso. Revisá tu email para verificar tu cuenta.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Código inválido o expirado",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    const isProd = process.env.NODE_ENV === "production";

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Cuenta verificada correctamente",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          userName: user.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con ese email",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "La cuenta ya está verificada",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Código reenviado correctamente",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "No existe una cuenta con ese email",
      });

    if (checkUser.isVerified === false) {
      return res.json({
        success: false,
        message: "Verificá tu cuenta antes de ingresar",
        needsVerification: true,
        email,
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password,
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Contraseña incorrecta",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" },
    );

    const refreshToken = jwt.sign(
      { id: checkUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    const isProd = process.env.NODE_ENV === "production";

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login exitoso",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({
      success: false,
      message: "No hay refresh token",
    });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });

    const newToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" },
    );

    const isProd = process.env.NODE_ENV === "production";

    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Token renovado",
      });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Refresh token inválido",
    });
  }
};

const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
    .json({
      success: true,
      message: "Sesión cerrada",
    });
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No existe una cuenta con ese email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    res.status(200).json({
      success: true,
      message: "Te enviamos un email para recuperar tu contraseña",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "El link expiró o no es válido",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userName } = req.body;
    const userId = req.user.id;

    const existingUser = await User.findOne({ userName });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "Ese nombre de usuario ya está en uso",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { userName },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationCode,
  changePassword,
  updateProfile,
};
