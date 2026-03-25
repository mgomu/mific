import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return Response.json({ error: "Mensaje vacío" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "MiFIC Feedback <onboarding@resend.dev>",
    to: process.env.FEEDBACK_EMAIL!,
    subject: "Nuevo comentario en MiFIC",
    text: message.trim(),
  });

  if (error) {
    return Response.json({ error: "Error enviando el mensaje" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
