import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Refund Policy"
        description="Understand ResearchReady's refund policy. Learn about our money-back guarantee and the conditions for requesting refunds on our services."
        url="https://researchready.com/refund"
      />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">1. Our Commitment</h2>
              <p>
                At ResearchReady Services, we are committed to delivering high-quality academic support. We understand that sometimes circumstances may require a refund, and we have established this policy to ensure fair treatment for all our clients.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">2. Full Refund Eligibility</h2>
              <p>You may be eligible for a full refund in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellation before work has commenced on your project</li>
                <li>We are unable to find a qualified expert for your specific requirements</li>
                <li>Duplicate payment was made in error</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">3. Partial Refund Eligibility</h2>
              <p>Partial refunds may be considered when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellation occurs after work has begun but before completion</li>
                <li>The delivered work does not meet the agreed-upon requirements after revision attempts</li>
                <li>Significant delays caused by our team (beyond agreed timeline)</li>
              </ul>
              <p className="mt-4">
                The refund amount will be calculated based on the work completed and resources utilized.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">4. Non-Refundable Situations</h2>
              <p>Refunds will not be provided in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The work has been completed and delivered according to the original requirements</li>
                <li>You change your mind after the work is completed</li>
                <li>Failure to provide necessary information or feedback in a timely manner</li>
                <li>Requests for changes outside the original project scope</li>
                <li>Claims made more than 14 days after delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">5. Revision Policy</h2>
              <p>
                Before requesting a refund, we encourage you to utilize our free revision service. We offer revisions within the scope of your original requirements to ensure your satisfaction. Most concerns can be addressed through our revision process.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">6. How to Request a Refund</h2>
              <p>To request a refund:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact us via email at researchreadyservices@gmail.com or WhatsApp at +234 902 228 2963</li>
                <li>Provide your order details and reason for the refund request</li>
                <li>Our team will review your request within 3-5 business days</li>
                <li>If approved, refunds will be processed within 7-14 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">7. Refund Method</h2>
              <p>
                Refunds will be issued using the original payment method when possible. In cases where this is not feasible, we will work with you to find an appropriate alternative.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">8. Disputes</h2>
              <p>
                If you disagree with our refund decision, you may appeal by providing additional information or documentation. We are committed to resolving disputes fairly and professionally.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
              <p>
                For refund inquiries or to initiate a refund request, please contact us at researchreadyservices@gmail.com or via WhatsApp at +234 902 228 2963.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default RefundPolicy;
