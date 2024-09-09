"use client";

import React, { useState, useRef } from 'react';
import { db, storage } from "@/lib/firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";

// import generateTextFromImage from '../api/route';
// import queryGeminiWithImage from '../api/route';
const genAI = new GoogleGenerativeAI("AIzaSyAtC1vtTrW4hP2Gvov_3tKf3dJtOCAPh1k");

async function generateTextFromImage(file: File , promptStr:string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = ` I want to create a enhanced text from user query and image 
               userquery: ${promptStr}`;
    const imageBuffer = await file.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, image]);
    const generatedText = await result.response.text();

    return generatedText;
  } catch (error) {
    console.error("Error generating text from image:", error);
    throw new Error("Failed to generate text from the image.");
  }
}


const ComplaintBox = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [type, setType] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [grievanceDescription, setGrievanceDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [fileError, setFileError] = useState("");
  const [notification, setNotification] = useState(""); // State for notifications
  const [isSuccess, setIsSuccess] = useState(false); // State to track success or failure
  const fileInput = useRef<HTMLInputElement>(null);

  const validFileTypes = [
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "audio/mpeg",
    "video/mp4",
    "image/jpeg",
    "image/png"
  ];

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setMobileNumber(value);
    setIsMobileValid(value.length === 10);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    setComplaintText("");
    setGrievanceDescription("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setFileError("File size exceeds 1 MB. Please upload a smaller file.");
        e.target.value = "";
      } else if (!validFileTypes.includes(selectedFile.type)) {
        setFileError("Invalid file type. Please upload a PDF, DOCX, MP3, MP4, JPEG, JPG, or PNG file.");
        e.target.value = "";
      } else {
        setFileError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let fileUrl = "";
      const selectedFile = fileInput.current?.files?.[0];
      if (selectedFile) {
        const fileRef = ref(storage,`uploads/${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile); // Upload file to Firebase Storage
        fileUrl = await getDownloadURL(fileRef);  // Get file URL after upload
      }
      else if (!selectedFile) {
        throw new Error("No file selected");
      }

      await addDoc(collection(db, "complaints"), {
        userId: "someUserId", // Replace with actual user ID
        problemId: "someProblemId", // Replace with actual problem ID if needed
        mobileNo: mobileNumber,
        complaintText: type === "complaint" ? complaintText : "",
        grievanceDescription: grievanceDescription,
        incidentDate,
        fileUrl,  // URL of the uploaded file
        createdAt: new Date()
      });
      setIsSuccess(true);
      setNotification("Complaint submitted successfully!"); // Show success notification

      const result = await generateTextFromImage(selectedFile, complaintText);

     
      const pnr = Math.floor(10000 + Math.random() * 90000);
      await addDoc(collection(db, "department"), {
        date:new Date(),
        department:"General",
        email:"user@exmple.com",
        enhancedComplaint:result,
        fileUrl,
        phone: mobileNumber,
        pnr:pnr.toString(),
        problemId: "someProblemId",
        severity: "High",
        status: "pending",
        userId: "someUserId"
      });

      

      // const prompt = `user complaint is :{${userData.complaintText}},
      //                 user provided image context is: {${gemini_Res}},
      // `
      // const result = await getHybridResults(prompt);
      // console.log("Hybrid Results:", JSON.stringify(result, null, 2));
    
      
    // if (result) {
    //   console.log(result);
    //   setIsSuccess(true);
    //   setNotification("Department DB image working");
    // } else {
    //   throw new Error("Text generation failed.");
    // }
  
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setIsSuccess(false);
      setNotification("Error submitting complaint. Please try again.");
    }
  };

  const handleReset = () => {
    setMobileNumber("");
    setIsMobileValid(false);
    setType("");
    setComplaintText("");
    setGrievanceDescription("");
    setIncidentDate("");
    setFileError("");
    setNotification("");
    setIsSuccess(false);

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-md w-full max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Grievance Detail</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Mobile No.</label>
          <Input
            type="text"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Type</label>
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complaint">Complaint</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {type && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">{type === "complaint" ? "Complaint Details" : "Suggestion Details"}</label>
            <Textarea
              placeholder={`Enter your ${type} details here`}
              value={type === "complaint" ? complaintText : grievanceDescription}
              onChange={(e) => type === "complaint" ? setComplaintText(e.target.value) : setGrievanceDescription(e.target.value)}
              className="w-full h-32"
              rows={5}
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Incident Date</label>
          <Input
            type="datetime-local"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Upload File</label>
          <Input
            type="file"
            ref={fileInput}
            onChange={handleFileChange}
            accept=".pdf,.docx,.mp3,.mp4,.jpeg,.jpg,.png"
            className="w-full"
          />
          {fileError && <p className="text-red-600 mt-2">{fileError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Grievance Description</label>
          <Textarea
            placeholder="Describe your grievance here"
            value={grievanceDescription}
            onChange={(e) => setGrievanceDescription(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Submit</Button>
          <Button variant="outline" type="reset">Reset</Button>
        </div>
      </form>

      {notification && (
        <div className={`mt-4 p-4 rounded-md ${isSuccess ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default ComplaintBox;
