"""
Logica de negocio para Ingredientes.

Calculo automatico de merma:
    merma_porcentaje = ((peso_bruto - peso_neto) / peso_bruto) * 100

Si peso_bruto es 0, la merma se considera 0 (evita division entre cero).
"""


def calcular_merma_porcentaje(peso_bruto: float, peso_neto: float) -> float:
    if not peso_bruto or peso_bruto <= 0:
        return 0.0
    if peso_neto is None:
        peso_neto = 0
    if peso_neto > peso_bruto:
        # Validacion defensiva: no puede haber neto mayor que bruto.
        peso_neto = peso_bruto
    return ((peso_bruto - peso_neto) / peso_bruto) * 100.0
