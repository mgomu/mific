export interface FundRecord {
  codigoNegocio: string;
  nombreEntidad: string;
  nombrePatrimonio: string;
  nombreTipoPatrimonio: string;
  nombreSubtipoPatrimonio: string;
  valorUnidad: number;
  valorFondo: number;
  numeroInversionistas: number;
  rentabilidadDiaria: number;
  rentabilidadMensual: number;
  rentabilidadSemestral: number;
  rentabilidadAnual: number;
  fechaCorte: Date;
  rendimientosAbonados: number;
  aportesRecibidos: number;
  retirosRedenciones: number;
}

export interface SodaRawRecord {
  codigo_negocio: string;
  nombre_entidad: string;
  nombre_patrimonio: string;
  nombre_tipo_patrimonio: string;
  nombre_subtipo_patrimonio: string;
  valor_unidad_operaciones: string;
  valor_fondo_cierre_dia_t: string;
  numero_inversionistas: string;
  rentabilidad_diaria: string;
  rentabilidad_mensual: string;
  rentabilidad_semestral: string;
  rentabilidad_anual: string;
  fecha_corte: string;
  rendimientos_abonados: string;
  aportes_recibidos: string;
  retiros_redenciones: string;
}
