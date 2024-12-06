import axios from 'axios';

async function sendWhatsappMessage(message, number) {
  console.log(number);
  
  try {
    if (!process.env.WHATSAPP_TOKEN) {
      console.error('Whatsapp token is missing');
      return;
    }

    console.log("Whatsapp token: ", process.env.WHATSAPP_TOKEN);
    
    if (!message || !number) {
      console.log(number);
      console.log(message);
      
      console.error('Message or number is missing');
      return;
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: number,
      type: 'text',
      text: {
        body: message,
      },
    };

    const response = await axios.post(
      'https://graph.facebook.com/v20.0/506415679217950/messages',
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
    console.error('Error sending message:', error.message);
    console.error('Error Sending message');
  }
}

export default sendWhatsappMessage;
