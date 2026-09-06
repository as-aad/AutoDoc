import { NextResponse } from 'next/server';
import { ProductController } from '@/controllers/productController';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const admin = searchParams.get('admin');

    if (admin === 'true') {
      const result = await ProductController.listAll();
      return NextResponse.json(result);
    }

    const result = await ProductController.list(category, search);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await ProductController.create(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
