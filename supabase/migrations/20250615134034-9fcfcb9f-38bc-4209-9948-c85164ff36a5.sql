
-- Create clients table for accounting firms
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  business_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accounting_connections table to track QuickBooks/Xero connections
CREATE TABLE public.accounting_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('quickbooks', 'xero')),
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'connecting')),
  connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for clients table
CREATE POLICY "Firms can view their own clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() = firm_id);

CREATE POLICY "Firms can create their own clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() = firm_id);

CREATE POLICY "Firms can update their own clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() = firm_id);

CREATE POLICY "Firms can delete their own clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() = firm_id);

-- RLS policies for accounting_connections table
CREATE POLICY "Users can view their own connections" 
  ON public.accounting_connections 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections" 
  ON public.accounting_connections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections" 
  ON public.accounting_connections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
  ON public.accounting_connections 
  FOR DELETE 
  USING (auth.uid() = user_id);
