
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private readonly MODEL_NAME = 'gemini-3-pro-preview';
  private readonly THINKING_BUDGET = 32768;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private getSystemPrompt() {
    return `Bạn là LeanInn Strategic AI v4.0.
Triết lý: Áp dụng nguyên tắc 80/20 (Pareto) để tinh gọn vận hành nhà trọ. 
Nhiệm vụ: 
1. Loại bỏ các công việc thừa thải không tạo ra giá trị.
2. Tập trung tối ưu 20% yếu tố (vị trí, loại phòng, đối tượng khách) tạo ra 80% lợi nhuận.
3. Giải quyết bài toán chống thất thoát dòng tiền và tối ưu hóa lấp đầy.

Khi trả lời:
- Luôn suy nghĩ sâu (Thinking Mode) để tìm ra điểm đòn bẩy.
- Phải có dữ liệu và giải pháp hành động ngay.
- Sử dụng mô hình 5W2H khi tư vấn chiến lược.`;
  }

  async analyzeBusiness(data: any) {
    try {
      const response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: `PHÂN TÍCH 80/20 & CHIẾN LƯỢC TINH GỌN: Dựa trên dữ liệu vận hành nhà trọ sau, hãy đề xuất 3 hành động then chốt để tăng lợi nhuận tức thì: ${JSON.stringify(data)}`,
        config: {
          thinkingConfig: { thinkingBudget: this.THINKING_BUDGET },
          systemInstruction: this.getSystemPrompt(),
          temperature: 0.1,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "LeanInn AI đang tính toán lộ trình tối ưu cho bạn...";
    }
  }

  async getQuickHelp(query: string, context?: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: `CONTEXT: ${context || 'Lean Dashboard'}. USER QUERY: ${query}`,
        config: {
          thinkingConfig: { thinkingBudget: this.THINKING_BUDGET },
          systemInstruction: this.getSystemPrompt(),
        }
      });
      return response.text;
    } catch (error) {
      return "Kết nối AI Strategic bị gián đoạn...";
    }
  }
}

export const geminiService = new GeminiService();
