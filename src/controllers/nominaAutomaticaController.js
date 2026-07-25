let listaEmpleados = [];

// Constantes de referencia Colombia 2026
const SMMLV_2026 = 1750905;
const AUX_TRANSPORTE_2026 = 249095;
const DIVISOR_HORAS = 210;

exports.getNominaView = (req, res) => {
    // Si manejas una vista unificada o separate, mantenemos la compatibilidad enviando la lista
    res.render('nominaAutomatica', { empleados: listaEmpleados });
};

exports.agregarEmpleado = (req, res) => {
    const { 
        nombre, 
        documento, 
        salario, 
        dias, 
        arl = 0.00522, 
        hed = 0, 
        hen = 0, 
        rn = 0, 
        hdf = 0, 
        otrosDevengados = 0, 
        otrasDeducciones = 0 
    } = req.body;
    
    const salarioBase = parseFloat(salario) || 0;
    const diasTrabajados = parseInt(dias) || 30;
    
    // Proporcionalidad por días trabajados (máximo 30)
    const diasEfectivos = Math.min(diasTrabajados, 30);
    const proporcion = diasEfectivos / 30;
    const salarioProporcional = salarioBase * proporcion;
    
    // Auxilio de transporte 2026 (aplica si el salario base es <= 2 SMMLV)
    const tieneAuxTransp = salarioBase <= (2 * SMMLV_2026);
    const auxTransp = tieneAuxTransp ? (AUX_TRANSPORTE_2026 * proporcion) : 0;
    
    // Valor de la hora ordinaria y recargos / horas extra
    const valorHora = salarioBase / DIVISOR_HORAS;
    const valHed = (parseFloat(hed) || 0) * valorHora * 1.25;
    const valHen = (parseFloat(hen) || 0) * valorHora * 1.75;
    const valRn  = (parseFloat(rn) || 0) * valorHora * 0.35;
    const valHdf = (parseFloat(hdf) || 0) * valorHora * 0.75;
    const totalExtras = valHed + valHen + valRn + valHdf;

    const devengadosNoSalariales = parseFloat(otrosDevengados) || 0;
    const totalDevengado = salarioProporcional + totalExtras + auxTransp + devengadosNoSalariales;
    
    // IBC (Ingreso Base de Cotización) limitado a mínimo 1 SMMLV proporcional
    const ibcMinimo = SMMLV_2026 * proporcion;
    const ibc = Math.max(salarioProporcional + totalExtras, ibcMinimo);

    // Deducciones de Ley Empleado (Salud y Pensión 4% + 4%)
    const salud = ibc * 0.04;
    const pension = ibc * 0.04;
    
    // Fondo de Solidaridad Pensional (FSP) si aplica >= 4 SMMLV mensuales equivalentes
    let fspRate = 0;
    const smmlvsIbc = (ibc * 30 / diasEfectivos) / SMMLV_2026;
    if (smmlvsIbc >= 4) fspRate = 0.01;
    if (smmlvsIbc > 16) fspRate = 0.012;
    if (smmlvsIbc > 17) fspRate = 0.014;
    if (smmlvsIbc > 18) fspRate = 0.016;
    if (smmlvsIbc > 19) fspRate = 0.018;
    if (smmlvsIbc > 20) fspRate = 0.02;
    const fsp = ibc * fspRate;

    const deduccionesOtras = parseFloat(otrasDeducciones) || 0;
    const totalDeducciones = salud + pension + fsp + deduccionesOtras;
    const netoPagar = totalDevengado - totalDeducciones;

    // Aportes Patronales y Provisiones (Costo total empleador)
    const exoneradoLey = smmlvsIbc < 10;
    const saludPatronal = exoneradoLey ? 0 : ibc * 0.085;
    const pensionPatronal = ibc * 0.12;
    const riesgoArl = ibc * (parseFloat(arl) || 0.00522);
    const sena = exoneradoLey ? 0 : ibc * 0.02;
    const icbf = exoneradoLey ? 0 : ibc * 0.03;
    const cajaCompensacion = ibc * 0.04;

    const basePrestacional = salarioProporcional + totalExtras + auxTransp;
    const cesantias = basePrestacional * 0.0833;
    const interesesCesantias = cesantias * 0.01;
    const primaServicios = basePrestacional * 0.0833;
    const vacaciones = (salarioProporcional + totalExtras) * 0.0417;
    const totalProvisiones = cesantias + interesesCesantias + primaServicios + vacaciones;

    const costoEmpleador = totalDevengado + saludPatronal + pensionPatronal + riesgoArl + sena + icbf + cajaCompensacion + totalProvisiones;

    // Objeto estructurado completo preservando propiedades originales intactas
    listaEmpleados.push({
        nombre,
        documento,
        salario: Math.round(salarioProporcional),
        auxTransp: Math.round(auxTransp),
        totalDevengado: Math.round(totalDevengado),
        salud: Math.round(salud),
        pension: Math.round(pension),
        fsp: Math.round(fsp),
        otrasDeducciones: Math.round(deduccionesOtras),
        netoPagar: Math.round(netoPagar),
        // Campos adicionales calculados para analítica y reportes
        dias: diasEfectivos,
        extras: Math.round(totalExtras),
        costoEmpleador: Math.round(costoEmpleador),
        provisiones: Math.round(totalProvisiones)
    });

    res.redirect('/nomina-automatica');
};