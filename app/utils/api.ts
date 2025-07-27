// /app/utils/api.ts

interface FetchContentParams {
  prompt: string;
  type: string;
  model: string;
}

interface ApproveContentParams {
  prompt: string;
  type: string;
  model: string;
  content: string;
}

interface ApiResponse {
  success?: boolean;
  result?: string;
  content?: string;
  type?: string;
  prompt?: string;
  model?: string;
  approvalUrl?: string;
  message?: string;
}

export async function fetchContent({ prompt, type, model }: FetchContentParams): Promise<ApiResponse> {
  try {
    const res = await fetch('https://n8n-render-0d09.onrender.com/webhook/generate-content', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ prompt, type, model }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function approveContent({ prompt, type, model, content }: ApproveContentParams): Promise<ApiResponse> {
  try {
    const res = await fetch('https://n8n-render-0d09.onrender.com/webhook/approve-content', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        prompt, 
        type, 
        model, 
        content 
      }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    // Lấy response text trước
    const responseText = await res.text();
    console.log('Raw response:', responseText);
    
    // Kiểm tra nếu response trống
    if (!responseText.trim()) {
      console.log('Empty response, returning default success');
      return { success: true, message: 'Content approved successfully' };
    }
    
    // Parse JSON nếu có content
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Response text:', responseText);
      // Nếu không parse được JSON nhưng status OK, coi như thành công
      return { success: true, message: 'Content approved successfully' };
    }
    
  } catch (error) {
    console.error('Approve error:', error);
    throw error;
  }
}