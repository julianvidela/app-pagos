import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseSecret = process.env.NEXT_SUPABASE_SECRET_KEY as string;
const accessToken = process.env.MP_ACCESS_TOKEN!;

const mercadopago = new MercadoPagoConfig({ accessToken });
const supabase = createClient(supabaseUrl, supabaseSecret);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().then((data) => data as { data: { id: string } });

    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    const donation = {
      id: payment.id,
      amount: payment.transaction_amount,
      message: payment.description,
    };

    await supabase.from("donations").insert(donation);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error en la solicitud del webhook:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
