"use client";

// Initialize the JS client
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl,supabaseAnonKey);

export default function NotificationsPag() {
  const [notifications, setNotifications] = useState<{ id: number; message: string; amount: number }[]>([]);

  useEffect(() => {
    supabase
      .channel("donations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public" },
        (change) => {
          setNotifications((notifications) => [...notifications, change.new as { id: number; message: string; amount: number }]);
        },
      )
      .subscribe();
  }, []); // Dependencia como un array vacío

  useEffect(() => {
    if (notifications.length) {
      const timeout = setTimeout(() => {
        setNotifications((notifications) => notifications.slice(1));
      }, 500000);

      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  if (!notifications.length) {
    return null;
  }

  return (
    <section className="grid gap-4 justify-center items-center absolute bottom-4 right-4 bg-black border p-4 rounded-md">
      <p className="text-2xl font-bold">{notifications[0].amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
      <p>{notifications[0].message}</p>
    </section>
  );
}
