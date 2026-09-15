import { NextRequest, NextResponse } from 'next/server';
import { InterrogationRequest } from '@/lib/types';
import { callGeminiInterrogation, generateVesperAlgorithmicResponse } from '@/lib/vesperAI';

export async function POST(req: NextRequest) {
  try {
    const body: InterrogationRequest = await req.json();

    if (!body.startupName || !body.category) {
      return NextResponse.json(
        { error: 'Startup name and category are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiResult = await callGeminiInterrogation(body, apiKey);
        return NextResponse.json(geminiResult);
      } catch (geminiError) {
        console.warn('Gemini API call failed, invoking algorithmic Vesper engine:', geminiError);
      }
    }

    // Fallback algorithmic response
    const algorithmicResult = generateVesperAlgorithmicResponse(body);
    return NextResponse.json(algorithmicResult);
  } catch (error) {
    console.error('Interrogation handler error:', error);
    return NextResponse.json(
      { error: 'Internal Predator Interrogation Failure' },
      { status: 500 }
    );
  }
}
