import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;

    console.log({ body });

    if (!name || !email || !amount) {
      return new Response(
        JSON.stringify({ error: "Invalid email or parmaters" }),
        { status: 400 }
      );
    }
    let customer;

    const existingCustomer = await stripe.customers.list({ email });
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      const newCustomer = await stripe.customers.create({ name, email });
      customer = newCustomer;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-10-29.clover" }
    );
    console.log({ ephemeralKey });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: "usd",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    console.log({ paymentIntent });

    return new Response(
      JSON.stringify({
        paymentIntent,
        ephemeralKey,
        customer: customer.id,
      })
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "An error occures" }), {
      status: 500,
    });
  }
}

// app.post('/payment-sheet', async (req, res) => {
//   // Use an existing Customer ID if this is a returning customer.
//   const customer = await stripe.customers.create(stripeAccount:'{{CONNECTED_ACCOUNT_ID}}');
//   const customerSession = await stripe.customerSessions.create({
//     customer: customer.id,
//     components: {
//       mobile_payment_element: {
//         enabled: true,
//         features: {
//           payment_method_save: 'enabled',
//           payment_method_redisplay: 'enabled',
//           payment_method_remove: 'enabled'
//         }
//       },
//     },
//   });
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'eur',
//     customer: customer.id,
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter
//     // is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.json({
//     paymentIntent: paymentIntent.client_secret,
//     customerSessionClientSecret: customerSession.client_secret,
//     customer: customer.id,
//     publishableKey: 'pk_test_51SPf4wBrzY47rPEGvAOixVMiVsA8je73Kz3LAvnWcNiMRH0WyA77awwXpPiSSpLNyJZ1odfrMY0Wket3l5ybMmcv00dcZ5np7k'
//   });
// });
