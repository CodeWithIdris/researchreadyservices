import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms of Service"
        description="Terms governing ResearchReady's collaborative research consulting, analysis, methodology, interpretation and refinement services."
        url="https://researchreadyservices.lovable.app/terms"
      />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: October 2026</p>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using ResearchReady Services ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
              <p>
                ResearchReady provides collaborative research consulting, methodology, evidence synthesis, data analysis, interpretation, editing and publication-readiness support for academic, professional and organisational work.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when placing orders</li>
                <li>You are responsible for reviewing and using our deliverables appropriately</li>
                <li>You agree to use our services in compliance with your institution's academic policies</li>
                <li>You must not misrepresent our work as entirely your own without proper attribution where required</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
              <p>
                Each engagement's ownership, permitted use and confidentiality terms are confirmed in its written scope. We do not reuse client research materials for unrelated purposes without permission.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">5. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prices are quoted based on project requirements and complexity</li>
                <li>Payment terms are agreed upon before work commences</li>
                <li>We reserve the right to pause work if payment obligations are not met</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">6. Revisions and Modifications</h2>
              <p>
                We offer revisions within the scope of the original project requirements. Additional work outside the original scope may incur extra charges, which will be communicated before proceeding.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
              <p>
                ResearchReady shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the specific service in question.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">9. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at researchreadyservices@gmail.com or via WhatsApp at +234 902 228 2963.
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

export default TermsOfService;
