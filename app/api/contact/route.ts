import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  email: z.string().email("A valid email address is required"),
  service: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = result.data

    // Log the submission (replace with email/CRM integration in production)
    console.log("- New Contact Form Submission -")
    console.log(`Name:    ${data.name}`)
    console.log(`Phone:   ${data.phone}`)
    console.log(`Email:   ${data.email}`)
    console.log(`Service: ${data.service ?? "Not specified"}`)
    console.log(`Message: ${data.message ?? "No message"}`)
    console.log("----")

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us. We will be in touch within 24 hours.",
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please call us directly at (816) 721-1111.",
      },
      { status: 500 }
    )
  }
}
