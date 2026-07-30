import { redirect } from 'next/navigation'

// Stary adres strony kampanijnej — przeniesiona na /kampania_1.
export default function FilmRedirect() {
  redirect('/kampania_1')
}
