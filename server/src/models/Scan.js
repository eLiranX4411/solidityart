import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  id:            { type: String, required: true },
  severity:      { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Info'], required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  vulnerableCode:{ type: String, required: true },
  fixedCode:     { type: String, required: true },
  explanation:   { type: String, required: true },
}, { _id: false });

const reportSchema = new mongoose.Schema({
  score:     { type: Number, required: true, min: 0, max: 100 },
  summary:   { type: String, required: true },
  issues:    [issueSchema],
  positives: [String],
});

const scanSchema = new mongoose.Schema({
  codeHash: { type: String, required: true, index: true },
  report:   { type: reportSchema, required: true },
  createdAt:{ type: Date, default: Date.now, index: true },
});

export default mongoose.model('Scan', scanSchema);
