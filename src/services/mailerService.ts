import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses"
import dotenv from 'dotenv'
import MagicLinkService from "./magicLinkService"
dotenv.config()

// AWS SDK checks for these credentials automatically
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials not found in environment')
}

const sesClient = new SESClient({ region: "us-east-1" })

class MailerService {
  static sendEmail = async (params: SendEmailCommandInput) => {
    try {
      const command = new SendEmailCommand(params)
      return await sesClient.send(command)
    } catch (err) {
      console.error(err)
      throw new Error(`Error sending email: ${err}`)
    }
  }

  static sendMagicLink = async (email: string) => {
    let token = MagicLinkService.generateToken(email)
    const magicLink = `http://localhost:5000/auth/link/callback?token=${token}`
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: { Data: `Click on this link to log in: ${magicLink}` },
        },
        Subject: { Data: 'Your Magic Link' },
      },
      Source: process.env.AWS_VERIFIED_EMAIL,
    }
    try {
      await MailerService.sendEmail(params)
    } catch (err) {
      throw new Error(`Error sending magic link: ${err}`)
    }
  }
}

export default MailerService