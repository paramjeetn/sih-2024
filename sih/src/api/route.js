import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";


// const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
// const client = new GoogleGenerativeAI(apiKey);

const generateTextFromImage = async (fileUrl) => {
  try {

const genAI = new GoogleGenerativeAI("AIzaSyAtC1vtTrW4hP2Gvov_3tKf3dJtOCAPh1k");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain the image in the following sentence:";
const image = {
  inlineData: {
    data: Buffer.from(fs.readFileSync("images.jpeg")).toString("base64"),
    mimeType: "image/jpeg",
  },
};
    const result = await model.generateContent([prompt, image]);
    console.log(result.response.text());
    return result;
  
  
  } catch (error) {
    console.error("Error generating text from image:", error);
    return "Error generating text from the image.";
  }
};

export default generateTextFromImage;