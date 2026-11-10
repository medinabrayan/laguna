// data.js - Base de datos biocultural, gastronómica, comunitaria y cartográfica de Guapuchas: Latidos de Fúquene

const NODES_DATA = {
  "inicio": {
    id: "inicio",
    title: "Inicio: Un viaje por Fúquene",
    category: "Principal",
    subtitle: "El despertar de la laguna y el sabor de sus aguas",
    badge: "Punto de Partida",
    image: "fúquene",
    color: "#27578c",
    text: `Bienvenido a <strong>Guapuchas: Latidos de Fúquene</strong>, una expedición interactiva y sensorial a través de la memoria biocultural de la <strong>Laguna de Fúquene</strong>, ubicada en el corazón del altiplano cundiboyacense en Colombia.<br><br>
    Este recorrido rescata la historia de la <strong>Guapucha (<em>Grundulus bogotensis</em>)</strong>, un pez emblemático y endémico que ha alimentado a comunidades indígenas muiscas, pescadores artesanales y familias campesinas durante siglos. Explora cada estación para descubrir su biología, los saberes culinarios ancestrales, los testimonios de los habitantes y los cantos del agua.`,
    stats: [
      { label: "Ecosistema", value: "Laguna Altoandina (2.540 msnm)" },
      { label: "Especie Clave", value: "Grundulus bogotensis" },
      { label: "Territorio", value: "Cundinamarca & Boyacá" }
    ],
    quote: "«En las mañanas de niebla, cuando la laguna parece un espejo de plata, la guapucha salta avisando que la vida sigue viva bajo el agua.» — Pescador de Fúquene"
  },

  "que-es-guapucha": {
    id: "que-es-guapucha",
    title: "¿Qué es una guapucha?",
    category: "Biología y Especie",
    subtitle: "El pez nativo de las aguas frías andinas",
    badge: "Especie Endémica",
    color: "#27578c",
    text: `La <strong>Guapucha</strong> (<em>Grundulus bogotensis</em>) es un pez dulceacuícola perteneciente a la familia Characidae. Es una de las pocas especies de peces nativas del altiplano de Bogotá y los valles de Ubaté y Chiquinquirá.<br><br>
    A diferencia de especies introducidas como la trucha arcoíris o la carpa, la guapucha coevolucionó en estos humedales y lagunas andinas. Mide comúnmente entre <strong>5 y 8 centímetros</strong> de longitud, posee un cuerpo esbelto y comprimido, coloración olivácea con reflejos plateados y dorados que le permiten mimetizarse entre los tallos de totora y junco.`,
    stats: [
      { label: "Nombre Científico", value: "Grundulus bogotensis" },
      { label: "Familia", value: "Characidae" },
      { label: "Tamaño Promedio", value: "5 a 8 cm" },
      { label: "Estado", value: "Vulnerable / Endémica" }
    ],
    quote: "«Es un pececito humilde de tamaño, pero inmenso en historia y en sabor.»"
  },

  "no-esta-en-un-libro": {
    id: "no-esta-en-un-libro",
    title: "No está en un libro",
    category: "Memoria Oral",
    subtitle: "Saberes vivos transmitidos a orillas de la laguna",
    badge: "Tradición Oral",
    color: "#27578c",
    text: `El conocimiento sobre la guapucha no se aprende en las enciclopedias formales, sino en la <strong>memoria viva de las abuelas, los pescadores y las cocineras de la ribera</strong>.<br><br>
    Está en el tacto con el que se teje una atarraya, en saber reconocer las fases de la luna para pescar, en el sonido de la leña de aliso en el fogón, y en la receta que pasa de mano en mano sin medidas de balanza: <em>«un puñado de sal marina, un diente de ajo machacado y el punto exacto de la manteca caliente»</em>. Este archivo oral es la verdadera custodia del territorio.`,
    stats: [
      { label: "Transmisión", value: "De generación en generación" },
      { label: "Portadores", value: "Sabedoras y Pescadores" },
      { label: "Patrimonio", value: "Inmaterial Campesino" }
    ],
    quote: "«Lo que la abuela aprendió a la orilla del agua, no cabe en ninguna biblioteca.»"
  },

  "donde-estamos": {
    id: "donde-estamos",
    title: "¿Dónde estamos?",
    category: "Geografía Sagrada",
    subtitle: "La Laguna de Fúquene: espejo del altiplano",
    badge: "Geografía",
    color: "#27578c",
    text: `Nos encontramos en la <strong>Laguna de Fúquene</strong>, un cuerpo de agua natural situado a <strong>2.540 metros sobre el nivel del mar</strong>, en los límites de los departamentos de Cundinamarca y Boyacá (municipios de Fúquene, Guachetá, Ubaté y Simijaca).<br><br>
    En la cosmovisión Muisca, su nombre significa <em>«lecho de la zorra»</em> o <em>«santuario del dios Fu»</em>, un lugar sagrado de reverencia y conexión con el agua cósmica. La cuenca alimenta el río Suárez y fue en tiempos prehispánicos uno de los lagos más grandes de la cordillera Oriental colombiana.`,
    stats: [
      { label: "Altitud", value: "2.540 m.s.n.m." },
      { label: "Temperatura Promedio", value: "13°C" },
      { label: "Cuenca", value: "Río Suárez / Magdalena" }
    ],
    quote: "«Fúquene fue el corazón hídrico de nuestros antepasados; hoy clama por seguir latiendo.»"
  },

  "escucha-el-territorio": {
    id: "escucha-el-territorio",
    title: "Escucha el territorio",
    category: "Paisaje Sonoro",
    subtitle: "Voces, olas y cantos de aves andinas",
    badge: "Paisaje Sonoro",
    color: "#27578c",
    text: `El territorio de Fúquene no solo se ve: <strong>se escucha con devoción</strong>. Al cerrar los ojos a la orilla del agua se revelan las texturas sonoras de la alta montaña: el chapoteo rítmico de los remos de madera de aliso, el crujido de los juncales cuando sopla el viento helado del páramo, y el canto de aves emblemáticas como la tingua bogotana y el cucarachero de pantano.<br><br>
    Escuchar el territorio es reconocer la voz viva de quienes habitan el ecosistema y comprender que cada gota de agua guarda un relato compartido de resistencia campesina y comunitaria.`,
    stats: [
      { label: "Aves Registradas", value: "+125 especies" },
      { label: "Ambiente Sonoro", value: "Viento andino y oleaje dulce" },
      { label: "Patrimonio", value: "Acústico de humedales" }
    ],
    quote: "«Quien aprende a oír el silencio de la laguna, comprende lo que el agua necesita pedirnos.»"
  },

  "de-la-pesca-a-la-mesa": {
    id: "de-la-pesca-a-la-mesa",
    title: "De la pesca a la mesa",
    category: "Comercialización",
    subtitle: "Caminos de distribución y economía campesina",
    badge: "Economía Local",
    color: "#3b7ebf",
    text: `Antaño, las vendedoras caminaban con canastos de mimbre cubiertos con hojas frescas de helecho hacia las plazas de mercado de Chiquinquirá, Ubaté y Simijaca. El trueque era común: un plato de guapuchas a cambio de una arroba de papa o panela de la hoya del río Suárez.<br><br>
    Hoy en día, la venta se realiza de manera directa a orillas de la carretera o en cooperativas familiares de pescadores, garantizando precios justos y manteniendo viva una cadena de sustento que respalda la economía rural sin intermediarios abusivos.`,
    stats: [
      { label: "Ruta Histórica", value: "Fúquene - Ubaté - Chiquinquirá" },
      { label: "Modalidad Antigua", value: "Trueque de pesca por granos andinos" },
      { label: "Modalidad Actual", value: "Venta directa de pescador a consumidor" }
    ],
    quote: "«Comprar guapucha local es sembrar futuro en las manos de quien cuida la laguna.»"
  },

  "sabores-y-tradicion": {
    id: "sabores-y-tradicion",
    title: "Sabores y tradición",
    category: "Identidad Culinaria",
    subtitle: "El maridaje de la tierra fría colombiana",
    badge: "Patrimonio Gustativo",
    color: "#3b7ebf",
    text: `El perfil organoléptico de la guapucha es un reflejo puro de su biotopo: notas minerales limpias, ausencia total de olor fangoso gracias al filtrado constante de los totorales, y un fondo dulce característico de los carácidos de alta montaña.<br><br>
    En la mesa tradicional, se complementa con una taza humeante de agua de panela con queso campesino o chicha fermentada en múcura de barro, equilibrando la salinidad crocante del pescado con la dulzura reconfortante del campo andino.`,
    stats: [
      { label: "Notas Gustativas", value: "Mineral, dulce, herbáceo sutil" },
      { label: "Maridaje Líquido", value: "Agua de panela con limón o chicha" },
      { label: "Sensación", value: "Cálida, reconfortante y festiva" }
    ],
    quote: "«En cada bocado se resume el aroma del viento frío y la bondad de nuestras aguas.»"
  },

  "una-tradicion-que-permanece": {
    id: "una-tradicion-que-permanece",
    title: "Una tradición que permanece",
    category: "Futuro y Esperanza",
    subtitle: "El pacto de una generación por la vida",
    badge: "Compromiso",
    color: "#3b7ebf",
    text: `A pesar de los desafíos ecológicos, el cambio climático y la presión urbana, <strong>la guapucha y la cultura de Fúquene se niegan a desaparecer</strong>.<br><br>
    Nuevos movimientos de jóvenes biólogos, cocineros de vanguardia, pescadores tradicionales y escuelas rurales están trabajando de la mano. Investigaciones científicas en reproducción en cautiverio para repoblación, sumadas a la valoración de la gastronomía ancestral como atractivo turístico sostenible, abren un horizonte prometedor donde la laguna y su gente seguirán cantándole a la vida por muchos siglos más.`,
    stats: [
      { label: "Misión Actual", value: "Conservación biocultural activa" },
      { label: "Participantes", value: "Jóvenes, científicos y sabedores" },
      { label: "Visión", value: "Laguna de Fúquene viva y próspera" }
    ],
    quote: "«La guapucha no es solo un pez del pasado; es el faro que nos guía hacia el cuidado del agua en el porvenir.»"
  }
};

