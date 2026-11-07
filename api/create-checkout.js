const Stripe = require('stripe');

// Inicializa Stripe con tu clave secreta que guardaremos en Vercel
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { email, membershipType, amount } = req.body;

    let lineItems = [];

    // Dependiendo de la opción, configuramos el precio en Stripe
    if (membershipType === 'donacion') {
      // El importe libre que escribió el usuario (convertido a céntimos, ej: 10€ = 1000)
      const unitAmount = Math.round(parseFloat(amount) * 100);
      
      if (unitAmount < 50) {
        return res.status(400).json({ error: 'El importe mínimo es de 0,50 €.' });
      }

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Donación Libre - Rota Dance Web',
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      });
    } else {
  // Para cuotas fijas (colaborador o dj_productor) en modo suscripción anual
  let fixedAmount = membershipType === 'colaborador' ? 3000 : 5000; // en céntimos (30€ o 50€)
  let titleName = membershipType === 'colaborador' ? 'Cuota Socio Colaborador Anual' : 'Cuota Socio DJ/Productor Anual';

  lineItems.push({
    price_data: {
      currency: 'eur',
      product_data: {
        name: titleName,
      },
      unit_amount: fixedAmount,
      recurring: {
        interval: 'year', // <-- Cambiado a anual para las suscripciones
      },
    },
    quantity: 1,
  });
}

    // Crear la sesión de Checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: membershipType === 'donacion' ? 'payment' : 'subscription', // o payment según prefieras
      customer_email: email || undefined,
      success_url: `${req.headers.origin}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/registro.html`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error al crear la sesión de Stripe:', error);
    return res.status(500).json({ error: error.message });
  }
};