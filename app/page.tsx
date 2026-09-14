import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DEFAULT_COUNTRY } from '@/lib/data/countries';

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedCountry = cookieStore.get('ctp_country')?.value;
  const targetCountry = savedCountry || DEFAULT_COUNTRY;
  
  redirect(`/${targetCountry}`);
}
