import type { LegalDocumentTemplate } from '../types/veterinary';

export const INITIAL_LEGAL_DOCUMENTS: LegalDocumentTemplate[] = [
  {
    id: 'doc_1',
    fileName: '1 Historia Clinica.docx',
    title: 'Historia Clínica Veterinaria',
    category: 'Formatos Médicos',
    description: 'Ficha médica completa para registro de paciente, datos del propietario, antecedentes patológicos y observaciones clínicas.',
    content: `HISTORIA CLÍNICA

(Fecha)
Nombre del representante legal: ________________________________ Sexo (M) (F)
Dirección: ________________________________ Teléfono: ________________________
Edad: ______ Ocupación: ________________ Edo. Civil: ________________
Lugar de Residencia: ________________________ Escolaridad: ________________

Datos del paciente:
Nombre: ________________________________ Especie: ________________
Sexo: ________________ Raza: ________________
Fecha de nacimiento: ________________ Color de piel: ________________
Cartilla de vacunación: ________________ Procedencia: ________________
Características distintivas: ________________ Observaciones clínicas: ________________

ANTECEDENTES PERSONALES
Patológicos:
¿Es el paciente diabético? Si ( ) no( )
En caso de ser hembra:
¿La paciente está preñada? Si ( ) no( )
¿Ha tenido algún accidente? (si) (no) ¿Cuál? ________________ ¿A qué edad? ________________
Alguna vez le han puesto sangre (si) (no) Lo han operado alguna vez (si) (no)
Describa la operación: ________________
¿El paciente es alérgico a algún medicamento, alimento u otra causa? (si) (no) ¿A cuál? ________________
Paciente cooperador (si) (no) Bien orientado (si) (no)
¿Movimientos anormales? (si) (no) ¿Cuáles ? ________________
Antecedentes patológicas (si) (no) ¿Cuáles ? ________________
El paciente está bajo algún tratamiento médico veterinario (si) (no)
Comentarios: ________________

No patológicos:
Alimentación: ________________
Cantidad y Calidad: Buena ( ) Regular ( ) Deficiente ( )
Higiene Personal: ________________ Frecuencia de baño: ________________
Vacunas (si) (no) ¿Cuáles? ________________
Proporcionó su cartilla de vacunación (si) (no)`
  },
  {
    id: 'doc_2',
    fileName: '2. CONSENTIMIENTO INFORMADO.docx',
    title: 'Consentimiento Informado Veterinario',
    category: 'Consentimientos',
    description: 'Documento legal de autorización informada del cliente para procedimientos médicos, anestésicos y quirúrgicos.',
    content: `CONSENTIMIENTO INFORMADO

Por medio de la presente, el Sr.(a) [Nombre del Cliente], como propietario o responsable del paciente de especie [Especie], raza [Raza], de nombre [Nombre de la Mascota], autorizo al equipo médico veterinario de la clínica a realizar los estudios, tratamientos, procedimientos anestésicos y quirúrgicos necesarios para la atención de la salud de mi mascota.

He sido informado de los riesgos asociados a los procedimientos médicos y anestésicos, así como de los cuidados posteriores que debo brindar a mi mascota.

Manifiesto mi conformidad y consentimiento para proceder con los tratamientos indicados por el profesional.`
  },
  {
    id: 'doc_3',
    fileName: '3. Aviso de Privacidad.docx',
    title: 'Aviso de Privacidad (Versión Completa)',
    category: 'Avisos de Privacidad',
    description: 'Términos completos de salvaguarda, privacidad y protección de datos personales de los clientes de conformidad con la Ley.',
    content: `AVISO DE PRIVACIDAD

Su privacidad y confianza son muy importantes para nosotros, por ello queremos asegurarnos que conozca como salvaguardamos la integridad, privacidad y protección de sus datos personales, por lo que se informa a usted los términos en que serán tratados los datos personales que recaben.

Definiciones.
De conformidad con el artículo 3 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, se entenderá como:
Aviso de Privacidad: Documento físico, electrónico o en cualquier otro formato generado por el responsable que es puesto a disposición del titular, previo al tratamiento de sus datos personales.

Finalidad del Tratamiento de Datos:
Los datos personales recabados serán utilizados exclusivamente para la prestación de servicios médico veterinarios, expediente clínico de su mascota, facturación, contacto y seguimiento de citas o tratamientos.`
  },
  {
    id: 'doc_4',
    fileName: '4. Aviso de Privacidad (version resumida).docx',
    title: 'Aviso de Privacidad (Versión Resumida)',
    category: 'Avisos de Privacidad',
    description: 'Versión corta del aviso de privacidad para exhibición en recepción o entrega rápida al cliente.',
    content: `AVISO DE PRIVACIDAD (VERSIÓN RESUMIDA)

La clínica es responsable del tratamiento de sus datos personales, los cuales se utilizarán para la identificación, integración de expediente clínico veterinario de su mascota, contacto para dar seguimiento a tratamientos médicos, agendar citas y emisión de comprobantes de pago.

Para conocer nuestro aviso de privacidad integral con el detalle de las finalidades y derechos ARCO, puede solicitarlo en la recepción de nuestro consultorio.`
  },
  {
    id: 'doc_7',
    fileName: '7. Alta Voluntaria de paciente.docx',
    title: 'Carta de Alta Voluntaria',
    category: 'Formatos Médicos',
    description: 'Documento para el retiro anticipado y voluntario de un paciente por decisión explícita del propietario.',
    content: `ALTA VOLUNTARIA DE PACIENTE

Por medio del presente documento, el C. [Nombre del Cliente], propietario o responsable del paciente de nombre [Nombre de la Mascota], manifiesta su decisión voluntaria de solicitar el alta médica y retiro de las instalaciones médicas de su mascota.

Asumo la total responsabilidad de la salud, evolución y cuidados del paciente a partir de este momento, liberando a la clínica y al profesional médico veterinario tratante de las consecuencias médicas o complicaciones que pudieran derivarse de esta decisión.`
  },
  {
    id: 'doc_8',
    fileName: '8. Contrato de pension de cuidado de animales.docx',
    title: 'Contrato de Pensión y Cuidado Animal',
    category: 'Servicios',
    description: 'Contrato para hospedaje, cuidado temporal y pensión de perros y gatos en la clínica.',
    content: `CONTRATO DE PRESTACIÓN DE SERVICIOS DE PENSIÓN Y CUIDADO ANIMAL

Que celebran por una parte el C. [Nombre del Cliente], a quien en lo sucesivo se le denominará “EL CLIENTE”, y por la otra El Médico Veterinario Zootecnista a quien se le denominará “EL PROFESIONISTA”, al tenor de las siguientes declaraciones y cláusulas:

DECLARACIONES:
I.- Declara EL PROFESIONISTA estar dedicado a la prestación de servicios veterinarios y alojamiento temporal de mascotas.
II.- Declara EL CLIENTE ser legítimo propietario del paciente de nombre [Nombre de la Mascota], especie [Especie], raza [Raza].

CLÁUSULAS:
PRIMERA.- EL PROFESIONISTA brindará alojamiento, alimentación y cuidados generales al paciente durante el periodo acordado.
SEGUNDA.- EL CLIENTE se obliga a proporcionar la cartilla de vacunación vigente del paciente.
TERCERA.- En caso de requerir atención médica de emergencia, EL PROFESIONISTA queda autorizado a aplicar los tratamientos necesarios.`
  },
  {
    id: 'doc_9',
    fileName: '9. Certificado medico veterinario.docx',
    title: 'Certificado Médico Veterinario',
    category: 'Formatos Médicos',
    description: 'Certificado de salud animal para viaje, adopción o verificación de estado clínico.',
    content: `CERTIFICADO MÉDICO VETERINARIO

FECHA DE EXPEDICIÓN: ________________________
PROPIETARIO: [Nombre del Cliente]
PACIENTE: [Nombre de la Mascota]
ESPECIE: [Especie]
RAZA: [Raza]
EDAD: ________________
SEXO: ________________

El que suscribe, Médico Veterinario Zootecnista tratante, CERTIFICA que ha examinado clínicamente al paciente arriba descrito, encontrándolo clínicamente SANO y apto, con su esquema de vacunación y desparasitación vigentes.`
  },
  {
    id: 'doc_10',
    fileName: '10. Contrato de prestacion de servicios de Cirugia.doc',
    title: 'Contrato de Servicios de Cirugía',
    category: 'Contratos',
    description: 'Contrato profesional y consentimiento para intervención quirúrgica y anestesia.',
    content: `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES DE CIRUGÍA

Que celebran por una parte el C. [Nombre del Cliente], a quien en lo sucesivo se le denominara “EL CLIENTE”, y por la otra El Médico Veterinario Zootecnista a quien se le denominara como “EL PROFESIONISTA”, que sujetan al tenor de las siguientes declaraciones y cláusulas:

D E C L A R A C I O N E S
I.- Declara “EL PROFESIONISTA” que es una persona física dedicada a la profesión de médico veterinario zootecnista.
II.- Declara “EL CLIENTE” ser propietario de la mascota [Nombre de la Mascota], especie [Especie].

C L Á U S U L A S
PRIMERA.- El objeto del presente contrato es la realización de la intervención quirúrgica prescripta para el paciente.
SEGUNDA.- EL CLIENTE autoriza los procedimientos de anestesia general o local necesarios para la cirugía.
TERCERA.- EL CLIENTE se compromete a cubrir los honorarios médicos y seguir las indicaciones postoperatorias.`
  },
  {
    id: 'doc_11',
    fileName: '11. Carta de hospitalizacion.docx',
    title: 'Carta de Hospitalización',
    category: 'Formatos Médicos',
    description: 'Autorización y registro de ingreso a área de internamiento hospitalario veterinario.',
    content: `CARTA DE AUTORIZACIÓN DE HOSPITALIZACIÓN

Fecha: ________________________
Nombre del Propietario: [Nombre del Cliente]
Nombre del Paciente: [Nombre de la Mascota]
Especie / Raza: [Especie] / [Raza]
Motivo de Ingreso: ________________________________

Por medio de la presente autorizo la hospitalización e internamiento de mi mascota para monitoreo, canalización, aplicación de tratamiento médico y cuidados intensivos según lo requiera su condición de salud.`
  },
  {
    id: 'doc_12',
    fileName: '12. Indicaciones POST OPERATORIAS.docx',
    title: 'Indicaciones Post-Operatorias',
    category: 'Formatos Médicos',
    description: 'Hoja de instrucciones, medicamentos y cuidados para el paciente en recuperación tras cirugía.',
    content: `INDICACIONES POST-OPERATORIAS

Paciente: [Nombre de la Mascota]
Propietario: [Nombre del Cliente]
Fecha de Cirugía: ________________________

CUIDADOS RECOMENDADOS:
1. Reposo absoluto por _____ días. Evitar saltos, carreras y juegos bruscos.
2. Mantener la herida quirúrgica limpia y seca. Usar collar isabelino permanentemente.
3. Medicación prescrita:
   - Analgésico / Antiinflamatorio: ________________________________
   - Antibiótico: ________________________________
4. Cita para revisión de puntos: ________________________`
  },
  {
    id: 'doc_13',
    fileName: '13. Autorizacion para eutanasia de paciente.docx',
    title: 'Autorización para Eutanasia Humanitaria',
    category: 'Consentimientos',
    description: 'Consentimiento informado para procedimiento de eutanasia humanitaria por enfermedad terminal.',
    content: `AUTORIZACIÓN PARA EUTANASIA HUMANITARIA DE PACIENTE

Fecha: ________________________
Yo, C. [Nombre del Cliente], mayor de edad, en mi carácter de propietario o responsable legal del paciente [Nombre de la Mascota], especie [Especie], raza [Raza], otorgo mi consentimiento libre e informado para que el Médico Veterinario proceda a la eutanasia humanitaria de mi mascota.

Manifiesto que esta decisión ha sido tomada tras la evaluación clínica médica, diagnóstico de patología o condición terminal con sufrimiento no tratable, buscando el bienestar del paciente.`
  },
  {
    id: 'doc_14',
    fileName: '14. Contrato de prestacion de servicios de Estetica.docx',
    title: 'Contrato de Servicios de Estética Canina / Felina',
    category: 'Servicios',
    description: 'Contrato de servicios de baño, corte de pelo, limpieza y arreglo estético.',
    content: `CONTRATO DE PRESTACIÓN DE SERVICIOS DE ESTÉTICA CANINA Y FELINA

Que celebran por una parte el C. [Nombre del Cliente], a quien en lo sucesivo se le denominara “EL CLIENTE”, y por la otra el Médico Veterinario Zootecnista a quien se le denominara como “EL PROFESIONISTA”, al tenor de las siguientes declaraciones y cláusulas:

D E C L A R A C I O N E S
I.- Declara “EL PROFESIONISTA” contar con personal capacitado e instalaciones adecuadas para servicios de grooming y estética.
II.- Declara “EL CLIENTE” requerir los servicios de estética para su mascota [Nombre de la Mascota].

C L Á U S U L A S
PRIMERA.- El servicio incluye baño, secado, corte de pelo acordado, corte de uñas y limpieza de oídos.
SEGUNDA.- EL CLIENTE debe informar si el paciente presenta conductas agresivas o condiciones de piel preexistentes.`
  },
  {
    id: 'doc_15',
    fileName: '15. CONTRATO DE ADIESTRAMIENTO CANINO.docx',
    title: 'Contrato de Adiestramiento Canino',
    category: 'Servicios',
    description: 'Contrato de servicio de entrenamiento y adiestramiento de conducta canina.',
    content: `CONTRATO DE PRESTACIÓN DE SERVICIOS DE ADIESTRAMIENTO CANINO

Que celebran por una parte el C. [Nombre del Cliente], a quien en lo sucesivo se le denominara “EL CLIENTE”, y por la otra el Médico Veterinario / Adiestrador a quien se le denominara como “EL PROFESIONISTA”.

C L Á U S U L A S
PRIMERA.- EL PROFESIONISTA impartirá el programa de adiestramiento de obediencia acordado para el canino [Nombre de la Mascota].
SEGUNDA.- EL CLIENTE se compromete a dar continuidad a las prácticas y comandos en casa.`
  }
];
