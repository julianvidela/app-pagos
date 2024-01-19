import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseSecret = process.env.NEXT_SUPABASE_SECRET_KEY as string

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!,});
const supabase = createClient(supabaseUrl,supabaseSecret)


export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data as { data: { id: string } });

  const payment = await new Payment(mercadopago).get({ id: body.data.id });

  const donation = {
    id: payment.id,
    amount: payment.transaction_amount,
    message: payment.description,
  };

 

  await supabase.from("donations").insert(donation)
  

  return Response.json({ success: true });
}
 