import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Academic institution and field of study</li>
                <li>Project requirements and specifications</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications between you and our team</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your orders and send related information</li>
                <li>Communicate with you about our services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your consent or at your direction</li>
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Project files are retained for a reasonable period to facilitate revisions and support.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of promotional communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">7. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at researchreadyservices@gmail.com or via WhatsApp at +234 902 228 2963.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
