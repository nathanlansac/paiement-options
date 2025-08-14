window.onload = () => {
  const stripe = Stripe("pk_live_51PaauIRxiwZIjdur3N6FBkwwHr1yX0jEsENvwSPAajlb3p5ncW3ViEJLoIRpWqZyLlGxgMzvtEYeGll56CXzUk4H00l2Ziuqiz");

  document.getElementById('pay-btn').addEventListener('click', async () => {
    const { qLit, qToilette, qPac } = updateTotals();

    if (qLit + qToilette + qPac === 0) {
      alert("Veuillez sélectionner au moins un produit.");
      return;
    }

    try {
      const response = await fetch('https://backend-stripe-q46m.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lit: qLit, toilette: qToilette, pac: qPac })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      alert("Erreur lors de la création de la session de paiement.");
      console.error(err);
    }
  });
};

