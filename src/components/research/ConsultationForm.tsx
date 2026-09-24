import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getAttribution } from "@/lib/attribution";
import { trackConsultationStarted, trackConversion, trackFileUploaded, trackResearchLevelSelected } from "@/lib/analytics";

const levels = ["PhD", "Master's", "Academic/Researcher", "Professional", "Organisation", "Other"];
const supportOptions = ["PhD dissertation support", "Master's thesis support", "Research methodology", "Literature review", "Systematic or scoping review", "Data analysis and interpretation", "Academic manuscript", "Conference paper", "Professional research", "Grant proposal", "Other"];
const stages = ["Defining the research problem", "Proposal or protocol", "Literature review", "Data collection", "Data analysis", "Writing or revision", "Publication preparation", "Other"];
const budgets = ["$150 – $300", "$300 – $700", "$700 – $1,500", "$1,500+", "Not sure — please assess"];
const contacts = ["Email", "WhatsApp", "Either"];

const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const ConsultationForm = ({ source = "consultation_page" }: { source?: string }) => {
  const [params] = useSearchParams();
  const initialSupport = useMemo(() => params.get("service") || "", [params]);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", country: "", research_level: "", discipline: "", support_type: initialSupport, description: "", research_stage: "", deadline: "", budget_range: "", preferred_contact: "Email" });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const firstField = document.getElementById("enquiry-name");
    const onFocus = () => trackConsultationStarted(source);
    firstField?.addEventListener("focus", onFocus, { once: true });
    return () => firstField?.removeEventListener("focus", onFocus);
  }, [source]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.description.trim().length < 40) return setError("Please describe the research problem in at least 40 characters.");
    if ((form.preferred_contact === "WhatsApp" || form.preferred_contact === "Either") && !form.whatsapp.trim()) return setError("Please add your WhatsApp number for that contact choice.");
    setStatus("submitting");
    try {
      const attribution = getAttribution();
      const filePayload = file ? { name: file.name, type: file.type, size: file.size, base64: await fileToBase64(file) } : undefined;
      const { data, error: functionError } = await supabase.functions.invoke("research-enquiry", { body: { ...form, ...attribution, file: filePayload, ad_angle: params.get("angle") || undefined } });
      if (functionError || !data?.success) throw new Error(data?.error || "We could not submit your enquiry.");
      if (file && data.document_uploaded) trackFileUploaded(file.type, file.size);
      trackConversion("ConsultationSubmitted", { research_level: form.research_level, support_type: form.support_type, source });
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not submit your enquiry. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") return <div className="border border-accent bg-secondary p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-primary" /><h3 className="mt-4 font-playfair text-2xl text-primary">We've received your research enquiry.</h3><p className="mt-3 text-muted-foreground">We'll review the information and contact you about the next step.</p></div>;

  return (
    <form onSubmit={submit} className="grid gap-5" id="research-enquiry-form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="enquiry-name"><Input id="enquiry-name" required maxLength={100} value={form.name} onChange={(event) => set("name", event.target.value)} /></Field>
        <Field label="Email" htmlFor="enquiry-email"><Input id="enquiry-email" type="email" required maxLength={255} value={form.email} onChange={(event) => set("email", event.target.value)} /></Field>
        <Field label="WhatsApp" htmlFor="enquiry-whatsapp"><Input id="enquiry-whatsapp" type="tel" maxLength={40} placeholder="Include country code" value={form.whatsapp} onChange={(event) => set("whatsapp", event.target.value)} /></Field>
        <Field label="Country" htmlFor="enquiry-country"><Input id="enquiry-country" maxLength={100} value={form.country} onChange={(event) => set("country", event.target.value)} /></Field>
        <SelectField label="Research level" value={form.research_level} options={levels} onChange={(value) => { set("research_level", value); trackResearchLevelSelected(value); }} />
        <Field label="Research discipline" htmlFor="enquiry-discipline"><Input id="enquiry-discipline" required maxLength={120} placeholder="e.g. Public health, economics" value={form.discipline} onChange={(event) => set("discipline", event.target.value)} /></Field>
        <SelectField label="Support required" value={form.support_type} options={supportOptions} onChange={(value) => set("support_type", value)} />
        <SelectField label="Current research stage" value={form.research_stage} options={stages} onChange={(value) => set("research_stage", value)} />
        <Field label="Deadline" htmlFor="enquiry-deadline"><Input id="enquiry-deadline" required maxLength={80} placeholder="Date or timeframe" value={form.deadline} onChange={(event) => set("deadline", event.target.value)} /></Field>
        <SelectField label="Estimated project scope" value={form.budget_range} options={budgets} onChange={(value) => set("budget_range", value)} />
      </div>
      <Field label="Brief description of the research problem" htmlFor="enquiry-description"><Textarea id="enquiry-description" required minLength={40} maxLength={3000} className="min-h-36" placeholder="Tell us the question, difficulty, current stage and the support you need." value={form.description} onChange={(event) => set("description", event.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Preferred contact method" value={form.preferred_contact} options={contacts} onChange={(value) => set("preferred_contact", value)} />
        <Field label="Relevant document (optional)" htmlFor="enquiry-file"><div className="relative"><Input id="enquiry-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" className="h-11 pt-2" onChange={(event) => { const selected = event.target.files?.[0] || null; if (selected && selected.size > 10 * 1024 * 1024) { setError("Files must be no larger than 10 MB."); event.target.value = ""; return; } setFile(selected); }} /><FileUp className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" /></div><p className="mt-1 text-xs text-muted-foreground">PDF, Word, Excel, CSV or text. Maximum 10 MB.</p></Field>
      </div>
      {error && <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="gold" size="xl" disabled={status === "submitting"}>{status === "submitting" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting enquiry</> : "Submit Research Enquiry"}</Button>
      <p className="text-xs leading-5 text-muted-foreground">Your information and document are used to assess this enquiry. Research support is collaborative and must be used in line with your institution's academic integrity requirements.</p>
    </form>
  );
};

const Field = ({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) => <div><Label htmlFor={htmlFor} className="mb-2 block">{label}</Label>{children}</div>;
const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) => <div><Label className="mb-2 block">{label}</Label><Select value={value} onValueChange={onChange} required><SelectTrigger><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem value={option} key={option}>{option}</SelectItem>)}</SelectContent></Select></div>;

export default ConsultationForm;