import fs from 'fs';
import sendWhatsappMessage from '../services/whatsappServices.js';

const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));

function handleInteractiveMessage(interactiveObject) {
  const { type, payload } = interactiveObject;
  switch (type) {
    case 'button_reply':
      const buttonText = payload.button_text;
      sendWhatsappMessage(`Button reply received: ${buttonText}`, value.recipient_id);
      myConsole.log(`Button reply received: ${buttonText}`);
      break;
    case 'list_reply':
      const { title, description, list } = payload;
      sendWhatsappMessage(`List reply received: ${title} - ${description}`, value.recipient_id);
      myConsole.log(`List reply received: ${title} - ${description}`);
      break;
    default:
      sendWhatsappMessage('Sorry, I can only respond to text messages', value.recipient_id);
      myConsole.log('Unknown interactive message type');
      break;
  }
}

const checkMessage = (message, value) => {
  console.log(value.contacts[0].profile.name);
  
  switch (message.type) {
    case 'text':
      sendWhatsappMessage(`Hi ${value.contacts[0].profile.name} my name is ChatGPT`, value.contacts[0].wa_id);
      return message.text;
    case 'image':
      sendWhatsappMessage('Image message received', value.contacts[0].wa_id);
      return message.caption || 'No caption provided';
    case 'video':
      sendWhatsappMessage('Video message received', value.contacts[0].wa_id);
      return message.caption || 'No caption provided';
    case 'interactive':
      sendWhatsappMessage('Interactive message received', value.contacts[0].wa_id);
      const interactiveObject = message.interactive;
      handleInteractiveMessage(interactiveObject);
      break;
    default:
      sendWhatsappMessage('Sorry, I can only respond to text messages', value.contacts[0].wa_id);
      myConsole.log('Unknown message type');
      break;
  }
};

const verifyToken = (req, res) => {
  try {
    const accessToken = process.env.WEBHOOK_TOKEN;
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log("Access token: ", accessToken);
    console.log("Token: ", token);
    console.log("Challenge: ", challenge);
    
    if (!token || !challenge) {
      return res.status(400).send('Invalid request');
    }

    if (token === accessToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
  // return res.send('EVENT_RECEIVED');
};

const receivedMessage = (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry || entry.length === 0) {
      return res.sendStatus(400);
    }

    const { changes } = entry[0];
    if (!changes || changes.length === 0) {
      return res.sendStatus(400);
    }

    const { value } = changes[0];
    
    if (!value || !value.messages ) {
      sendWhatsappMessage(', I can only respond to text messages', value.recipient_id);
      return res.sendStatus(400);
    }

    const message = value.messages[0];
    
    myConsole.log(message);
    const responseMessage = checkMessage(message, value);
    // console.log(responseMessage);
    return res.send(responseMessage.body);
  } catch (error) {
    myConsole.error(error);
    res.status(500).send(error);
  }
};

export default { verifyToken, receivedMessage };
