const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('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');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { lineItems } = req.body;

  if (!lineItems || lineItems.length === 0) {
    return res.status(400).json({ error: 'Aucun article sélectionné.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://ton-site.com/success',  // À modifier par ton vrai lien
      cancel_url: 'https://ton-site.com/cancel',    // À modifier par ton vrai lien
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Stripe : ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend Stripe lancé sur le port ${PORT}`);
});
