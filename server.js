const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { lit = 0, toilette = 0, pac = 0 } = req.body;

  if (lit < 0 || toilette < 0 || pac < 0) {
    return res.status(400).json({ error: 'Quantités invalides.' });
  }

  const lineItems = [];

  if (lit > 0) {
    lineItems.push({ price: 'price_1RvHtWRxiwZIjdurs2knMdwl', quantity: lit });
  }
  if (toilette > 0) {
    lineItems.push({ price: 'price_1RvHuSRxiwZIjdurFDfMGSlq', quantity: toilette });
  }
  if (pac > 0) {
    lineItems.push({ price: 'price_1RvHvyRxiwZIjdurHPCPNKAp', quantity: pac });
  }

  if (lineItems.length === 0) {
    return res.status(400).json({ error: 'Aucun article sélectionné.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://laetitia-lansac.lodgify.com/fr/success',
      cancel_url: 'https://laetitia-lansac.lodgify.com/fr/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});


