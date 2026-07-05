// AlgoForce Finance AI - Connected Dummy Data Layer
// Generates interconnected mock data tailored to 6 different industries.

export type IndustryType = 'Manufacturing' | 'Hotel' | 'Hospital' | 'Retail' | 'Distributor' | 'CA_Firm';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  partyName: string; // Customer or Vendor name
  partyGstin: string;
  amount: number;
  gstAmount: number;
  type: 'sales' | 'purchase';
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
  date: string;
  dueDate: string;
  hsnCode: string;
  items: { description: string; quantity: number; rate: number; amount: number; hsn: string }[];
  confidence: number; // For OCR / Audit matching confidence
  duplicateOf?: string;
  explainText?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  gstin: string;
  totalRevenue: number;
  outstanding: number;
  lastPaymentDate: string;
  riskProfile: 'Low' | 'Medium' | 'High';
  healthScore: number;
  paymentBehavior: string;
  aiSummary: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  gstin: string;
  outstanding: number;
  lastPurchaseDate: string;
  riskScore: number;
  purchaseVolume: number;
  aiSummary: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'Matched' | 'Unmatched' | 'Duplicate';
  matchSuggestion?: string;
  bankName: string;
  refNo: string;
  confidence?: number;
}

export interface GstIssue {
  id: string;
  type: 'ITC Mismatch' | 'Wrong GSTIN' | 'Duplicate Invoice' | 'Late Filing' | 'HSN Mismatch';
  partyName: string;
  gstin: string;
  invoiceNo: string;
  amount: number;
  desc: string;
  status: 'Pending' | 'Fixed' | 'Ignored';
  confidence: number;
  explainText: string;
}

export interface AuditIssue {
  id: string;
  type: 'Missing Voucher' | 'Duplicate Entry' | 'Tax Mistake' | 'Inventory Mismatch';
  title: string;
  desc: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  amount: number;
  confidence: number;
  explainText: string;
  status: 'Pending' | 'Fixed' | 'Ignored';
  collaborationLog?: string[];
}

export interface IndustryData {
  industryName: string;
  kpis: {
    revenue: number;
    revenueGrowth: number;
    expenses: number;
    netProfit: number;
    receivables: number;
    payables: number;
    cashAvailable: number;
    gstDue: number;
    bankBalance: number;
  };
  healthScores: {
    overall: number;
    cashFlow: number;
    gst: number;
    receivables: number;
    inventory: number;
    audit: number;
  };
  roiStats: {
    manualHours: number;
    savedHours: number;
    recoveredAmount: number;
    gstErrorsPrevented: number;
    auditIssuesFixed: number;
    outstandingReduced: number;
  };
  invoices: Invoice[];
  customers: Customer[];
  vendors: Vendor[];
  transactions: Transaction[];
  gstIssues: GstIssue[];
  auditIssues: AuditIssue[];
}

