import axios from 'axios';

async function sendWhatsappMessage(message, number) {
  try {
    const data = {
      messaging_product: 'whatsapp',
      to: number,
      type: 'text',
      text: {
        body: message,
      },
    };

    const response = await axios.post(
      'https://graph.facebook.com/v21.0/506415679217950/messages',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export default sendWhatsappMessage;
