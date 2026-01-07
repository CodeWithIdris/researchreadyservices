import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

const currencies: CurrencyRate[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1550 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.65 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 153.50 },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", rate: 12.85 },
];

// Base prices in USD
const basePrices = {
  consultation: 50,
  essayWriting: 150,
  thesisChapter: 300,
  fullThesis: 2500,
  dataAnalysis: 400,
  editing: 100,
};

interface CurrencyDisplayProps {
  showPricing?: boolean;
}

const CurrencyDisplay = ({ showPricing = true }: CurrencyDisplayProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate>(currencies[0]);
  const [detectedCurrency, setDetectedCurrency] = useState<string>("");

  useEffect(() => {
    // Detect user's likely currency based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const timezoneToCurrency: Record<string, string> = {
      'Africa/Lagos': 'NGN',
      'Africa/Nairobi': 'KES',
      'Africa/Accra': 'GHS',
      'Africa/Johannesburg': 'ZAR',
      'Europe/London': 'GBP',
      'Europe/Paris': 'EUR',
      'Europe/Berlin': 'EUR',
      'America/New_York': 'USD',
      'America/Los_Angeles': 'USD',
      'America/Toronto': 'CAD',
      'Australia/Sydney': 'AUD',
      'Asia/Kolkata': 'INR',
    };

    const detected = timezoneToCurrency[timezone] || 'USD';
    setDetectedCurrency(detected);
    
    const currency = currencies.find(c => c.code === detected);
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, []);

  const convertPrice = (usdPrice: number) => {
    const converted = usdPrice * selectedCurrency.rate;
    
    // Format based on currency
    if (selectedCurrency.code === 'NGN' || selectedCurrency.code === 'KES') {
      return `${selectedCurrency.symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `${selectedCurrency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCurrencyChange = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Pricing</h3>
        </div>
        <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {detectedCurrency && detectedCurrency !== selectedCurrency.code && (
        <p className="text-xs text-muted-foreground mb-4">
          We detected you might be in {currencies.find(c => c.code === detectedCurrency)?.name} region
        </p>
      )}

      {showPricing && (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Consultation (1hr)</span>
            <span className="font-semibold text-foreground">{convertPrice(basePrices.consultation)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Essay Writing</span>
            <span className="font-semibold text-foreground">From {convertPrice(basePrices.essayWriting)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Thesis Chapter</span>
            <span className="font-semibold text-foreground">From {convertPrice(basePrices.thesisChapter)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Full Thesis</span>
            <span className="font-semibold text-foreground">From {convertPrice(basePrices.fullThesis)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Data Analysis</span>
            <span className="font-semibold text-foreground">From {convertPrice(basePrices.dataAnalysis)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Editing & Proofreading</span>
            <span className="font-semibold text-foreground">From {convertPrice(basePrices.editing)}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            *Prices are estimates. Final quote depends on project scope.
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyDisplay;