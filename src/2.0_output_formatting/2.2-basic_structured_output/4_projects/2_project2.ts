
// Data Extraction from Unstructured Text
// Another common use case is extracting specific information from documents, emails, or web pages:


import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const model = google('gemini-1.5-flash');

async function extractInvoiceData(invoiceText: string) {
  const invoiceSchema = z.object({
    invoiceNumber: z.string().describe('The invoice number or ID'),
    
    date: z.string().describe('Invoice date in YYYY-MM-DD format'),
    
    vendor: z.object({
      name: z.string().describe('Vendor company name'),
      address: z.string().optional().describe('Vendor address'),
      contact: z.string().optional().describe('Contact email or phone'),
    }).describe('Vendor information'),
    
    customer: z.object({
      name: z.string().describe('Customer name or company'),
      address: z.string().optional().describe('Customer address'),
    }).describe('Customer information'),
    
    items: z.array(
      z.object({
        description: z.string().describe('Item or service description'),
        quantity: z.number().describe('Quantity ordered'),
        unitPrice: z.number().describe('Price per unit'),
        total: z.number().describe('Total price for this line item'),
      })
    ).describe('Line items on the invoice'),
    
    subtotal: z.number().describe('Subtotal before tax'),
    tax: z.number().describe('Tax amount'),
    total: z.number().describe('Grand total'),
  });

  const result = await generateText({
    model: model,
    output: Output.object({
      schema: invoiceSchema,
    }),
    prompt: `Extract invoice information from this text:\n\n${invoiceText}`,
  });

  return result.output;
}
