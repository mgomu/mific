-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table fund_records (
  codigo_negocio text not null,
  fecha_corte date not null,
  nombre_entidad text not null,
  nombre_patrimonio text not null,
  nombre_tipo_patrimonio text not null,
  nombre_subtipo_patrimonio text not null,
  valor_unidad numeric not null default 0,
  valor_fondo numeric not null default 0,
  numero_inversionistas integer not null default 0,
  rentabilidad_diaria numeric not null default 0,
  rentabilidad_mensual numeric not null default 0,
  rentabilidad_semestral numeric not null default 0,
  rentabilidad_anual numeric not null default 0,
  rendimientos_abonados numeric not null default 0,
  aportes_recibidos numeric not null default 0,
  retiros_redenciones numeric not null default 0,
  synced_at timestamptz not null default now(),

  primary key (codigo_negocio, fecha_corte)
);

-- Index for date-based queries (latest funds, history ranges)
create index idx_fund_records_fecha on fund_records (fecha_corte desc);

-- Index for fund history lookups
create index idx_fund_records_codigo_fecha on fund_records (codigo_negocio, fecha_corte asc);

-- Enable RLS but allow service role full access
alter table fund_records enable row level security;

-- Public read access (for anon/publishable key)
create policy "Public read access" on fund_records
  for select using (true);

-- Latest record per fund, excluding discontinued ones (no data in 90 days).
-- Funds that report weekly will still appear; funds last seen years ago won't.
create or replace view fund_latest as
select distinct on (codigo_negocio) *
from fund_records
where fecha_corte >= current_date - interval '90 days'
order by codigo_negocio, fecha_corte desc;
