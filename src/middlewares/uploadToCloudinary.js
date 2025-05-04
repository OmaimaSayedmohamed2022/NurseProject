import cloudinary from "../utilites/cloudinary.js";
import PDFDocument from 'pdfkit';
import streamifier from 'streamifier';
import axios from "axios";



const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    // Check if the file and its buffer are valid
    if (!file || !file.buffer) {
      console.error("File or file.buffer is missing.");
      return reject(new Error('File buffer is missing.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error(`Cloudinary upload failed: ${file.originalname}`, error);
          return reject(new Error('File upload failed. Please try again.'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    try {
      // Ensure we are passing a valid Buffer or stream to Cloudinary
      const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
      streamifier.createReadStream(buffer).pipe(uploadStream);  // Pipe the buffer to Cloudinary
    } catch (error) {
      console.error("Error processing file before upload:", error);
      reject(new Error("Error processing file before upload."));
    }
  });
};




const uploadPdfBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
         folder: "pdfs",
         public_id: `pdf_${Date.now()}`,  // فقط الاسم داخل مجلد pdfs
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading PDF to Cloudinary:", error);
          return reject(error);
        }
        console.log("✅ Cloudinary PDF URL:", result.secure_url);
        const pdfUrl = result.secure_url.endsWith('.pdf') ? result.secure_url : `${result.secure_url}.pdf`;
        resolve(pdfUrl);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const createAndUploadPdf = async (mediaUrl, description) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);
        try {
          const pdfUrl = await uploadPdfBufferToCloudinary(pdfBuffer);
          
          if (!pdfUrl) {
            reject(new Error("Failed to upload PDF to Cloudinary."));
            return;
          }
          resolve(pdfUrl);  // Ensure we return the correct URL
        } catch (uploadError) {
          reject(uploadError);
        }
      });

      // كتابة الوصف داخل الـ PDF
      if (description) {
        doc.fontSize(16).text(description, { align: "right" });
        doc.moveDown();
      }

      // إذا كان هناك ميديا مرفوعة مسبقًا على Cloudinary
      if (mediaUrl) {
        const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });
        const ext = mediaUrl.split('.').pop().toLowerCase();

        if (["jpg", "jpeg", "png"].includes(ext)) {
          doc.image(response.data, {
            fit: [500, 400],
            align: "center",
            valign: "center",
          });
        } else {
          doc.text(`تم إرفاق ملف من نوع: ${ext}`);
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default uploadToCloudinary;
