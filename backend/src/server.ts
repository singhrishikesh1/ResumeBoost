import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateResumePDF } from './pdfService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeBoost API is running' });
});

// PDF Generation Endpoint
app.post('/api/pdf', async (req, res) => {
  try {
    const { resumeData, template, fontSize } = req.body;

    if (!resumeData || !template) {
      return res.status(400).json({ error: 'Missing required parameters: resumeData or template' });
    }

    const size = fontSize || 14;
    console.log(`Generating PDF using template: ${template}, font size: ${size}px`);

    const pdfBuffer = await generateResumePDF(resumeData, template, size);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Resume_${template}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    return res.end(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ 
      error: 'Failed to generate PDF resume', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ResumeBoost backend server is running on http://localhost:${PORT}`);
});