// Helper: Generates random dates within the last 60 days
const getRandomDate = (daysAgoStart: number, daysAgoEnd: number): string => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * (daysAgoEnd - daysAgoStart + 1)) + daysAgoStart;
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getFutureDate = (baseDateStr: string, daysAhead: number): string => {
  const date = new Date(baseDateStr);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Seed arrays
const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Pune', 'Ahmedabad', 'Hyderabad', 'Kolkata', 'Surat', 'Gurugram'];

const generateGstin = (stateCode: string, name: string): string => {
  const pan = name.substring(0, 3).toUpperCase().padEnd(5, 'X') + '1234' + name.substring(name.length - 1).toUpperCase();
  return `${stateCode}${pan}1Z5`;
};

// Core data generator by industry
export const generateIndustryData = (industry: IndustryType): IndustryData => {
  // Let's establish industry-specific configs
  let namePrefix = 'Mfg';
  let revenueBase = 1840000;
  let expenseBase = 720000;
  let clientNames: string[] = [];
  let vendorNames: string[] = [];
  let itemNames: string[] = [];

  switch (industry) {
    case 'Manufacturing':
      namePrefix = 'Steel';
      revenueBase = 2450000;
      expenseBase = 1420000;
      clientNames = ['Apex Automotives', 'Bharata Steel Ltd', 'Kirloskar Parts', 'Tata Motors Group', 'Mahindra Spares', 'BHEL Electric', 'L&T Infra', 'Adani Logistics', 'Jindal Steel', 'Prestige Heavy Industries'];
      vendorNames = ['Sail Mining Corp', 'Vedanta Alum', 'Hindalco Foils', 'Nippon Tubing', 'Jindal Sheet Metal', 'Bosch Castings', 'ABB Power', 'Siemens Automation'];
      itemNames = ['HR Steel Plates', 'Aluminium Ingots', 'Hydraulic Actuators', 'CNC Lathe Castings', 'Copper Wiring Rolls', 'Gearbox Assemblies'];
      break;
    case 'Hotel':
      namePrefix = 'Stay';
      revenueBase = 1680000;
      expenseBase = 980000;
      clientNames = ['MakeMyTrip India', 'Corporate Retreats Inc', 'Aditya Birla Group Events', 'Srinivasan Wedding Host', 'IT Infotech Booking', 'Wipro Corp Travel', 'Google Events APAC', 'Standard Chartered Premium'];
      vendorNames = ['Metro Cash & Carry', 'Taj Dairy Foods', 'Freshly Harvest Farms', 'Kirloskar Generators', 'Standard Linen Supplies', 'Oberoi Florals', 'Bose Sounds India'];
      itemNames = ['Luxury Suite Occupancy', 'Banquet Hall Reservation', 'Executive Catering', 'Corporate Conference Package', 'Spa & Wellness Charges'];
      break;
    case 'Hospital':
      namePrefix = 'Care';
      revenueBase = 3200000;
      expenseBase = 1950000;
      clientNames = ['Star Health Insurance', 'ICICI Lombard Health', 'Max Bupa Health', 'HDFC ERGO General', 'Narayana TPA Services', 'State Govt Medical Relief', 'MedSave TPA Ltd', 'Indian Army ECHS'];
      vendorNames = ['Pfizer India Corp', 'Cipla Medical supplies', 'Siemens Healthcare', 'Philips Med Systems', 'Apollo Pharmacy Wholesales', 'Baxter Lifecare', 'BD Surgical Instruments'];
      itemNames = ['ICU Ward Daily Rate', 'MRI Contrast Scan', 'Cardiac Surgery Package', 'Orthopedic Implants', 'Dialysis Cycle Fee', 'Pharma Consumables'];
      break;
    case 'Retail':
      namePrefix = 'Mart';
      revenueBase = 1450000;
      expenseBase = 1100000;
      clientNames = ['Premium Direct Cash Customers', 'Reliance Retail Partner', 'DMart Wholesale', 'Flipkart Logistics', 'Amazon Seller Network', 'Spencer Stores', 'Big Bazaar Hub'];
      vendorNames = ['Hindustan Unilever', 'ITC Limited', 'Nestle India Ltd', 'Parle Agro Industries', 'Britannia Biscuits', 'Godrej Consumer Goods', 'Dabur India Ltd'];
      itemNames = ['Assorted FMCG Pack', 'Organic Cereal Pallets', 'Dairy Product Consignment', 'Household Cleaners Bulk', 'Confectionery Standard Crate'];
      break;
    case 'Distributor':
      namePrefix = 'Logix';
      revenueBase = 2900000;
      expenseBase = 2200000;
      clientNames = ['Kiran Retail Traders', 'Sunrise Supermart', 'Sharma & Sons Shop', 'Vijay Electronics', 'Kalyan Apparels', 'Royal Provision Store', 'Balaji Distributors', 'Gita General Stores'];
      vendorNames = ['Samsung India', 'LG Electronics Corp', 'Sony India Products', 'Havells Electricals', 'USHA International', 'Bajaj Electricals Ltd', 'Orient Electric'];
      itemNames = ['Smart LED TV 55"', 'Double Door Refrigerator', 'Split AC 1.5 Ton', 'Induction Cooktops', 'BLDC Ceiling Fans'];
      break;
    case 'CA_Firm':
      namePrefix = 'Consult';
      revenueBase = 850000;
      expenseBase = 340000;
      clientNames = ['AlgoForce Tech Pvt Ltd', 'Indo Auto Alloys', 'Sunrise Resorts', 'Medica Hospital Trust', 'HyperMart Retailers', 'A1 Logistics India', 'Vanguard Equity Partners', 'Shakti Infrastructure'];
      vendorNames = ['Hostinger Cloud Solutions', 'Adobe Creative Cloud', 'Microsoft Enterprise Suite', 'WeWork India Office Space', 'Professional Printers Pvt Ltd', 'Luthra Legal Consultants'];
      itemNames = ['Annual Statutory Audit retainer', 'Monthly GST Filing Service', 'Income Tax Representation', 'Corporate Restructuring Consultancy', 'Transfer Pricing Documentation'];
      break;
  }

  // Generate 150 Customers
  const customers: Customer[] = [];
  for (let i = 0; i < 150; i++) {
    const name = clientNames[i % clientNames.length] + (i >= clientNames.length ? ` (Branch ${Math.floor(i / clientNames.length) + 1})` : '');
    const gstin = generateGstin('27', name); // Maharashtra state code 27
    const totalRev = Math.floor(revenueBase * 0.15 * (1 + (i % 5) / 5) * (0.8 + Math.random() * 0.4));
    const outstanding = Math.random() > 0.45 ? Math.floor(totalRev * 0.22 * (Math.random() * 1.5)) : 0;
    const lastPayment = getRandomDate(1, 35);
    const risk: 'Low' | 'Medium' | 'High' = outstanding > (revenueBase * 0.1) ? 'High' : outstanding > (revenueBase * 0.03) ? 'Medium' : 'Low';
    
    let paymentBehavior = 'Usually pays on time';
    if (risk === 'High') paymentBehavior = 'Usually pays 15-20 days late';
    else if (risk === 'Medium') paymentBehavior = 'Usually pays 7-10 days late';

    customers.push({
      id: `cust-${i + 1}`,
      name,
      email: `finance@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
      city: cities[i % cities.length],
      gstin,
      totalRevenue: totalRev,
      outstanding,
      lastPaymentDate: lastPayment,
      riskProfile: risk,
      healthScore: risk === 'High' ? 62 : risk === 'Medium' ? 82 : 96,
      paymentBehavior,
      aiSummary: `${name} is an active client based in ${cities[i % cities.length]}. Total billing of ₹${(totalRev/100000).toFixed(1)}L. ${outstanding > 0 ? `Currently has ₹${(outstanding/100000).toFixed(1)}L outstanding.` : 'Account fully settled.'} Risk index is ${risk}.`
    });
  }

  // Generate 80 Vendors
  const vendors: Vendor[] = [];
  for (let i = 0; i < 80; i++) {
    const name = vendorNames[i % vendorNames.length] + (i >= vendorNames.length ? ` Unit ${Math.floor(i / vendorNames.length) + 1}` : '');
    const category = i % 3 === 0 ? 'Raw Materials' : i % 3 === 1 ? 'Logistics / Services' : 'Operations Supplies';
    const outstanding = Math.random() > 0.6 ? Math.floor(expenseBase * 0.18 * (Math.random() * 1.2)) : 0;
    const vol = Math.floor(expenseBase * 0.3 * (1 + (i % 3) / 3));

    vendors.push({
      id: `vend-${i + 1}`,
      name,
      category,
      gstin: generateGstin('09', name), // UP code 09
      outstanding,
      lastPurchaseDate: getRandomDate(2, 40),
      riskScore: outstanding > (expenseBase * 0.08) ? 75 : 32,
      purchaseVolume: vol,
      aiSummary: `${name} handles ${category.toLowerCase()}. Total procurement of ₹${(vol/100000).toFixed(1)}L. GST compliance checks suggest active status with 100% ITC reconciliation match.`
    });
  }

  // Generate 200 Invoices (interconnected with Customers/Vendors)
  const invoices: Invoice[] = [];
  for (let i = 0; i < 200; i++) {
    const isSales = i % 2 === 0;
    let partyName = '';
    let partyGstin = '';
    let amount = 0;

    if (isSales) {
      const cust = customers[i % customers.length];
      partyName = cust.name;
      partyGstin = cust.gstin;
      amount = Math.floor(35000 + (i % 12) * 18000 + Math.random() * 8000);
    } else {
      const vend = vendors[i % vendors.length];
      partyName = vend.name;
      partyGstin = vend.gstin;
      amount = Math.floor(25000 + (i % 8) * 14000 + Math.random() * 6000);
    }

    const gstAmount = Math.floor(amount * 0.18); // standard 18%
    const status: Invoice['status'] = i % 15 === 0 ? 'Overdue' : i % 6 === 0 ? 'Unpaid' : i % 30 === 0 ? 'Draft' : 'Paid';
    const date = getRandomDate(1, 55);
    const dueDate = getFutureDate(date, 30);
    const hsn = `HSN-${7200 + (i % 10) * 12}`;

    invoices.push({
      id: `inv-${i + 1}`,
      invoiceNumber: `${isSales ? 'INV' : 'BILL'}/2026/${1000 + i}`,
      partyName,
      partyGstin,
      amount,
      gstAmount,
      type: isSales ? 'sales' : 'purchase',
      status,
      date,
      dueDate,
      hsnCode: hsn,
      items: [
        {
          description: itemNames[i % itemNames.length] || 'Standard Services / Goods',
          quantity: (i % 5) + 1,
          rate: Math.floor(amount / ((i % 5) + 1)),
          amount: amount,
          hsn
        }
      ],
      confidence: 100
    });
  }

  // Add specific duplicate audit issues for the demo story
  invoices[28].amount = invoices[29].amount;
  invoices[28].partyName = invoices[29].partyName;
  invoices[28].date = invoices[29].date;
  invoices[28].duplicateOf = invoices[29].invoiceNumber;
  invoices[28].confidence = 99;
  invoices[28].explainText = `Invoice ${invoices[28].invoiceNumber} has exact matching amount (₹${invoices[28].amount.toLocaleString('en-IN')}), same Vendor (${invoices[28].partyName}), and same date (${invoices[28].date}) as Invoice ${invoices[29].invoiceNumber}. Highly likely duplicate entry in ledger.`;

  // Generate 500 Transactions
  const transactions: Transaction[] = [];
  const bankNames = ['HDFC Bank', 'ICICI Bank', 'State Bank of India'];
  for (let i = 0; i < 500; i++) {
    const isCredit = i % 2 === 0;
    let description = '';
    let amount = 0;
    
    if (isCredit) {
      const cust = customers[i % clientNames.length];
      description = `NEFT / INW / ${cust.name.substring(0, 10).toUpperCase()}`;
      amount = Math.floor(15000 + (i % 25) * 8500 + Math.random() * 2000);
    } else {
      const vend = vendors[i % vendorNames.length];
      description = `RTGS / OUTW / ${vend.name.substring(0, 10).toUpperCase()}`;
      amount = Math.floor(10000 + (i % 20) * 9200 + Math.random() * 1500);
    }

    const tDate = getRandomDate(1, 60);
    const status: Transaction['status'] = i % 18 === 0 ? 'Duplicate' : i % 8 === 0 ? 'Unmatched' : 'Matched';
    let suggestion = '';
    if (status === 'Unmatched') {
      suggestion = isCredit ? 'Map to Outstanding Sales Invoices' : 'Map to Vendor Purchase Ledger';
    }

    transactions.push({
      id: `txn-${i + 1}`,
      date: tDate,
      description,
      amount,
      type: isCredit ? 'credit' : 'debit',
      status,
      matchSuggestion: suggestion,
      bankName: bankNames[i % bankNames.length],
      refNo: `TXN${20260700000 + i}`,
      confidence: status === 'Matched' ? 95 : 45
    });
  }

  // Set up 1 transaction as a duplicate explicitly for bank recon flow
  transactions[45].status = 'Duplicate';
  transactions[45].matchSuggestion = `Same amount & date as reference TXN20260700030`;
  transactions[45].confidence = 98;

  // Generate GST compliance issues
  const gstIssues: GstIssue[] = [
    {
      id: 'gst-1',
      type: 'ITC Mismatch',
      partyName: vendors[0].name,
      gstin: vendors[0].gstin,
      invoiceNo: invoices[1].invoiceNumber,
      amount: 18450,
      desc: 'Vendor uploaded invoice with GST ₹18,450 but our ledger records show ₹10,450. Difference of ₹8,000 in ITC claim.',
      status: 'Pending',
      confidence: 96,
      explainText: 'GSTR-2B logs retrieved from the GST Portal on 02/07/2026 reflect an CGST/SGST of ₹18,450 uploaded by vendor, whereas purchase voucher entry has an input tax of ₹10,450. Difference identified: ₹8,000. Confidence is 96% due to exact mismatch alignment on invoice matching keys.'
    },
    {
      id: 'gst-2',
      type: 'Wrong GSTIN',
      partyName: customers[0].name,
      gstin: customers[0].gstin.replace('Z5', 'X2'),
      invoiceNo: invoices[2].invoiceNumber,
      amount: 43200,
      desc: 'GSTIN entered in invoice does not exist or has been cancelled on the portal. Validation failed.',
      status: 'Pending',
      confidence: 100,
      explainText: 'Real-time API lookup on GST Portal database returned code "404 - GSTIN Not Found / Inactive". The suffix was wrongly formatted as "X2" instead of "Z5" in the customer database.'
    },
    {
      id: 'gst-3',
      type: 'Duplicate Invoice',
      partyName: vendors[1].name,
      gstin: vendors[1].gstin,
      invoiceNo: invoices[28].invoiceNumber,
      amount: invoices[28].amount,
      desc: `Duplicate purchase invoice entry found in ledger with identical billing reference details.`,
      status: 'Pending',
      confidence: 99,
      explainText: `Invoice ${invoices[28].invoiceNumber} matches ${invoices[29].invoiceNumber} identically. ITC already claimed on primary voucher. Claiming twice risks penal interest of 18% under GST Section 50.`
    },
    {
      id: 'gst-4',
      type: 'HSN Mismatch',
      partyName: vendors[2].name,
      gstin: vendors[2].gstin,
      invoiceNo: invoices[4].invoiceNumber,
      amount: 12000,
      desc: 'HSN code used has incorrect GST rate (12% instead of 18% mandated rate for industrial raw components).',
      status: 'Pending',
      confidence: 95,
      explainText: 'For HSN code "7210", standard GST rate in India is 18%. The voucher uses a 12% rate, creating a risk of mismatch in GSTR-1 matching.'
    }
  ];

  // Generate AI Audit Issues
  const auditIssues: AuditIssue[] = [
    {
      id: 'aud-1',
      type: 'Duplicate Entry',
      title: 'Duplicate Purchase Voucher Detected',
      desc: `Identified duplicate booking of raw logistics invoice worth ₹${invoices[28].amount.toLocaleString('en-IN')} with vendor ${invoices[28].partyName}.`,
      riskLevel: 'High',
      amount: invoices[28].amount,
      confidence: 99,
      status: 'Pending',
      explainText: `Ledger ledger scan found double booking of identical charges. First voucher: VOUCH/2026/0891, Second voucher: VOUCH/2026/0942. Both point to physical invoice ${invoices[28].invoiceNumber}.`,
      collaborationLog: [
        'AI Auditor: Anomaly flag - duplicate invoice INV-2026/1108 detected.',
        'AI GST Expert: Confirmed. GSTR-2B shows only one match; double-claiming ITC is illegal.',
        'AI CFO: Total risk computed: ₹' + Math.floor(invoices[28].amount * 0.18).toLocaleString('en-IN') + ' in wrong tax claims. Suggest prompt reversal.'
      ]
    },
    {
      id: 'aud-2',
      type: 'Missing Voucher',
      title: 'Missing Payment Proof (Voucher Mismatch)',
      desc: 'Bank payment of ₹85,000 to Tata Suppliers has no corresponding debit voucher or bill attached in Tally Prime.',
      riskLevel: 'Medium',
      amount: 85000,
      confidence: 92,
      status: 'Pending',
      explainText: 'Debit entry on 14/06/2026 in ICICI Current Account lacks any matching receipt reference or purchase journal entry. Creates audit gap under Companies Act.',
      collaborationLog: [
        'AI Auditor: Flagged cash outflow of ₹85,000 with no invoice.',
        'AI CFO: Expense is unclassified. Working capital calculations impacted.'
      ]
    },
    {
      id: 'aud-3',
      type: 'Tax Mistake',
      title: 'Reverse Charge Mechanism (RCM) Omission',
      desc: 'Legal consultant service fee of ₹45,000 was paid without computing liability under GST Reverse Charge.',
      riskLevel: 'High',
      amount: 45000,
      confidence: 95,
      status: 'Pending',
      explainText: 'Legal services in India attract 18% GST under RCM (notification 13/2017). Company must pay ₹8,100 to government cash ledger and claim it as ITC.',
      collaborationLog: [
        'AI Auditor: Identified vendor as legal firm. Omission of RCM check.',
        'AI GST Expert: Liability matches code 9982. Added to pending GSTR-3B filings.'
      ]
    },
    {
      id: 'aud-4',
      type: 'Inventory Mismatch',
      title: 'Ledger vs Stock Ledger Discrepancy',
      desc: 'Stock ledger shows raw materials count out of sync with purchase invoices by 12 units.',
      riskLevel: 'Low',
      amount: 18000,
      confidence: 88,
      status: 'Pending',
      explainText: 'Receipt note REC/098 has 12 units of items checked in, but corresponding vendor invoice has only billed for 10 units. Discrepancy value ₹18,000.',
      collaborationLog: [
        'AI Auditor: Inventory mismatch on CNC components.',
        'AI CFO: Minor inventory asset valuation impact. Suggest physical verification.'
      ]
    }
  ];

  // Specific ROI indicators and health levels per industry
  let finalScores = { overall: 92, cashFlow: 95, gst: 100, receivables: 63, inventory: 88, audit: 96 };
  let finalRoi = { manualHours: 62, savedHours: 51, recoveredAmount: 820000, gstErrorsPrevented: 18, auditIssuesFixed: 12, outstandingReduced: 540000 };
  
  // Create beautiful metrics scale
  let scale = 1.0;
  if (industry === 'Manufacturing') scale = 1.35;
  if (industry === 'Hospital') scale = 1.75;
  if (industry === 'CA_Firm') scale = 0.65;
  if (industry === 'Retail') scale = 0.95;
  if (industry === 'Distributor') scale = 1.5;

  const rev = Math.floor(revenueBase * scale);
  const exp = Math.floor(expenseBase * scale * 0.95);
  const rec = Math.floor(rev * 0.35);
  const pay = Math.floor(exp * 0.28);
  const cash = Math.floor(rev * 0.25);
  const gstD = Math.floor((rev - exp) * 0.18);
  const bBal = Math.floor(rev * 0.65);

  let finalKpis = {
    revenue: rev,
    revenueGrowth: 12 + (scale > 1.2 ? 6 : -3),
    expenses: exp,
    netProfit: rev - exp,
    receivables: rec,
    payables: pay,
    cashAvailable: cash,
    gstDue: gstD,
    bankBalance: bBal
  };

  switch (industry) {
    case 'Manufacturing':
      finalScores = { overall: 89, cashFlow: 88, gst: 92, receivables: 68, inventory: 82, audit: 91 };
      finalRoi = { manualHours: 85, savedHours: 71, recoveredAmount: 1240000, gstErrorsPrevented: 24, auditIssuesFixed: 18, outstandingReduced: 820000 };
      break;
    case 'Hotel':
      finalScores = { overall: 94, cashFlow: 96, gst: 98, receivables: 94, inventory: 90, audit: 93 };
      finalRoi = { manualHours: 45, savedHours: 36, recoveredAmount: 480000, gstErrorsPrevented: 12, auditIssuesFixed: 8, outstandingReduced: 210000 };
      break;
    case 'Hospital':
      finalScores = { overall: 86, cashFlow: 82, gst: 88, receivables: 59, inventory: 85, audit: 86 };
      finalRoi = { manualHours: 110, savedHours: 92, recoveredAmount: 1850000, gstErrorsPrevented: 35, auditIssuesFixed: 22, outstandingReduced: 1120000 };
      break;
    case 'Retail':
      finalScores = { overall: 95, cashFlow: 95, gst: 99, receivables: 98, inventory: 78, audit: 95 };
      finalRoi = { manualHours: 55, savedHours: 46, recoveredAmount: 350000, gstErrorsPrevented: 14, auditIssuesFixed: 7, outstandingReduced: 150000 };
      break;
    case 'Distributor':
      finalScores = { overall: 90, cashFlow: 87, gst: 94, receivables: 62, inventory: 80, audit: 92 };
      finalRoi = { manualHours: 95, savedHours: 80, recoveredAmount: 1420000, gstErrorsPrevented: 28, auditIssuesFixed: 15, outstandingReduced: 940000 };
      break;
    case 'CA_Firm':
      finalScores = { overall: 96, cashFlow: 94, gst: 98, receivables: 85, inventory: 100, audit: 98 };
      finalRoi = { manualHours: 75, savedHours: 63, recoveredAmount: 920000, gstErrorsPrevented: 22, auditIssuesFixed: 14, outstandingReduced: 480000 };
      break;
  }

  return {
    industryName: industry.replace('_', ' '),
    kpis: finalKpis,
    healthScores: finalScores,
    roiStats: finalRoi,
    invoices,
    customers,
    vendors,
    transactions,
    gstIssues,
    auditIssues
  };
};
