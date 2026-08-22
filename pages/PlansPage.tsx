import React, { useState } from 'react';
import { Check, Zap, Crown, Building2, Phone, MessageSquare, Video } from 'lucide-react';

const PlansPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for small dealerships getting started with AI',
      monthlyPrice: 75000,
      annualPrice: 750000,
      savings: 150000,
      popular: false,
      features: [
        '2 AI Engines (Sales + Service)',
        '20 AI Models',
        'Up to 3 users',
        'Basic analytics & reporting',
        'Email support (48-hour response)',
        '45-day implementation',
        'Mobile app access',
        'Basic voice AI (50 calls/month)',
        'Community access',
      ],
      engines: ['Sales Engine', 'Service Engine'],
      voiceFeatures: ['Basic call recording', 'Simple transcription', 'Call analytics'],
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Crown,
      description: 'For growing dealerships ready to scale operations',
      monthlyPrice: 250000,
      annualPrice: 2500000,
      savings: 500000,
      popular: true,
      features: [
        '4 AI Engines (Sales, Service, Finance, Insurance)',
        '45 AI Models',
        'Up to 15 users',
        'Advanced analytics & BI',
        'Priority support (24-hour response)',
        '30-day implementation',
        'Mobile + Web + API access',
        'Advanced voice AI (500 calls/month)',
        'Custom workflows',
        'Multi-location support',
        'Dedicated onboarding',
      ],
      engines: ['Sales', 'Service', 'Finance', 'Insurance'],
      voiceFeatures: [
        'Advanced call recording',
        'Real-time transcription',
        'Sentiment analysis',
        'Call routing',
        'Voice analytics dashboard',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      description: 'Complete solution for large automotive groups',
      monthlyPrice: 500000,
      annualPrice: 5000000,
      savings: 1000000,
      popular: false,
      features: [
        'All 6 AI Engines',
        'All 65 AI Models',
        'Unlimited users',
        'Enterprise analytics & Custom BI',
        'Dedicated account manager',
        '15-day implementation',
        'Full platform access + White-label',
        'Unlimited voice AI calls',
        'Custom AI model training',
        'Multi-tenant support',
        'Advanced security & compliance',
        'Custom integrations',
        'SLA guarantees (99.9% uptime)',
        'Quarterly business reviews',
      ],
      engines: ['Sales', 'Service', 'Finance', 'Insurance', 'Workforce', 'Fleet EV'],
      voiceFeatures: [
        'Enterprise call center',
        'AI-powered call routing',
        'Multi-language support',
        'Custom voice models',
        'Advanced analytics',
        'CRM integration',
        'Compliance recording',
      ],
    },
  ];

  const voiceAIFeatures = [
    {
      icon: Phone,
      title: 'Outbound Calling',
      description: 'AI-powered outbound calls for follow-ups, reminders, and customer engagement',
      plans: ['Starter', 'Professional', 'Enterprise'],
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Transcription',
      description: 'Live call transcription with speaker identification and sentiment analysis',
      plans: ['Professional', 'Enterprise'],
    },
    {
      icon: Video,
      title: 'Call Analytics',
      description: 'Comprehensive call analytics, performance metrics, and insights',
      plans: ['Starter', 'Professional', 'Enterprise'],
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Transform your automotive business with AI-powered solutions.
          65 AI Models. 6 Engines. Complete Ecosystem.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : ''
              }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
          Annual
        </span>
        {billingCycle === 'annual' && (
          <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Save up to 20%
          </span>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${plan.popular
                  ? 'border-indigo-500 scale-105'
                  : 'border-slate-200 hover:border-indigo-300'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-indigo-100' : 'bg-slate-100'
                    }`}>
                    <Icon size={24} className={plan.popular ? 'text-indigo-600' : 'text-slate-600'} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      ₹{getPrice(plan).toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-green-600 mt-2">
                      Save ₹{plan.savings.toLocaleString('en-IN')}/year
                    </p>
                  )}
                </div>

                {/* Payment Handler */}
                <button
                  onClick={() => {
                    const amount = getPrice(plan);
                    const options = {
                      key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
                      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                      currency: "INR",
                      name: "Autoera AI",
                      description: `Subscription for ${plan.name} Plan`,
                      image: "https://your-logo-url.com/logo.png",
                      handler: function (response: any) {
                        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                        // Future: Call backend to verify payment and activate subscription
                      },
                      prefill: {
                        name: "Gaurav Kumar",
                        email: "gaurav.kumar@example.com",
                        contact: "9999999999"
                      },
                      notes: {
                        address: "Razorpay Corporate Office"
                      },
                      theme: {
                        color: "#4f46e5"
                      }
                    };
                    const rzp1 = new (window as any).Razorpay(options);
                    rzp1.open();
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                >
                  Unsubscribe (Demo) / Subscribe
                </button>

                {/* Features List */}
                <div className="mt-8 space-y-4">
                  <p className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                    What's Included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Voice AI Features */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    Voice AI Features:
                  </p>
                  <ul className="space-y-2">
                    {plan.voiceFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Phone size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice AI Features Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Voice AI Features for MVP
          </h2>
          <p className="text-lg text-slate-600">
            3 Core Voice AI Functions Available Across All Plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {voiceAIFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.plans.map((planName) => (
                    <span
                      key={planName}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full"
                    >
                      {planName}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Section */}
      <div className="max-w-7xl mx-auto mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Proven ROI</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Our customers see results within 30 days
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">617%</div>
              <div className="text-indigo-200">Average ROI</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-indigo-200">Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%+</div>
              <div className="text-indigo-200">AI Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30 Days</div>
              <div className="text-indigo-200">Implementation</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ or Contact Section */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Need a Custom Plan?
        </h2>
        <p className="text-slate-600 mb-6">
          Contact our sales team for custom enterprise solutions tailored to your specific needs.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default PlansPage;
