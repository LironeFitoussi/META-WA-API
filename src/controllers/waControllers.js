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

const checkMessage = (message) => {
  switch (message.type) {
    case 'text':
      sendWhatsappMessage('Text message received', value.recipient_id);
      return message.text;
    case 'image':
      sendWhatsappMessage('Image message received', value.recipient_id);
      return message.caption || 'No caption provided';
    case 'video':
      sendWhatsappMessage('Video message received', value.recipient_id);
      return message.caption || 'No caption provided';
    case 'interactive':
      sendWhatsappMessage('Interactive message received', value.recipient_id);
      const interactiveObject = message.interactive;
      handleInteractiveMessage(interactiveObject);
      break;
    default:
      sendWhatsappMessage('Sorry, I can only respond to text messages', value.recipient_id);
      myConsole.log('Unknown message type');
      break;
  }
};

const verifyToken = (req, res) => {
  try {
    const accessToken = process.env.BOT_AUTH_TOKEN;
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (token === accessToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
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
    if (!value || !value.messages || value.messages.length === 0) {
      sendWhatsappMessage(', I can only respond to text messages', value.recipient_id);
      return res.sendStatus(400);
    }

    const message = value.messages[0];
    myConsole.log(message);
    const responseMessage = checkMessage(message);
    console.log(responseMessage);
    res.send('EVENT_RECEIVED');
  } catch (error) {
    myConsole.error(error);
    res.sendStatus(500);
  }
};

export default { verifyToken, receivedMessage };