// SITE_DATA - Estructura completa de contenidos según especificación PDF "Guapuchas: Latidos de Fúquene"
const SITE_DATA = {
  header: {
    title: "Guapuchas latidos de Fúquene",
    subtitle: "Un recorrido interactivo por la memoria viva, la gastronomía y las voces de la Laguna de Fúquene.",
    cta: "Comienza el viaje"
  },

  treasureMap: {
    title: "Mapa ilustrado del tesoro",
    description: "Este mapa interactivo te guiará por los 5 puntos cardinales de la memoria y la vida en la Laguna de Fúquene. Haz clic en cada parada para navegar directamente a sus secretos.",
    points: [
      {
        id: "donde-estamos",
        num: 1,
        title: "Laguna de Fúquene",
        subtitle: "¿Dónde estamos?",
        icon: "🌊",
        desc: "Geografía sagrada, historia milenaria y el santuario del agua."
      },
      {
        id: "que-es-guapucha",
        num: 2,
        title: "Guapucha",
        subtitle: "¿Qué es una guapucha?",
        icon: "🐟",
        desc: "Anatomía 3D, distribución biológica e impacto socioeconómico."
      },
      {
        id: "escucha-el-territorio",
        num: 3,
        title: "Comunidad",
        subtitle: "Escucha el territorio",
        icon: "🎙️",
        desc: "Voces vivas, relatos de pescadores y galería comunitaria."
      },
      {
        id: "no-esta-en-un-libro",
        num: 4,
        title: "Luz Mery",
        subtitle: "No está en un libro",
        icon: "🍳",
        desc: "Crónica de cocina ancestral, ingredientes y minijuego interactivo."
      },
      {
        id: "contactos",
        num: 5,
        title: "Contáctanos",
        subtitle: "Detrás de las Guapuchas",
        icon: "💌",
        desc: "Agradecimientos a la comunidad, equipo y buzón de ideas."
      }
    ]
  },

  dondeEstamos: {
    title: "¿Dónde estamos?",
    subtitle: "Recorrido guiado por Leo la Guapucha a través de la Laguna de Fúquene",
    badge: "Geografía y Memoria",
    intro: "Bienvenido a la Laguna de Fúquene, situada a 2.540 metros de altitud en los valles de Ubaté y Chiquinquirá. Acompáñanos en este recorrido con audio narrativo guiado por Leo la Guapucha.",
    audioBackground: {
      title: "Tema musical de fondo: Soy colombiano (versión instrumental)",
      defaultNote: "Audio instrumental por defecto (sintetizado). Puedes reemplazar el archivo en data-audio-src con tu archivo de audio MP3 preferido.",
      src: "audio/soy_colombiano.mp3"
    },
    dialogues: [
      {
        speaker: "Mujer IA",
        role: "Narradora y Guía del Viaje",
        avatar: "🎙️",
        audioSrc: "audio/dialogo_mujer_ia.mp3",
        text: "¡Hola! Bienvenidos a este viaje por la Laguna de Fúquene. Hoy no solo vamos a conocer un lugar mágico de Colombia, sino también a un pequeño habitante que guarda los secretos de estas aguas frías: ¡la guapucha! Y quién mejor para guiarnos que Leo, un pececito muy especial que ha vivido aquí toda su vida."
      },
      {
        speaker: "Leo la Guapucha",
        role: "Guardián de la Laguna",
        avatar: "🐟",
        audioSrc: "audio/dialogo_leo.mp3",
        text: "¡Hola a todos! Yo soy Leo, una guapucha nadadora de Fúquene. Seguro me ves chiquito, pero mi familia lleva nadando en estas aguas desde antes de que existieran los caminos y las carreteras. Aquí entre los juncales y el agua fría aprendí a esquivar peligros, a buscar comida y a escuchar las historias que cuentan los pescadores en sus canoas cuando el sol apenas sale."
      },
      {
        speaker: "Mujer IA",
        role: "Narradora y Guía del Viaje",
        avatar: "🎙️",
        audioSrc: "audio/dialogo_mujer_2.mp3",
        text: "¿Sabías que la laguna ha cambiado mucho con los años? Antes era tan grande que parecía un mar en medio de las montañas. Los abuelos cuentan que sus aguas eran cristalinas y que las guapuchas abundaban por millones. Hoy la laguna enfrenta retos ambientales por el buchón y la sedimentación, pero su corazón sigue latiendo con fuerza gracias al esfuerzo de las familias campesinas."
      }
    ]
  },

  queEsGuapucha: {
    title: "¿Qué es una guapucha?",
    subtitle: "El pez nativo de las aguas frías andinas (Grundulus bogotensis)",
    badge: "Biología & Anatomía 3D",
    intro: "La guapucha es un pez endémico del altiplano cundiboyacense que habita las aguas lentas y frías de la Laguna de Fúquene. Explora su modelo anatómico interactivo en 3D haciendo clic en sus partes para conocer su función adaptativa.",
    anatomyParts: [
      { id: "escamas", name: "Escamas y Coloración", desc: "Tonos oliváceos, plateados y dorados que le permiten mimetizarse entre el junco y los sedimentos de la laguna para protegerse de depredadores." },
      { id: "ojos", name: "Ojos Adaptados", desc: "Grandes y orientados lateralmente para detectar presas diminutas y movimientos en aguas andinas con alta turbidez y luz dispersa." },
      { id: "aleta-dorsal", name: "Aleta Dorsal", desc: "Ubicada en la parte superior posterior para proporcionar estabilidad hidrodinámica frente a las corrientes y el viento lacustre." },
      { id: "vientre", name: "Vientre y Vejiga Natatoria", desc: "Zona plateada y aerodinámica con vejiga natatoria de alta precisión para flotar a profundidades medias entre 1 y 3 metros." },
      { id: "aleta-caudal", name: "Aleta Caudal (Cola)", desc: "Bifurcada y ágil, le permite realizar impulsos rápidos e impredecibles para alimentarse de larvas de insectos y zooplancton." }
    ],
    charts: [
      {
        id: "distribucion",
        title: "Distribución geográfica de la guapucha en la cuenca de Fúquene",
        type: "bar",
        data: [
          { label: "Laguna principal", percentage: 65, color: "#1976d2" },
          { label: "Humedales aledaños y totorales", percentage: 20, color: "#2e7d32" },
          { label: "Ríos y caños tributarios", percentage: 15, color: "#f57c00" }
        ],
        summary: "El 65% de la población se concentra en las aguas abiertas de la laguna, mientras que los totorales periféricos actúan como zonas críticas de desove y crianza."
      },
      {
        id: "impacto-socioeconomico",
        title: "Impacto socioeconómico en las familias pescadoras",
        type: "bar",
        data: [
          { label: "Alimento y seguridad nutricional propia", percentage: 55, color: "#00897b" },
          { label: "Comercio local y venta en carretera", percentage: 30, color: "#e65100" },
          { label: "Trueque tradicional comunitario", percentage: 15, color: "#6a1b9a" }
        ],
        summary: "Más de la mitad del impacto se centra en la seguridad alimentaria directa de las familias ribereñas, constituyendo una fuente proteica patrimonial insustituible."
      }
    ]
  },

  escuchaElTerritorio: {
    title: "Escucha el territorio",
    subtitle: "Voces y memorias vivas de la ribera de Fúquene",
    badge: "Paisaje Sonoro & Testimonios",
    intro: "Escucha los testimonios directos de los guardianes del agua: los pescadores tradicionales y las cocineras populares que mantienen encendida la llama de la memoria.",
    audios: [
      {
        id: "audio-pescador",
        title: "Testimonio de un pescador tradicional",
        speaker: "Don Álvaro – Pescador artesanal de Fúquene",
        role: "Pescador con más de 40 años en la laguna",
        audioSrc: "audio/testimonio_pescador.mp3",
        transcript: "«Desde las cuatro de la mañana salimos en la canoa de madera. La laguna nos recibe en silencio, solo se oye el viento y el canto de las tingüitas. Cuando tiramos la red, pedimos permiso al agua; la guapucha es un regalo sagrado que no se malgasta, nos ha criado a todos nosotros y a nuestros hijos.»"
      },
      {
        id: "audio-luz-mery",
        title: "Historia de Doña Luz Mery",
        speaker: "Doña Luz Mery – Cocinera y sabedora tradicional",
        role: "Custodia de la receta ancestral de guapuchas fritas",
        audioSrc: "audio/historia_luz_mery.mp3",
        transcript: "«Mi mamá me enseñó a preparar las guapuchas con leña de aliso cuando yo tenía apenas diez años. Me decía: 'Mijita, la guapucha se limpia con cariño, no se le quita la escama brava sino con sal marina, y se pone a dorar hasta que quede tostadita como una galleta'. Ese sabor no lo da ninguna sartén moderna, es el sabor de la tierra fría.»"
      },
      {
        id: "audio-comunidad",
        title: "Vivencias de la comunidad",
        speaker: "Relato colectivo de las familias ribereñas",
        role: "Memoria colectiva de Fúquene y Guachetá",
        audioSrc: "audio/vivencias_comunidad.mp3",
        transcript: "«La laguna no es solo agua: es nuestra casa, nuestro sustento y nuestra identidad. Antes, los domingos la gente bajaba a orillas de la laguna a compartir un plato de guapuchas fritas con papa criolla y ají casero. Hoy seguimos luchando por limpiarla y cuidarla, para que nuestros nietos también sepan a qué sabe Fúquene.»"
      }
    ],
    photoWall: {
      title: "Muro de fotos de la comunidad",
      subtitle: "Fotografías, recuerdos y memorias vivas aportadas por quienes aman la laguna",
      initialMemories: [
        {
          id: 1,
          title: "Faena matutina al amanecer",
          author: "Don Álvaro Pescador",
          date: "Ayer a las 5:30 am",
          text: "Canotaje tradicional en la zona de totorales mientras amanece sobre las montañas de Boyacá.",
          tag: "Pesca Tradicional",
          badgeColor: "#1976d2"
        },
        {
          id: 2,
          title: "Paila de hierro y leña viva",
          author: "Doña Luz Mery",
          date: "Hace 2 días",
          text: "El fogón tradicional encendido listo para dorar las guapuchas con el toque crujiente perfecto.",
          tag: "Gastronomía",
          badgeColor: "#e65100"
        },
        {
          id: 3,
          title: "Cuidado de la laguna y siembra",
          author: "Juventud de Simijaca",
          date: "Semana pasada",
          text: "Jornada comunitaria de limpieza de buchón y siembra de alisos protectores en la ribera norte.",
          tag: "Conservación",
          badgeColor: "#2e7d32"
        }
      ]
    }
  },

  noEstaEnUnLibro: {
    title: "No está en un libro",
    subtitle: "La cocina ancestral de Doña Luz Mery y el arte de la guapucha frita",
    badge: "Gastronomía Viva",
    chronicle: {
      title: "Crónica de Doña Luz: El secreto que no cabe en un recetario",
      text: "Doña Luz Mery aprendió a cocinar no con recetas escritas ni libros de alta cocina, sino observando las manos curtidas de su madre a la luz de una vela y al calor de la leña de aliso. En la cocina campesina de Fúquene, el tiempo no se mide en minutos de reloj, sino en el aroma que desprende la sartén y en el chisporroteo del aceite que anuncia el momento exacto en que la guapucha alcanza su crocancia dorada. Su cocina es un templo de memoria viva donde cada bocado rinde tributo al esfuerzo del pescador y a la generosidad de la laguna."
    },
    ingredients: [
      { name: "Guapuchas frescas", desc: "Recién pescadas en la madrugada, limpias y firmes.", icon: "🐟" },
      { name: "Harina de trigo o maíz", desc: "Para un rebozado fino que selle los jugos interiores.", icon: "🌾" },
      { name: "Sal marina y cebolla larga picada", desc: "El sazón exacto machacado en mortero de piedra.", icon: "🧂" },
      { name: "Manteca tradicional o aceite vegetal", desc: "Suficiente para sumergir el pescado a temperatura alta constante.", icon: "🫒" },
      { name: "Papas criollas o nativas cocidas", desc: "Acompañamiento andino clásico con piel dorada y tierna.", icon: "🥔" },
      { name: "Gotas de limón fresco", desc: "El toque cítrico final que equilibra el sabor del agua dulce.", icon: "🍋" }
    ],
    recipeSteps: [
      { step: 1, title: "Lavado y salmuera suave", desc: "Se lavan las guapuchas con agua fría de manantial y se dejan reposar en una salmuera ligera con gotas de limón para desflecar." },
      { step: 2, title: "Enharinado ligero", desc: "Se pasan suavemente por una fina capa de harina sazonada con comino, cebolla larga y sal, sacudiendo el exceso." },
      { step: 3, title: "Fritura en paila de hierro", desc: "En manteca bien caliente, se sumergen durante 3 a 4 minutos hasta obtener un tono dorado brillante y textura crujiente." },
      { step: 4, title: "Emplatado tradicional", desc: "Se sirven calientes en canastillos o platos de barro, acompañadas de papas criollas al vapor y rodajas de limón fresco." }
    ],
    tips: "«El verdadero secreto no es el fuego alto, sino el cariño y la paciencia. La guapucha se voltea solo una vez, cuando la misma paila te avisa con su crujido.» — Doña Luz Mery"
  },

  miniGame: {
    title: "¡Arma tu plato!",
    subtitle: "Minijuego interactivo de cocina tradicional",
    instructions: "Elige tu personaje cocinero, atiende el pedido del comensal, selecciona los ingredientes autóctonos correctos y cocina el plato perfecto guiado por Doña Luz.",
    characters: [
      { id: "perla", name: "Perla", role: "Aprendiz entusiasta de cocina campesina", avatar: "👩‍🍳" },
      { id: "alejo", name: "Alejo", role: "Joven pescador y ayudante de fogón", avatar: "🧑‍🍳" },
      { id: "luz-mery", name: "Doña Luz Mery", role: "Maestra cocinera tradicional de Fúquene", avatar: "👵" }
    ]
  },

  survey: {
    title: "Encuesta – Guapuchas: Latidos de Fúquene",
    subtitle: "Ayúdanos a evaluar el impacto de este recorrido cultural y ecológico",
    questions: [
      {
        id: "q1",
        question: "¿Sabías de la existencia de la guapucha antes de visitar este sitio web?",
        options: ["Sí, la conocía muy bien", "Había oído hablar de ella brevemente", "No, no la conocía para nada"]
      },
      {
        id: "q2",
        question: "¿Qué aspecto te pareció más valioso del recorrido interactivo?",
        options: ["Los personajes y modelos 3D interactivos", "Los testimonios y audios de los pescadores", "La receta tradicional y el minijuego de cocina", "Los datos ecológicos y de distribución de la laguna"]
      },
      {
        id: "q3",
        question: "¿Consideras importante salvaguardar la gastronomía asociada a especies nativas como la guapucha?",
        options: ["Totalmente de acuerdo, es patrimonio biocultural", "De acuerdo, pero priorizando la conservación ecológica", "Neutral", "En desacuerdo"]
      },
      {
        id: "q4",
        question: "¿Visitarías la Laguna de Fúquene para conocer su comunidad y probar sus platos tradicionales?",
        options: ["¡Definitivamente sí!", "Probablemente sí en mis próximas vacaciones", "Tal vez, si hay más oferta ecoturística", "No por el momento"]
      },
      {
        id: "q5",
        question: "¿Cómo calificarías tu experiencia general en esta plataforma?",
        options: ["⭐⭐⭐⭐⭐ Excelente", "⭐⭐⭐⭐ Muy buena", "⭐⭐⭐ Buena", "⭐⭐ Regular"]
      }
    ]
  },

  contacts: {
    title: "Contactos – Detrás de las Guapuchas",
    subtitle: "El equipo y la comunidad que hacen latir este proyecto",
    description: "Este proyecto nace del amor por la Laguna de Fúquene, sus aguas andinas y las manos trabajadoras de las familias pescadoras y cocineras que custodian la memoria de la guapucha. Es un homenaje biocultural digital para conectar a las nuevas generaciones con nuestras raíces vivas.",
    gratitude: [
      "Comunidad de pescadores artesanales de la Laguna de Fúquene",
      "Doña Luz Mery y las sabedoras culinarias de la cuenca",
      "Guardianes ecológicos y colectivos ambientales del altiplano cundiboyacense",
      "Investigadores y biólogos dedicados a la protección de Grundulus bogotensis"
    ],
    feedbackTitle: "Nos puedes dar una idea plis",
    feedbackDesc: "Tus sugerencias, recuerdos y aportes nos ayudan a enriquecer este espacio interactivo. ¡Escríbenos tu idea!"
  }
};
