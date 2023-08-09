const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.handler = async (event) => {
  try {
    console.log(event);
    //const input = event.input.value;
     const input = event.value;
    console.log(input);

    const bcryptHash = await generateBcryptHash(input);
    console.log('Bcrypt Hash:', bcryptHash);
    
    const endData = {
      "banner": "B00919946",
      "result": bcryptHash,
      "arn": "arn:aws:lambda:us-east-1:430910936224:function:BcryptEncryption",
      "action": "bcrypt",
      "value": input
      }
      
    axios.post("https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end", endData);

    return {
      statusCode: 200,
      message: "Bcrypt Encryption",
      body: bcryptHash,
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

async function generateBcryptHash(inputData) {
  const saltRounds = 10; 
  const hash = await bcrypt.hash(inputData, saltRounds);
  return hash;
}
