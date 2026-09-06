import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { generateInvoice, downloadInvoice } from '@/controllers/invoiceController.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mockReq = { params, query: { id: params.id }, nextUrl: req.nextUrl };
    const res = await downloadInvoice(mockReq, null);
    if (!res.success) {
      return NextResponse.json(res, { status: res.message === 'No invoice yet' ? 404 : 400 });
    }
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const mockReq = {
      params,
      query: { id: params.id },
      body,
      user: { id: 'user-garage-1', garageId: 'garage-1' },
      nextUrl: req.nextUrl,
    };

    const result = await generateInvoice(mockReq, null);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

