const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const UserModel = require("../models/usermodel");

const plans = [
  {
    id: "Basic",
    price: 10,
    credits: 10,
    desc: "Best for personal use.",
  },
  {
    id: "Advanced",
    price: 30,
    credits: 20,
    desc: "Best for business use.",
  },
  {
    id: "Business",
    price: 50,
    credits: 40,
    desc: "Best for enterprise use.",
  },
];

const Payment = async (req, res) => {
  const { planId } = req.body;
  const userId = req.id;
  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return res.status(400).json({ message: "Invalid plan selected." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.id,
              description: plan.desc,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_PORT}/completed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_PORT}/Failed`,
    });
    const updateUserCredits = async () => {
      try {
        const user = await UserModel.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }
        user.creditBalance += plan.credits;
        await user.save();

        console.log(
          `User ${user.fullname}'s credits updated to ${user.creditBalance}`
        );
      } catch (error) {
        console.error("Error updating user credits:", error);
      }
    };

    updateUserCredits();

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Payment };
