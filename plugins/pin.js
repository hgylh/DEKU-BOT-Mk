/////https://whatsapp.com/channel/0029VakGs0BDeONEB6GKAa09
import axios from 'axios';
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(message.chat, "[❗] *¿ادخل نصآ لاستطيع البحث علي بنترست*", message);
  }
  
  async function generateImageMessage(url) {
    const { imageMessage } = await generateWAMessageContent({ 'image': { 'url': url } }, { 'upload': conn.waUploadToServer });
    return imageMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let results = [];
  let { data } = await axios.get("https://whatsapp.com/channel/0029VaJxI9uJkK7BedTH0D11") ;
  let imageUrls = data.resource_response.data.results.map(result => result.images.orig.url);
  shuffleArray(imageUrls);
  let selectedImages = imageUrls.splice(0, 5);
  let imageCount = 1;

  for (let imageUrl of selectedImages) {
    results.push({
      'body': proto.Message.InteractiveMessage.Body.fromObject({
        'text': "Imagen -" + (" " + imageCount++)
      }),
      'footer': proto.Message.InteractiveMessage.Footer.fromObject({
        'text': "𝙂𝙊𝙅𝙊-𝘽𝙊𝙏" // ضع العلامة المائية هنا
      }),
      'header': proto.Message.InteractiveMessage.Header.fromObject({
        'title': '',
        'hasMediaAttachment': true,
        'imageMessage': await generateImageMessage(imageUrl)
      }),
      'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        'buttons': [{
          'name': "cta_url",
          'buttonParamsJson': "{\"display_text\":\"url 📫\",\"Url\":\"https://www.pinterest.com/search/pins/?rs=typed&q=" + text + "\",\"merchant_url\":\"https://www.pinterest.com/search/pins/?rs=typed&q=" + text + "\"}"
        }]
      })
    });
  }

  const messageContent = generateWAMessageFromContent(message.chat, {
    'viewOnceMessage': {
      'message': {
        'messageContextInfo': {
          'deviceListMetadata': {},
          'deviceListMetadataVersion': 2
        },
        'interactiveMessage': proto.Message.InteractiveMessage.fromObject({
          'body': proto.Message.InteractiveMessage.Body.create({
            'text': "[❗] Resultado de : " + text
          }),
          'footer': proto.Message.InteractiveMessage.Footer.create({
            'text': "🔎 `P I N T E R E S T - S E A R C H BY 𝙂𝙊𝙅𝙊-𝘽𝙊𝙏`"
          }),
          'header': proto.Message.InteractiveMessage.Header.create({
            'hasMediaAttachment': false
          }),
          'carouselMessage': proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            'cards': [...results]
          })
        })
      }
    }
  }, {
    'quoted': message
  });

  await conn.relayMessage(message.chat, messageContent.message, { 'messageId': messageContent.key.id });
};

handler.help = ["pinterest"];
handler.tags = ["downloader"];
handler.command = /^(بين)$/i;

export default handler;
