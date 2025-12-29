import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does ResearchReady offer?",
    answer: "We offer comprehensive academic support including dissertation writing, literature reviews, thesis editing, research analysis, academic coaching, and publication support. Our team of experts is equipped to handle projects across various disciplines.",
  },
  {
    question: "How do I place an order?",
    answer: "You can place an order by clicking the 'Get Started' button on our website or by contacting us via WhatsApp or email. Our team will discuss your requirements and provide a customized quote based on your project needs.",
  },
  {
    question: "What are your turnaround times?",
    answer: "Turnaround times vary depending on the complexity and length of your project. Standard projects typically take 7-14 days, while urgent requests can be accommodated with prior arrangement. We always discuss deadlines before starting work.",
  },
  {
    question: "How do you ensure quality?",
    answer: "Our work goes through multiple quality checks including expert review, plagiarism scanning, and formatting verification. Each project is handled by specialists in the relevant field to ensure accuracy and academic rigor.",
  },
  {
    question: "Is my information kept confidential?",
    answer: "Absolutely. We maintain strict confidentiality for all client information and project details. Your personal data and academic work are never shared with third parties.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including bank transfers, mobile money, and other secure payment options. Payment details are provided once your project requirements are confirmed.",
  },
  {
    question: "Can I request revisions?",
    answer: "Yes, we offer free revisions within the scope of the original requirements. If you need modifications, simply let us know and our team will make the necessary adjustments promptly.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we have a refund policy in place. Please refer to our Refund Policy page for detailed information about eligibility and the refund process.",
  },
];

const FAQs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our services.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="https://wa.me/2349022282963?text=Hello%2C%20I%20have%20a%20question%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
