import { transporter } from '@/lib/google';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const subject = form.get("subject") as string;
    const message = form.get("message") as string;
    const file = form.get("file")as File;
    
    const attachments = [];

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type,
      });
    }

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USERNAME,
      replyTo:email,
      subject: subject || 'Contact Form Message',
      text: message,
      attachments,
      
    });

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email.' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
