// ─── Perfiles detallados de los 9 eneatipos ───
// Basado en metodología oficial Riso-Hudson (RHETI v2.5)
// summary: ~1000 caracteres para visitante
// fullReport: ~3000 caracteres para psicólogo

export interface TypeProfile {
  id: number
  title: string
  summary: string
  fullReport: string
}

export const ENEAGRAMA_PROFILES: TypeProfile[] = [
  // ═══════════════════════════════════════════
  // TIPO 1 — EL REFORMADOR
  // ═══════════════════════════════════════════
  {
    id: 1,
    title: 'El Reformador',
    summary: `El Tipo 1 es un idealista-práctico impulsado por un sentido profundo de lo correcto. Posee un crítico interior constante que lo mantiene en estándares elevados, lo que lo convierte en una persona de gran integridad moral y capacidad de mejora. Su mayor fortaleza es la honestidad consigo mismo y con los demás, lo que le permite liderar con ejemplo y generar confianza. Sin embargo, este mismo mecanismo puede volverse en su contra: la autocrítica excesiva, la rigidez y la dificultad para aceptar la imperfección propia y ajena son sus principales desafíos. En estrés, se fusiona con el Tipo 4 (Individualista), volviéndose melancólico y auto-absorbido. En crecimiento, se conecta con el Tipo 7 (Entusiasta), permitiéndose la espontaneidad y la alegría sin culpa. Sus alas modulan su expresión: la 1w9 (El Idealista) es más filosófica y serena, mientras la 1w2 (El Abogado) es más orientada hacia las personas y el servicio. En relación, busca la justicia y la coherencia, pero puede generar tensión con su perfeccionismo. Este tipo necesita aprender que la bondad no depende de la perfección.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 1: EL REFORMADOR

Centro: Instintivo (Gut)
Tríada: Instintivo — Emocional — Mental (Tercera centre, orientado al control y los límites)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 1 representa el arquetipo del reformador y el moralista. Su estructura psicológica se organiza alrededor de la noción de corrección: existe una forma correcta de hacer las cosas, y el Tipo 1 siente una responsabilidad personal de asegurarse de que eso suceda. Desde temprana edad, desarrolla un "superyó riguroso" — un crítico interior que evalúa constantemente sus acciones, pensamientos y emociones contra un estándar ideal. Este mecanismo no es intelectual: se experimenta como una presión física, una tensión en el cuerpo que solo se alivia cuando las cosas se hacen "bien". La ira — la emoción central de los tipos instintivos — se reprime en el Tipo 1 porque es vista como "mala" o destructiva. En su lugar, se transforma en resentimiento silencioso, autoexigencia y una rigidez que puede parecer inflexibilidad.

MIEDO CENTRAL: Ser defectuoso, corrupto o malo. Este miedo no es abstracto — se manifiesta como una ansiedad constante de que un error propio cause daño o sea juzgado negativamente. El Tipo 1 teme ser "descubierto" como imperfecto, lo que genera una tendencia al encubrimiento de sus emociones "inaceptables".

DESEO CENTRAL: Ser bueno, íntegro y equilibrado. El Tipo 1 busca la integridad — la alineación entre lo que piensa, siente y hace. Cuando logra esta coherencia, experimenta una paz profunda que trasciende la perfección externa.

PATRONES EN RELACIONES:
En vínculos, el Tipo 1 es leal, honesto y comprometido. Sin embargo, su tendencia a criticar — especialmente a quienes ama — puede generar distancia. Necesita aprender que amar a alguien no significa mejorarlos, sino aceptarlos. Su desafío relacional es distinguir entre estándares razonables y perfeccionismo destructivo.

DINÁMICA DE ESTRÉS (Flecha a Tipo 4):
Bajo presión extrema, el Tipo 1 adopta rasgos del Tipo 4: se vuelve introspectivo, melancólico, auto-absorbido y emocionalmente inestable. Puede sentir que sus esfuerzos nunca son suficientes y que nadie comprende su carga. Este patrón es reversible: reconocerlo permite al Tipo 1 pedir ayuda sin vergüenza.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 7):
En su camino de desarrollo, el Tipo 1 integra rasgos del Tipo 7: permite la espontaneidad, la alegría y la diversión sin culpa. Descubre que la bondad no requiere perfección y que puede disfrutar de la vida sin que eso signifique ser irresponsable.

ALAS:
• 1w9 (El Idealista): Combinación con el Tipo 9. Más serena, filosófica, orientada a principios abstractos. Menos confrontacional, más contemplativa. Tiende al perfeccionismo intelectual.
• 1w2 (El Abogado): Combinación con el Tipo 2. Más cálida, orientada a personas, con fuerte sentido de servicio. Puede volverse controladora desde el cuidado. Confunde "ayudar" con "corregir".

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Reconocer y nombrar la ira sin juicio
2. Practicar la autocompasión activa (no como indulgencia, sino como honestidad)
3. Distinguir entre estándares y expectativas rígidas
4. Permitir que otros hagan las cosas "a su manera" sin que eso implique un juicio moral
5. Cultivar la flexibilidad como fortaleza, no como debilidad

NOTE CLÍNICA: El Tipo 1 en terapia frecuentemente llega buscando "mejorarse", lo cual puede ser una forma de perpetuar el mismo patrón. El trabajo terapéutico más efectivo incluye explorar la ira subyacente, validar sus emociones como legítimas, y gradualmente construir una relación más compasiva consigo mismo.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 2 — EL AYUDADOR
  // ═══════════════════════════════════════════
  {
    id: 2,
    title: 'El Ayudador',
    summary: `El Tipo 2 es un generoso natural que encuentra su valor siendo útil y amado por otros. Posee una capacidad notable de percibir las necesidades emocionales de las personas, a menudo antes de que las expresen. Su fortaleza radica en la empatía profunda, la generosidad sincera y la capacidad de crear conexiones humanas significativas. Sin embargo, este patrón de cuidado extremo puede generar descuido de sus propias necesidades, una necesidad de aprobación que se vuelve dependencia, y un orgullo encubierto que resiste reconocer que "necesita ser necesitado". En estrés, se fusiona con el Tipo 8 (Desafiador), volviéndose dominante y confrontacional. En crecimiento, se conecta con el Tipo 4 (Individualista), descubriendo su propio mundo emocional. Sus alas: la 2w1 (El Servidor) es más principiosa y orientada al deber, la 2w3 (El Anfitrión) es más ambiciosa y consciente de imagen. En relaciones, es el tipo más generoso pero también el que más puede generar deuda emocional inconsciente.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 2: EL AYUDADOR

Centro: Emocional (Heart)
Tríada: Emocional — Instintivo — Mental (Segunda centre, orientado a la imagen y las relaciones)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 2 representa el arquetipo del cuidador y el servidor. Su identidad se construye alrededor de ser amado y necesario. A diferencia de otros tipos que buscan amor, el Tipo 2 cree que el amor se gana mediante la utilidad: si soy útil, seré amado; si soy amado, tendré valor. Esta lógica opera a nivel inconsciente y genera una hipersensibilidad a las necesidades ajenas — lo que otros necesitan, qué están sintiendo, qué esperan de mí. Esta capacidad empática es genuina y valiosa, pero se vuelve problemática cuando el Tipo 2 descuida sus propias necesidades para mantener el vínculo. La ira — que todos los tipos instintivos comparten — se reprime en el Tipo 2 porque conflictúa con su autoimagen de "buena persona". Cuando no recibe la gratitud esperada, acumula resentimiento que puede explotar súbitamente (flecha al Tipo 8).

MIEDO CENTRAL: No ser amado, no ser deseado. Este miedo se manifiesta como una hipervigilancia social — el Tipo 2 constantemente escanea el ambiente para asegurarse de ser apreciado. Rechazo, distanciamiento o indiferencia experimentan como amenazas existenciales.

DESEO CENTRAL: Sentirse amado y apreciado. No como generosidad abstracta, sino como validación personal: "si me aman, existo; si soy necesario, tengo valor".

PATRONES EN RELACIONES:
El Tipo 2 es el tipo más orientado a vínculos. Su fortaleza relacional es la generosidad y la presencia emocional. Su debilidad es la deuda emocional inconsciente: "hago tanto por ti, ¿por qué no haces lo mismo por mí?" Este patrón puede generar dependencia mutua y dificultad para establecer límites sanos.

DINÁMICA DE ESTRÉS (Flecha a Tipo 8):
Bajo presión extrema, el Tipo 2 adopta rasgos del Tipo 8: se vuelve dominante, confrontacional, demandante y controlador. La generosidad se transforma en manipulación: "te di todo, ahora me debes". Este patrón es una señal de agotamiento emocional y necesita ser atendido.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 4):
En su desarrollo, el Tipo 2 integra rasgos del Tipo 4: reconoce sus propias necesidades emocionales, permite la vulnerabilidad y descubre que puede amarse a sí mismo sin depender de la validación externa. Es un momento crucial de individuación.

ALAS:
• 2w1 (El Servidor): Combinación con el Tipo 1. Más principiosa, orientada al deber y la corrección. Confunde servicio con sacrificio. Puede ser más crítica consigo misma.
• 2w3 (El Anfitrión): Combinación con el Tipo 3. Más ambiciosa, consciente de imagen, carismática. Busca ser "la mejor versión del servidor". Puede volverse performática.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Reconocer que cuidar de uno mismo no es egoísmo
2. Aprender a recibir sin inmediatamente reciprocar
3. Identificar y comunicar necesidades propias sin culpa
4. Distinguir entre empatía genuina y fusión emocional
5. Desarrollar tolerancia al rechazo sin experimentarlo como amenaza existencial

NOTE CLÍNICA: El Tipo 2 en terapia frecuentemente llega "por otro" (pareja, hijo, amigo), no por sí mismo. El trabajo terapéutico incluye validar su generosidad como fortaleza mientras se exploran las necesidades no reconocidas y el patrón de deuda emocional.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 3 — EL TRIUNFADOR
  // ═══════════════════════════════════════════
  {
    id: 3,
    title: 'El Triunfador',
    summary: `El Tipo 3 es el ejecutivo del eneagrama: ambicioso, eficiente y orientado al logro. Se identifica profundamente con sus metas y puede volverse un maestro en adaptar su imagen al contexto para alcanzar el éxito. Sus fortalezas incluyen determinación, capacidad de inspirar, adaptabilidad y una búsqueda constante de excelencia. Su desafío principal es la identificación con la imagen: confunde quién es con lo que logra, lo que genera desconexión emocional y un temor profundo al fracaso que puede paralizarlo. En estrés, se fusiona con el Tipo 9 (Pacificador), volviéndose pasivo y desconectado. En crecimiento, se conecta con el Tipo 6 (Leal), desarrollando lealtad genuina más allá del rendimiento. Sus alas: la 3w2 (La Estrella) es más carismática y orientada a personas, la 3w4 (El Profesional) es más creativa e introspectiva. En relaciones, puede ser encantador pero struggle con la vulnerabilidad auténtica.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 3: EL TRIUNFADOR

Centro: Emocional (Heart)
Tríada: Emocional — Instintivo — Mental (Segunda centre, orientado a la imagen y la validación)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 3 representa el arquetipo del logrador y el performer. Su psicología se organiza alrededor de la eficiencia y la imagen: ¿cómo puedo hacer esto mejor, más rápido, más visiblemente? A diferencia de otros tipos emocionales que buscan ser amados, el Tipo 3 busca ser admirado y reconocido. Su mecanismo de defensa principal es la narcisización — la identificación con una versión idealizada de sí mismo que es exitosa, competente y admirable. Esta imagen no es necesariamente falsa, pero se vuelve Problemática cuando el Tipo 3 pierde contacto con quién es realmente detrás del rendimiento. La emoción subyacente — la vergüenza — se reprime sistemáticamente porque conflicúa con la imagen de éxito. Cuando la máscara se agrieta, el Tipo 3 puede experimentar una crisis de identidad devastadora.

MIEDO CENTRAL: No tener valor, ser insignificante. Este miedo no es abstracto — se traduce como "si no estoy logrando algo, ¿quién soy?" El Tipo 3 necesita logros como validación existencial.

DESEO CENTRAL: Sentirse valioso y digno. No por lo que hace, sino por quién es. Este deseo es el que más le cuesta reconocer porque implica vulnerabilidad.

PATRONES EN RELACIONES:
El Tipo 3 puede ser el compañero más inspirador y el más desconectado emocionalmente. Su tendencia a "venderse" — incluso en relaciones íntimas — genera una distancia que sus parejas perciben pero que él minimiza. El trabajo relacional implica aprender a mostrar las partes de sí mismo que no encajan con la imagen de éxito.

DINÁMICA DE ESTRÉS (Flecha a Tipo 9):
Bajo presión extrema, el Tipo 3 adopta rasgos del Tipo 9: se vuelve pasivo, desconectado, automático. Deja de esforzarse y se "apaga". Este patrón es una señal de agotamiento profundo y necesita ser abordado como crisis, no como pereza.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 6):
En desarrollo, el Tipo 3 integra rasgos del Tipo 6: desarrolla lealtad genuina, se compromete con algo más grande que su propio éxito, y aprende que la vulnerabilidad no debilita sino que fortalece los vínculos.

ALAS:
• 3w2 (La Estrella): Más carismática, orientada a personas, manipuladora en su versión menos desarrollada. Confunde popularidad con amor.
• 3w4 (El Profesional): Más creativa, introspectiva, perfeccionista. Puede volverse melancólica cuando la realidad no alcanza el ideal.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Desarrollar conciencia de cuándo está "performando" vs. siendo auténtico
2. Practicar la vulnerabilidad selectiva (no toda la vida es pública)
3. Reconocer y procesar la vergüenza subyacente
4. Definir valor personal independiente de logros externos
5. Cultivar relaciones donde no necesita "vender" nada

NOTE CLÍNICA: El Tipo 3 en terapia frecuentemente llega buscando "optimizar" su vida emocional como si fuera otro proyecto. El trabajo terapéutico requiere lentitud: crear un espacio seguro donde la máscara pueda descansar sin que eso signifique fracaso.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 4 — EL INDIVIDUALISTA
  // ═══════════════════════════════════════════
  {
    id: 4,
    title: 'El Individualista',
    summary: `El Tipo 4 es el artista y el poeta del eneagrama: expresivo, sensible y profundamente conectado con su mundo emocional interior. Buscan comprenderse a sí mismos y ser comprendidos por otros. Su fortaleza es la creatividad profunda, la honestidad emocional y la capacidad de transformar dolor en arte. Su desafío principal es la melancolía crónica y la sensación de que algo esencial falta — una nostalgia que no se satisface con nada concreto. En estrés, se fusiona con el Tipo 2 (Ayudador), volviéndose dependiente y manipulativa. En crecimiento, se conecta con el Tipo 1 (Reformador), desarrollando estructura y autodisciplina sin perder su autenticidad. Sus alas: la 4w3 (El Aristócrata) es más orientada a logros y adaptable socialmente, la 4w5 (El Bohemio) es más introspectiva y analítica. En relaciones, busca una conexión profunda y auténtica, pero puede sabotear vínculos por miedo a ser "común".`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 4: EL INDIVIDUALISTA

Centro: Emocional (Heart)
Tríada: Emocional — Instintivo — Mental (Segunda centre, orientado a la identidad y la autenticidad)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 4 representa el arquetipo del artista y el introspectivo. Su psicología se organiza alrededor de la búsqueda de identidad: ¿quién soy realmente? ¿Qué me hace único? A diferencia de otros tipos emocionales que buscan ser amados (Tipo 2) o admirados (Tipo 3), el Tipo 4 busca ser comprendido — que alguien vea más allá de la superficie y reconozca su mundo interior como valioso. Su mecanismo de defensa es la regresión: ante la amenaza de ser "común" o insignificante, se retira hacia adentro para explorar sus emociones más profundas. La emoción central es la envidia — no envidiar cosas materiales, sino una sensación de que otros tienen algo que a ellos les falta: completitud, normalidad, pertenencia. Esta envidia no es destructiva sino existencial, y puede ser transformada en creatividad genuina.

MIEDO CENTRAL: No tener identidad personal, no ser único, no tener significado. El Tipo 4 teme ser intercambiable, ser "como todos los demás".

DESEO CENTRAL: Encontrar su identidad e importancia. No a través de logros externos, sino a través de la autenticidad radical de ser quien realmente es.

PATRONES EN RELACIONES:
El Tipo 4 busca la "mitad perdida" — una conexión que validide su mundo interior. Esto puede generar idealización inicial seguida de decepción cuando el otro no puede sostener la intensidad emocional. Su desafío relacional es aceptar que la autenticidad no requiere dramatismo.

DINÁMICA DE ESTRÉS (Flecha a Tipo 2):
Bajo presión extrema, el Tipo 4 adopta rasgos del Tipo 2: se vuelve dependiente, manipuladora, posesiva y busca validación externa desesperadamente. Pierde su independencia emocional y puede volverse controladora.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 1):
En desarrollo, el Tipo 4 integra rasgos del Tipo 1: desarrolla autodisciplina, estructura y una ética de trabajo que canaliza su creatividad. Aprende que la autenticidad no requiere sufrimiento constante.

ALAS:
• 4w3 (El Aristócrata): Más orientada a logros, adaptable socialmente, competitiva. Puede confundir éxito externo con valor personal.
• 4w5 (El Bohemio): Más introspectiva, analítica, privada. Tiende al aislamiento intelectual. Confunde profundidad con distancia.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Desarrollar tolerancia a la normalidad sin experimentarla como amenaza
2. Aprender que las emociones intensas no son necesariamente más "reales"
3. Practicar la acción concreta (no solo la reflexión)
4. Construir rutinas que sostengan la creatividad sin sofocarla
5. Reconocer que la vulnerabilidad no requiere表演

NOTE CLÍNICA: El Tipo 4 en terapia busca frecuentemente "entenderse mejor", pero puede usar la terapia como extensión de su auto-exploración sin llegar a la acción. El trabajo terapéutico equilibra validación emocional con movilización concreta.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 5 — EL INVESTIGADOR
  // ═══════════════════════════════════════════
  {
    id: 5,
    title: 'El Investigador',
    summary: `El Tipo 5 es el pensador y el observador del eneagrama: perceptivo, analítico e intensamente privado. Motivados por el deseo de comprender el mundo profundamente y conservar sus recursos internos — energía, tiempo, espacio, información. Observan más de lo que participan, lo que les permite una visión objetiva pero puede generar aislamiento. Su fortaleza es el pensamiento visionario, la mente abierta y la profundidad analítica. Su desafío es la retención — retienen emociones, información, energía y presencia, creyendo que si "dan" demasiado, se agotarán. En estrés, se fusiona con el Tipo 7 (Entusiasta), volviéndose disperso y superficial. En crecimiento, se conecta con el Tipo 8 (Desafiador), permitiéndose la acción directa y el poder personal. Sus alas: la 5w4 (El Iconoclasta) es más creativa e individualista, la 5w6 (El Solucionador) es más orientada a la seguridad y la lealtad.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 5: EL INVESTIGADOR

Centro: Mental (Head)
Tríada: Mental — Instintivo — Emocional (Tercer centre, orientado a la comprensión y la seguridad)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 5 representa el arquetipo del sabio y el eremita. Su psicología se organiza alrededor de la conservación de recursos: energía, tiempo, conocimiento, espacio personal. El Tipo 5 opera desde la premisa de que el mundo es demandante y los recursos son limitados, por lo que necesita acumular — especialmente conocimiento — para sentirse preparado. A diferencia de otros tipos mentales (6 y 7) que buscan seguridad o estimulación, el Tipo 5 busca comprensión: no solo quiere saber, quiere entender cómo funcionan las cosas a nivel fundamental. Su mecanismo de defensa es la aislación — no social (necesariamente), sino emocional: se desconecta de sus sentimientos para mantener la objetividad. La emoción subyacente es la codicia — no de cosas materiales, sino de tiempo, espacio y conocimiento. Cuando se siente agotado o invadido, puede volverse excavado y distante.

MIEDO CENTRAL: Ser inútil, incompetente o incapaz. El Tipo 5 teme que si no tiene suficientes recursos (conocimiento, habilidades), será vulnerble e indefenso ante un mundo que percibe como demandante.

DESEO CENTRAL: Ser capaz y competente. No destacar, sino tener la capacidad de manejar lo que la vida presente sin ser abrumado.

PATRONES EN RELACIONES:
El Tipo 5 es el compañero más independiente pero también el más distante. Su tendencia a retener presencia emocional puede hacer que sus parejas se sientan solas incluso estando juntos. Su desafío relacional es dar sin calcular si "le alcanzará".

DINÁMICA DE ESTRÉS (Flecha a Tipo 7):
Bajo presión extrema, el Tipo 5 adopta rasgos del Tipo 7: se vuelve disperso, impulsivo, superficial y buscan distracciones para evitar el agotamiento. Puede volverse contradictorio — buscando estimulación pero sin comprometerse con nada.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 8):
En desarrollo, el Tipo 5 integra rasgos del Tipo 8: permite la acción directa, asume liderazgo cuando es necesario, y reconoce que puede influir en el mundo sin agotarse.

ALAS:
• 5w4 (El Iconoclasta): Más creativa, individualista, temperamental. Confunde profundidad con aislamiento. Tiende a la melancolía intelectual.
• 5w6 (El Solucionador): Más leal, orientada a la seguridad, con mayor tendencia a la ansiedad. Busca sistemas confiables. Más sociable pero más temerosa.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Practicar la presencia emocional (estar sin hacer)
2. Reconocer que dar no agota cuando es genuino
3. Desarrollar tolerancia a la imperfección y la ambigüedad
4. Conectar conocimiento con acción concreta
5. Permitir que otros entren en su espacio interior

NOTE CLÍNICA: El Tipo 5 en terapia busca frecuentemente "entender" su propia psicología como otro sistema de conocimiento. El trabajo terapéutico requiere tender un puente entre la comprensión intelectual y la experiencia emocional directa.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 6 — EL LEAL
  // ═══════════════════════════════════════════
  {
    id: 6,
    title: 'El Leal',
    summary: `El Tipo 6 es el guardián y el defensor del eneagrama: responsable, comprometido y profundamente orientado a la seguridad. Atento al riesgo y a la confiabilidad de personas e instituciones, su lealtad es inquebrantable cuando confía. Pero el Tipo 6 vive en un estado constante de evaluación: "¿Es seguro esto? ¿Es confiable esta persona?" Su fortaleza es la lealtad inquebrantable, la responsabilidad y un coraje real que emerge cuando protege a quienes ama. Su desafío es la ansiedad y la desconfianza crónica — una mente que constantemente anticipa problemas que quizás nunca ocurrirán. En estrés, se fusiona con el Tipo 3 (Triunfador), volviéndose image-obsessed y overachieving. En crecimiento, se conecta con el Tipo 9 (Pacificador), desarrollando paz interior y confianza. Sus alas: la 6w5 (El Guerrero) es más analítica y privada, la 6w7 (El Compañero) es más sociable y optimista.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 6: EL LEAL

Centro: Mental (Head)
Tríada: Mental — Instintivo — Emocional (Tercer centre, orientado a la seguridad y la anticipación)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 6 representa el arquetipo del guardián y el ciudadano responsable. Su psicología se organiza alrededor de la seguridad: ¿qué puede salir mal? ¿Puedo confiar en esto? ¿Estoy preparado? A diferencia de otros tipos mentales que buscan comprensión (Tipo 5) o estimulación (Tipo 7), el Tipo 6 busca certeza — y paradójicamente, su mente nunca se siente completamente segura. Esto genera una hipervigilancia constante que puede manifestarse como ansiedad, paranoia o, en su versión más desarrollada, un coraje real que emerge cuando necesita proteger a otros. El Tipo 6 tiene una relación ambivalente con la autoridad: puede ser el seguidor más leal o el rebelde más destructivo, dependiendo de si la autoridad es percibida como confiable. La emoción subyacente es el miedo — no al daño físico (necesariamente), sino a la incertidumbre y a quedarse sin apoyo.

MIEDO CENTRAL: No tener guía, apoyo o capacidad de sobrevivir. El Tipo 6 teme quedar solo ante la adversidad sin recursos ni aliados.

DESEO CENTRAL: Tener seguridad y apoyo. No control absoluto (eso sería Tipo 8), sino la certeza de que habrá alguien o algo que lo sostenga cuando las cosas se dificulten.

PATRONES EN RELACIONES:
El Tipo 6 es leal hasta la médula, pero su desconfianza crónica puede generar pruebas constantes de la relación. Su pareja necesita paciencia para demostrar consistentemente que es confiable. El Tipo 6 aprende a confiar a través de la experiencia repetida, no de las promesas.

DINÁMICA DE ESTRÉS (Flecha a Tipo 3):
Bajo presión extrema, el Tipo 6 adopta rasgos del Tipo 3: se vuelve image-obsessed, overachieving, y busca validación a través del éxito externo. La ansiedad se transforma en acción frenética sin dirección clara.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 9):
En desarrollo, el Tipo 6 integra rasgos del Tipo 9: desarrolla paz interior, confianza en el proceso de la vida, y la capacidad de "estar" sin necesidad de anticipar constantemente.

ALAS:
• 6w5 (El Guerrero): Más analítica, privada, orientada al conocimiento. Tiende a la paranoia intelectual. Busca sistemas de seguridad.
• 6w7 (El Compañero): Más sociable, optimista, buscando distracciones de la ansiedad. Puede ser más impulsiva pero también más cálida.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Desarrollar tolerancia a la incertidumbre sin resolverla
2. Aprender a distinguir entre intuición y paranoia
3. Construir confianza interna que no dependa de validación externa
4. Practicar la acción sin necesidad de certeza previa
5. Reconocer que la lealtad no requiere pruebas constantes

NOTE CLÍNICA: El Tipo 6 en terapia frecuentemente busca "una respuesta segura" — la terapia ideal para ellos es aquella que valida su necesidad de estructura mientras gradualmente construye tolerancia a la ambigüedad.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 7 — EL ENTUSIASTA
  // ═══════════════════════════════════════════
  {
    id: 7,
    title: 'El Entusiasta',
    summary: `El Tipo 7 es el visionario y el buscador de experiencias del eneagrama: entusiasta, espontáneo y orientado al futuro. Impulsados por el deseo de nuevas experiencias, ideas y posibilidades, aportan energía y optimismo a todo lo que hacen. Su fortaleza es el optimismo contagioso, la versatilidad y una creatividad que conecta ideas disparate. Su desafío es la dispersión y la evitación del dolor — una tendencia a mantenerse ocupado y estimulado para no enfrentar emociones difíciles. En estrés, se fusiona con el Tipo 1 (Reformador), volviéndose rígido y autocrítico. En crecimiento, se conecta con el Tipo 5 (Investigador), desarrollando profundidad y concentración. Sus alas: la 7w6 (El Animador) es más leal y orientada a seguridad, la 7w8 (El Realista) es más asertiva y directa. En relaciones, es el compañero más divertido pero puede luchar con la profundidad emocional.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 7: EL ENTUSIASTA

Centro: Mental (Head)
Tríada: Mental — Instintivo — Emocional (Tercer centre, orientado a la posibilidad y la anticipación positiva)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 7 representa el arquetipo del visionario y el epicúreo. Su psicología se organiza alrededor de la posibilidad: siempre hay algo mejor, algo nuevo, algo que explorar. A diferencia de otros tipos mentales que buscan seguridad (Tipo 6) o comprensión (Tipo 5), el Tipo 7 busca estimulación — no para entender el mundo, sino para disfrutarlo. Su mecanismo de defensa es la sublimación: transforma experiencias negativas en positivas, reinterpreta el dolor como aprendizaje, y anticipa el futuro con optimismo para evitar el presente. La emoción subyacente es la envidia — no de cosas materiales, sino de experiencias no vividas: siempre hay algo que se está perdiendo. Cuando se enfrenta a limitaciones reales (dolor, pérdida, aburrimiento), puede volverse disperso, impulsivo y superficial.

MIEDO CENTRAL: Estar en dolor, privación o ser encerrado. El Tipo 7 teme quedarse atrapado en emociones difíciles sin salida.

DESEO CENTRAL: Ser feliz y satisfecho. No temporalmente, sino como estado permanente — una satisfacción que no dependa de circunstancias externas.

PATRONES EN RELACIONES:
El Tipo 7 es el compañero más entusiasta pero también el más evasivo. Su tendencia a "saltear" las partes difíciles de una relación puede hacer que sus parejas se sientan no tomadas en serio. Su desafío relacional es estar presente incluso cuando no es divertido.

DINÁMICA DE ESTRÉS (Flecha a Tipo 1):
Bajo presión extrema, el Tipo 7 adopta rasgos del Tipo 1: se vuelve rígido, autocrítico, perfeccionista y controlador. La dispersión se transforma en rigidez — un intento desesperado de controlar lo que no puede evitar.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 5):
En desarrollo, el Tipo 7 integra rasgos del Tipo 5: desarrolla concentración, profundidad y la capacidad de estar presente con una experiencia sin necesidad de cambiarla.

ALAS:
• 7w6 (El Animador): Más leal, orientada a seguridad, con mayor tendencia a la ansiedad. Busca estimulación pero también pertenencia. Más sociable.
• 7w8 (El Realista): Más asertiva, directa, orientada al poder. Confunde libertad con dominación. Menos ansiosa pero más confrontacional.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Desarrollar tolerancia al aburrimiento sin interpretarlo como amenaza
2. Aprender a estar presente con emociones difíciles sin escapar
3. Practicar la profundidad (una cosa a la vez, completamente)
4. Reconocer que el optimismo puede ser una forma de evitación
5. Cultivar la satisfacción con "lo que es" sin necesidad de "lo que viene"

NOTE CLÍNICA: El Tipo 7 en terapia frecuentemente llega con entusiasmo pero puede perder interés cuando la terapia se vuelve "repetitiva" o "difícil". El trabajo terapéutico más efectivo incluye crear un espacio donde la profundidad sea estimulante, no restrictiva.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 8 — EL DESAFIADOR
  // ═══════════════════════════════════════════
  {
    id: 8,
    title: 'El Desafiador',
    summary: `El Tipo 8 es el líder natural y el protector del eneagrama: poderoso, seguro de sí mismo y directo. Motivados por la necesidad de controlar sus propias vidas y resistir cualquier forma de debilidad o dominación. Se enfrentan al mundo con intensidad y determinación. Su fortaleza es el liderazgo natural, la determinación inquebrantable y una honestidad brutal que puede ser refrescante. Su desafío es la intimidación y la dificultad para mostrar vulnerabilidad — un temor profundo a ser controlado que puede hacer que controle primero. En estrés, se fusiona con el Tipo 5 (Investigador), volviéndose aislado y paranoid. En crecimiento, se conecta con el Tipo 2 (Ayudador), descubriendo que la vulnerabilidad no debilita sino que fortalece. Sus alas: la 8w7 (El Independiente) es más sociable y espontánea, la 8w9 (El Oso) es más tranquila y pacífica.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 8: EL DESAFIADOR

Centro: Instintivo (Gut)
Tríada: Instintivo — Emocional — Mental (Primera centre, orientado al poder y la supervivencia)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 8 representa el arquetipo del guerrero y el protector. Su psicología se organiza alrededor del poder: tenerlo, mantenerlo, y nunca permitir que alguien lo quite. A diferencia de otros tipos instintivos que buscan corrección (Tipo 1) o armonía (Tipo 9), el Tipo 8 busca control — no por capricho, sino porque aprendió tempranamente que el mundo es un lugar donde los débiles son vulneridos. Su mecanismo de defensa es la negación: rechaza la vulnerabilidad, el dolor y la debilidad como amenazas existenciales. La emoción central es la ira — no como explosión, sino como combustible. El Tipo 8 siente ira porque percibe injusticia, deshonestidad o intentos de control. Cuando esta ira se canaliza constructivamente, se convierte en pasión por la justicia y protección de los indefensos.

MIEDO CENTRAL: Ser controlado, herido o violado por otros. Este miedo es profundo y primitivo — se relaciona con la supervivencia básica y la dignidad personal.

DESEO CENTRAL: Protegerse a sí mismo y a otros. No por altruismo abstracto, sino por una necesidad visceral de que los débiles sean protegidos y que la justicia prevalezca.

PATRONES EN RELACIONES:
El Tipo 8 es protector y leal, pero su intensidad puede abrumar. Su desafío relacional es permitir que otros lo cuiden — no solo proteger, sino ser protegido. La vulnerabilidad no es debilidad; es la puerta a la conexión genuina.

DINÁMICA DE ESTRÉS (Flecha a Tipo 5):
Bajo presión extrema, el Tipo 8 adopta rasgos del Tipo 5: se vuelve aislado, paranoid, calculador y emocionalmente distante. Retiene energía y presencia como estrategia de supervivencia.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 2):
En desarrollo, el Tipo 8 integra rasgos del Tipo 2: permite la vulnerabilidad, cuida de otros sin controlar, y descubre que la generosidad genuina no requiere debilidad.

ALAS:
• 8w7 (El Independiente): Más sociable, espontánea, orientada a la acción. Puede ser más impulsiva y menos reflexiva. Confunde libertad con autonomía absoluta.
• 8w9 (El Oso): Más tranquila, pacífica, con mayor tolerancia al conflicto. Puede ser más stubborn y menos expresiva. Tiende al poder silencioso.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Reconocer que la vulnerabilidad es fortaleza, no debilidad
2. Desarrollar tolerancia a ser cuidado sin experimentarlo como dependencia
3. Practicar la escucha activa sin necesidad de responder o controlar
4. Reconocer que la ira puede ser un messenger, no siempre un driver
5. Construir relaciones donde la intensidad no sea la única moneda

NOTE CLÍNICA: El Tipo 8 en terapia frecuentemente llega con una actitud de "prueba" — testeando si el terapeuta es lo suficientemente fuerte para acompañarlo. El trabajo terapéutico requiere firmeza genuina (no intimidación) y la capacidad de sostener la intensidad sin someterse ni huir.`,
  },

  // ═══════════════════════════════════════════
  // TIPO 9 — EL PACIFICADOR
  // ═══════════════════════════════════════════
  {
    id: 9,
    title: 'El Pacificador',
    summary: `El Tipo 9 es el mediador y el integrador del eneagrama: receptivo, tranquilo y pacificador. Motivados por el deseo profundo de armonía, tienen una notable capacidad de ver todos los lados de una situación. Su fortaleza es la estabilidad emocional, la empatía y una capacidad natural de mediación que puede unir grupos. Su desafío es la complacencia y la evitación del conflicto — una tendencia a perderse a sí mismo para mantener la paz exterior. En estrés, se fusiona con el Tipo 6 (Leal), volviéndose ansioso y paranoide. En crecimiento, se conecta con el Tipo 3 (Triunfador), desarrollando ambición y auto-afirmación. Sus alas: la 9w8 (El Árbitro) es más asertiva y directa, la 9w1 (El Soñador) es más creativa e idealista. En relaciones, son los compañeros más estables pero pueden volverse pasivos-agresivos cuando sus necesidades son ignoradas.`,
    fullReport: `ANÁLISIS DETALLADO — TIPO 9: EL PACIFICADOR

Centro: Instintivo (Gut)
Tríada: Instintivo — Emocional — Mental (Primera centre, orientado a la armonía y la disolución de límites)
Frecuencia en población general: ~11%

DESCRIPCIÓN GENERAL:
El Tipo 9 representa el arquetipo del mediador y el sabio tranquilo. Su psicología se organiza alrededor de la armonía: mantener un estado interior y exterior de paz eliminando o minimizando el conflicto. A diferencia de otros tipos instintivos que buscan corrección (Tipo 1) o control (Tipo 8), el Tipo 9 busca fusión — una conexión con todos los puntos de vista que elimina la necesidad de imponer el propio. Su mecanismo de defensa es la narcotización: se desconecta de sí mismo para no sentir la frustración de no ser escuchado. La emoción central es la pereza — no física (muchos Tipos 9 son muy activos), sino una pereza de sí mismo: la tendencia a no auto-afirmarse, a no importar, a no tomar partido. Esta aparente pasividad esconde una resistencia profunda: el Tipo 9 puede decir "sí" mientras internamente dice "no", generando un resentimiento acumulado.

MIEDO CENTRAL: Pérdida y separación, desintegración — tanto de relaciones como de sí mismo. El Tipo 9 teme que auto-afirmarse cause conflicto que lleve a la pérdida del vínculo.

DESEO CENTRAL: Paz interior y totalidad. No la ausencia de conflicto, sino la integración de todas las partes de la experiencia sin necesidad de elegir.

PATRONES EN RELACIONES:
El Tipo 9 es el compañero más estable pero también el más容易 de olvidar. Su tendencia a adaptarse a la pareja puede hacer que pierda su propia identidad. Su desafío relacional es existir plenamente — ocupar espacio, tener opiniones, y permitir que el conflicto sea parte de la conexión.

DINÁMICA DE ESTRÉS (Flecha a Tipo 6):
Bajo presión extrema, el Tipo 9 adopta rasgos del Tipo 6: se vuelve ansioso, paranoide, dudoso y busca seguridad externa. La pasividad se transforma en preocupación constante.

DINÁMICA DE CRECIMIENTO (Flecha a Tipo 3):
En desarrollo, el Tipo 9 integra rasgos del Tipo 3: desarrolla ambición, se auto-afirma, y reconoce que su voz importa. Es el momento más crucial de individuación.

ALAS:
• 9w8 (El Árbitro): Más asertiva, directa, con mayor tolerancia al conflicto. Puede ser más stubborn y menos expresiva. Tiende al poder silencioso.
• 9w1 (El Soñador): Más creativa, idealista, orientada a principios. Puede ser más passive-aggressive. Confunde armonía con perfección.

ÁREAS DE DESARROLLO RECOMENDADAS:
1. Desarrollar auto-afirmación sin experimentarla como agresión
2. Aprender a existir plenamente — ocupar espacio físico y emocional
3. Reconocer que el conflicto no es necesariamente destructivo
4. Desarrollar preferencias y opiniones propias
5. Practicar la acción sin necesidad de consenso previo

NOTE CLÍNICA: El Tipo 9 en terapia frecuentemente llega buscando "estar bien" sin identificar problemas específicos. El trabajo terapéutico más efectivo incluye ayudarlos a identificar y nombrar sus necesidades — un acto que para ellos puede ser revolucionario.`,
  },
]

// Helper: obtener perfil por tipo
export function getProfileByType(typeId: number): TypeProfile | undefined {
  return ENEAGRAMA_PROFILES.find(p => p.id === typeId)
}

// Helper: contar caracteres de un perfil
export function countChars(profile: TypeProfile): { summary: number; fullReport: number } {
  return {
    summary: profile.summary.length,
    fullReport: profile.fullReport.length,
  }
}
