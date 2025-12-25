
import { GoogleGenAI, Type } from "@google/genai";
import { AISmartResponse } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private readonly MODEL_NAME = 'gemini-2.0-flash'; // Updated to valid model name

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private getSystemPrompt() {
    return `Bạn là InnMaster AI v5.0 - Trợ lý vận hành nhà trọ "Action-First".
MỤC TIÊU: Giúp người quản lý ra quyết định trong 10 giây.
NGUYÊN TẮC:
1. Luôn trả lời dưới dạng JSON (không markdown).
2. "summary": Kết luận ngắn gọn, đi thẳng vào vấn đề (1 dòng).
3. "details": Tối đa 3 gạch đầu dòng giải thích Why/What.
4. "actions": Đề xuất 1-3 hành động cụ thể tiếp theo (Nút bấm).

HÀNH ĐỘNG HỢP LỆ (type):
- 'navigate': Chuyển module (payload: { moduleId: string })
- 'filter': Lọc danh sách (payload: { moduleId: string, filter: string })
- 'modal': Mở modal chức năng (payload: { modalType: string })
- 'copy': Copy nội dung mẫu (payload: { text: string })

VÍ DỤ CONTEXT: Đang ở module Billing, có 5 khách nợ.
OUTPUT:
{
  "summary": "Cần ưu tiên thu 5 khoản nợ quá hạn (Tổng 12.5tr) để tránh rủi ro dòng tiền.",
  "details": [
    "P.302 nợ lâu nhất (15 ngày).",
    "Tổng nợ tăng 10% so với tháng trước.",
    "Hôm nay là ngày chốt sổ cuối tuần."
  ],
  "actions": [
    { "label": "Xem danh sách Quá hạn", "type": "filter", "payload": { "moduleId": "billing-ar", "filter": "overdue" }, "icon": "AlertTriangle" },
    { "label": "Nhắc nợ hàng loạt", "type": "modal", "payload": { "modalType": "bulk-reminder" }, "icon": "Send" }
  ]
}`;
  }

  async getStructuredHelp(query: string, context: any): Promise<AISmartResponse> {
    try {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: `CONTEXT DATA: ${JSON.stringify(context)}. USER QUERY: ${query}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              details: { type: Type.ARRAY, items: { type: Type.STRING } },
              actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['navigate', 'filter', 'modal', 'copy'] },
                    payload: { 
                      type: Type.OBJECT, 
                      properties: {
                        moduleId: { type: Type.STRING },
                        filter: { type: Type.STRING },
                        modalType: { type: Type.STRING },
                        text: { type: Type.STRING }
                      }
                    },
                    icon: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["summary", "details", "actions"]
          },
          systemInstruction: this.getSystemPrompt(),
        }
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("Empty response");
      return JSON.parse(jsonText) as AISmartResponse;

    } catch (error: any) {
      console.error("AI Error:", error);
      return {
        summary: "Hệ thống đang bận, vui lòng thử lại.",
        details: ["Không thể kết nối đến bộ não AI.", "Vui lòng kiểm tra API Key."],
        actions: []
      };
    }
  }
}

export const geminiService = new GeminiService();
