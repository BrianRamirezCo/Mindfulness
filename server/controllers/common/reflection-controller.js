const Reflection = require("../../models/Reflection");
const Subscriber = require("../../models/Subscriber");
const { sendNewsletterEmail } = require("../../helpers/email");

// Admin — crear reflexión
const createReflection = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const reflection = new Reflection({ title, content, image });
    await reflection.save();

    res.status(201).json({ success: true, data: reflection });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Admin — publicar reflexión y mandar newsletter
const publishReflection = async (req, res) => {
  try {
    const { id } = req.params;

    const reflection = await Reflection.findById(id);
    if (!reflection)
      return res
        .status(404)
        .json({ success: false, message: "Reflexión no encontrada" });

    reflection.published = true;
    await reflection.save();

    // Mandar email a todos los suscriptores activos
    const subscribers = await Subscriber.find({ active: true });
    const emails = subscribers.map((s) => s.email);

    if (emails.length > 0) {
      await sendNewsletterEmail(emails, reflection);
    }

    res.status(200).json({
      success: true,
      message: `Reflexión publicada y enviada a ${emails.length} suscriptores`,
      data: reflection,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Admin — editar reflexión
const editReflection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const reflection = await Reflection.findById(id);
    if (!reflection)
      return res
        .status(404)
        .json({ success: false, message: "Reflexión no encontrada" });

    reflection.title = title || reflection.title;
    reflection.content = content || reflection.content;
    if (image) reflection.image = image;

    await reflection.save();
    res.status(200).json({ success: true, data: reflection });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Admin — eliminar reflexión
const deleteReflection = async (req, res) => {
  try {
    const { id } = req.params;
    await Reflection.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Reflexión eliminada" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Admin — obtener todas las reflexiones
const getAllReflections = async (req, res) => {
  try {
    const reflections = await Reflection.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reflections });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Público — obtener reflexiones publicadas
const getPublishedReflections = async (req, res) => {
  try {
    const reflections = await Reflection.find({ published: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: reflections });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Público — obtener una reflexión
const getReflectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    if (!reflection)
      return res
        .status(404)
        .json({ success: false, message: "Reflexión no encontrada" });
    res.status(200).json({ success: true, data: reflection });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Público — agregar comentario
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, text } = req.body;

    const reflection = await Reflection.findById(id);
    if (!reflection)
      return res
        .status(404)
        .json({ success: false, message: "Reflexión no encontrada" });

    reflection.comments.push({ userId, userName, text });
    await reflection.save();

    res.status(200).json({ success: true, data: reflection });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Público — suscribirse al newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res
          .status(200)
          .json({
            success: true,
            message: "Te volviste a suscribir correctamente",
          });
      }
      return res
        .status(200)
        .json({ success: false, message: "Ya estás suscripto con ese email" });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ success: true, message: "Te suscribiste correctamente" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// Público — desuscribirse
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber)
      return res
        .status(404)
        .json({ success: false, message: "Email no encontrado" });

    subscriber.active = false;
    await subscriber.save();

    res
      .status(200)
      .json({ success: true, message: "Te desuscribiste correctamente" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

module.exports = {
  createReflection,
  publishReflection,
  editReflection,
  deleteReflection,
  getAllReflections,
  getPublishedReflections,
  getReflectionById,
  addComment,
  subscribe,
  unsubscribe,
};
