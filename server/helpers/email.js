const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(email, resetUrl) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Recuperar contraseña — Valeria Sarmiento",
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #6B5744;">
        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 16px; color: #6B5744;">
          Recuperar contraseña
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #9E8878; margin-bottom: 24px;">
          Recibimos una solicitud para restablecer tu contraseña. Clickeá el botón de abajo para continuar. El link expira en 1 hora.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #A8896C; color: #FDFAF7; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: sans-serif; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
          Restablecer contraseña
        </a>
        <p style="font-size: 12px; color: #B5B89A; margin-top: 32px; line-height: 1.6;">
          Si no solicitaste esto, podés ignorar este email. Tu contraseña no va a cambiar.
        </p>
        <hr style="border: none; border-top: 1px solid #E2D8CF; margin: 32px 0;" />
        <p style="font-size: 11px; color: #B5B89A; font-family: sans-serif;">
          © ${new Date().getFullYear()} Valeria Sarmiento · Mindfulness & Bienestar
        </p>
      </div>
    `,
  });
}

async function sendVerificationEmail(email, code) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Verificá tu cuenta — Valeria Sarmiento",
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #6B5744;">
        
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B5A99A; font-family: sans-serif; margin-bottom: 32px; text-align: center;">
          Valeria Sarmiento · Mindfulness & Bienestar
        </p>

        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 16px; color: #6B5744; text-align: center;">
          Verificá tu cuenta
        </h1>

        <p style="font-size: 15px; line-height: 1.6; color: #9E8878; margin-bottom: 32px; text-align: center;">
          Usá el siguiente código para verificar tu cuenta. Expira en 15 minutos.
        </p>

        <div style="background-color: #F5EFE8; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 40px; font-weight: bold; letter-spacing: 0.3em; color: #A8896C; font-family: sans-serif; margin: 0;">
            ${code}
          </p>
        </div>

        <p style="font-size: 12px; color: #B5B89A; line-height: 1.6; text-align: center;">
          Si no creaste una cuenta, podés ignorar este email.
        </p>

        <hr style="border: none; border-top: 1px solid #E2D8CF; margin: 32px 0;" />

        <p style="font-size: 11px; color: #B5B89A; font-family: sans-serif; text-align: center;">
          © ${new Date().getFullYear()} Valeria Sarmiento · Mindfulness & Bienestar
        </p>
      </div>
    `,
  });
}

async function sendNewsletterEmail(emails, reflection) {
  const publicUrl = `${process.env.CLIENT_URL}/shop/reflections/${reflection._id}`;

  const emailPromises = emails.map((email) =>
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `${reflection.title} — Valeria Sarmiento`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; background-color: #FDFAF7; color: #6B5744;">
          
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B5A99A; font-family: sans-serif; margin-bottom: 32px; text-align: center;">
            Valeria Sarmiento · Mindfulness & Bienestar
          </p>

          ${
            reflection.image
              ? `
            <img src="${reflection.image}" alt="${reflection.title}" 
              style="width: 100%; border-radius: 8px; margin-bottom: 32px; object-fit: cover; max-height: 300px;" />
          `
              : ""
          }

          <h1 style="font-size: 28px; font-weight: normal; margin-bottom: 16px; color: #6B5744; line-height: 1.3; text-align: center;">
            ${reflection.title}
          </h1>

          <div style="width: 40px; height: 1px; background-color: #A8896C; margin: 0 auto 24px;"></div>

          <p style="font-size: 15px; line-height: 1.9; color: #9E8878; margin-bottom: 32px; text-align: center;">
            ${reflection.content.substring(0, 280)}...
          </p>

          <div style="text-align: center; margin-bottom: 40px;">
            <a href="${publicUrl}" 
              style="display: inline-block; background-color: #A8896C; color: #FDFAF7; padding: 13px 36px; text-decoration: none; border-radius: 8px; font-family: sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">
              Leer reflexión completa
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #E2D8CF; margin: 32px 0;" />

          <p style="font-size: 11px; color: #C5B9B0; font-family: sans-serif; line-height: 1.6; text-align: center;">
            Recibís este email porque te suscribiste a las reflexiones de Valeria Sarmiento.<br/>
            <a href="${process.env.SERVER_URL}/api/reflections/unsubscribe/${email}" 
              style="color: #C5B9B0; text-decoration: underline;">
              Desuscribirme
            </a>
          </p>

          <p style="font-size: 11px; color: #C5B9B0; font-family: sans-serif; margin-top: 12px; text-align: center;">
            © ${new Date().getFullYear()} Valeria Sarmiento
          </p>

        </div>
      `,
    }),
  );

  await Promise.all(emailPromises);
}

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendNewsletterEmail,
};
