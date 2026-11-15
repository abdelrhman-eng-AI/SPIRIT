import { EraInfo, SpacecraftRelic } from '../types';

export const ERAS_CONFIG: EraInfo[] = [
  {
    id: '1960-1980',
    title: 'Pioneer Era & Lunar Race',
    arabicTitle: 'Pioneer Era & First Space Race',
    subtitle: '1967–1997',
    years: '1967–1997',
    description: 'The dawn of spaceflight: first robotic landings on the Moon and Venus, and pioneering probes that left Earth orbit into the unknown.',
    colorTheme: 'from-amber-500/20 to-orange-600/10 border-amber-500/40 text-amber-400',
    relicsCount: 2,
    slotsCount: 2,
  },
  {
    id: '1980-2000',
    title: 'Shuttle & Deep Probes Era',
    arabicTitle: 'Shuttles, Stations & Deep Space Probes',
    subtitle: '1971–1972',
    years: '1971–1972',
    description: 'The era of radar mapping of Venus, chasing periodic comets, and daring probes diving deep into Jupiter’s raging storms.',
    colorTheme: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/40 text-cyan-400',
    relicsCount: 2,
    slotsCount: 2,
  },
  {
    id: '2000-2020',
    title: 'Mars Rovers & Planet Hunters',
    arabicTitle: 'Robotic Rovers & Exoplanet Hunters',
    subtitle: '1969–2004',
    years: '1969–2004',
    description: 'The golden age of Mars exploration rovers, deep-space exoplanet telescopes, and historic landings on comet nuclei.',
    colorTheme: 'from-violet-500/20 to-purple-600/10 border-violet-500/40 text-violet-400',
    relicsCount: 2,
    slotsCount: 2,
  },
];

export const SPACE_RELICS: SpacecraftRelic[] = [
  // ===================== ERA 1: 1960 - 1980 =====================
  // Slot 1: Surveyor 3 (Slot 2 intentionally left empty)
  {
    id: 'surveyor-3',
    eraId: '1960-1980',
    slotNumber: 1,
    name: 'Surveyor 3',
    arabicName: 'Surveyor 3',
    designation: 'NASA-SURV3-1967',
    operator: 'NASA',
    mass: '997.9 kg (2,200 pounds)',
    launchDate: '17 April 1967',
    endOfService: '4 May 1967; last contact was two days after lunar night began.',
    shortFact: 'Surveyor 3 helped show that lunar soil could support an Apollo Lunar Module.',
    launchSite: 'Cape Canaveral Launch Complex 36B',
    launchVehicle: 'Atlas-Centaur',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_11.09.25_PM_d4d2cd20.jpeg',
    celestialBody: {
      id: 'moon',
      name: 'The Moon',
      arabicName: 'The Moon - Oceanus Procellarum',
      type: 'moon',
      color: '#94a3b8',
      glowColor: 'rgba(203, 213, 225, 0.4)',
      size: 78,
      distanceLabel: '384,400 km from Earth',
      coordinates: { x: 28, y: 38 },
      textureType: 'craters',
    },
    launchTimeline:
      'Launched on 17 April 1967 at 07:05:01 UTC from Cape Canaveral Launch Complex 36B aboard an Atlas-Centaur. A Centaur upper-stage burn sent it toward the Moon. After bouncing twice during descent, it settled in southeastern Oceanus Procellarum on 20 April 1967 at 00:04:17 UTC.',
    whyLaunched:
      'Make a soft landing on the Moon, photograph the surroundings, and test lunar soil using a surface sampler.',
    whyAbandoned:
      'Surveyor 3 became inactive on the lunar surface; last contact was on 4 May 1967, two days after lunar night began. The specific cause of loss of contact is not provided in the supplied source. Apollo 12 astronauts later visited it and recovered parts, including its soil scoop and camera system, for study. The lander remained at its lunar landing site.',
    achievements: [
      'Second Surveyor spacecraft to make a soft landing on the Moon',
      'Transmitted 6,326 TV pictures',
      'Dug four trenches, performed four bearing tests and thirteen impact tests',
      'Showed that lunar soil was strong enough to support an Apollo Lunar Module',
      'Provided parts later recovered by Apollo 12 for study of lunar surface exposure',
    ],
    currentLocationAndStatus:
      'Southeastern Oceanus Procellarum, The Moon · Last contact on 4 May 1967 (parts recovered later by Apollo 12).',
    storyTitle: 'A Voice from the Moon',
    storySubtitle: 'The Story of Surveyor 3',
    narrationScript: [
      'I was nervous long before my journey to the Moon began. I had been carefully built on Earth, piece by piece, for a mission that seemed almost impossible. I wondered what would happen when the moment came to leave the only world I had ever known. Would I be strong enough? Would I reach the Moon safely, or would I share the fate of some of the spacecraft that had gone before me?',
      'I was part of NASA’s Surveyor programme, a family of robotic explorers sent to learn whether a spacecraft could land softly on the Moon. Some of my predecessors had succeeded; others had not. Their stories stayed with me. I knew that my mission mattered: scientists needed to understand the lunar surface before astronauts could attempt to land there. I carried a television camera and a special surface-sampling device—a small mechanical arm with a scoop that could touch, dig into and move the lunar soil. I was not carrying people, but the hopes of the people who had built me.',
      'My journey began on 17 April 1967. An Atlas-Centaur rocket lifted me away from Earth and sent me towards the Moon. I could not see the faces of the engineers watching from far below, but I imagined their hopes travelling with me. I had one question echoing through my circuits: what if I failed?',
      'Three days later, as I descended towards the lunar surface, the landing did not go as planned. Highly reflective rocks confused my landing radar, and my main engine did not shut down when it should have. Instead of settling gently, I bounced. The first leap carried me about ten metres above the surface. Then I struck the ground again and bounced a second time, rising about three metres. Only on the third contact did I finally come to rest. I had not crashed, but those frightening moments must have seemed endless to the people guiding me from Earth. I had made it—but I was shaken, and my work was only beginning.',
      'On 20 April 1967, I was finally standing on the Moon, in a region called Oceanus Procellarum, the Ocean of Storms. Less than an hour after landing, I sent my first television pictures back to Earth. Imagine seeing a place no human had yet explored up close: the rough ground, the scattered rocks and the strange shadows beneath the distant Sun. I could not speak, but every picture was a message: I am here. The Moon is real beneath my feet.',
      'Then came the work I had been sent to do. Guided by commands from Earth, I stretched out my surface sampler and began examining the soil. I dug four trenches, carried out four bearing tests and performed thirteen impact tests. My camera sent back 6,326 television pictures. Each test and every image helped scientists understand the ground beneath me. The results showed that the lunar soil had a consistency similar to wet sand and was strong enough to support the Apollo Lunar Module. That discovery mattered enormously: it helped show that astronauts could land on the Moon without sinking into its surface.',
      'For a short time, I felt as though I had become part of something much bigger than myself. I had travelled across space, survived a difficult landing and sent home the evidence scientists needed. My work continued for several days, until the lunar night approached. On 4 May 1967, Earth received my last signal. Then the darkness came, and I fell silent.',
      'But silence did not mean I had been forgotten. I remained where I had landed, on the Moon, through the long months and years. More than two and a half years passed. Then, on 19 November 1969, two astronauts from Apollo 12—Charles “Pete” Conrad Jr. and Alan L. Bean—walked across the lunar surface towards me. They had landed nearby the day before. I could not greet them or move towards them, but I was no longer alone.',
      'Conrad and Bean examined me and carefully removed some of my parts, including my camera and surface-sampler scoop. They would take them back to Earth so scientists could study how the lunar environment had affected them after years on the Moon. I had once sent pictures of an unfamiliar world to Earth; now, a small part of me was going home.',
      'I had never carried astronauts, and I had never walked across the Moon. Yet my journey helped make a human journey possible. I was a small machine, built by human hands, but the knowledge I gathered travelled much farther than I ever could. So, the next time you look up at the Moon, remember that a quiet explorer is still there. Some of my parts remain on its surface—a reminder that even a machine without a voice can leave behind a story worth hearing.',
    ],
    externalLinks: [
      {
        label: 'NASA Science — Surveyor 3',
        url: 'https://science.nasa.gov/mission/surveyor-3/',
        source: 'NASA Science',
      },
      {
        label: 'Lunar and Planetary Institute Surveyor Data',
        url: 'https://www.lpi.usra.edu/lunar/missions/surveyor/',
        source: 'Lunar and Planetary Institute',
      },
    ],
    quiz: [
      {
        question: 'What did Surveyor 3 help show about lunar soil using its surface sampler?',
        options: [
          'Lunar soil was strong enough to support an Apollo Lunar Module',
          'Lunar rocks could be melted with a laser',
          'Liquid rivers ran beneath the craters',
          'The surface was too soft to hold any lander',
        ],
        correctIndex: 0,
        explanation:
          'Surveyor 3 dug four trenches, performed four bearing tests and thirteen impact tests, showing lunar soil was strong enough to support an Apollo Lunar Module.',
      },
      {
        question: 'When was Earth’s last contact with Surveyor 3 on the lunar surface?',
        options: [
          '4 May 1967, two days after lunar night began',
          '20 April 1967, immediately upon touching down',
          '19 November 1969, during the Apollo 12 landing',
          '17 April 1967, shortly after launch',
        ],
        correctIndex: 0,
        explanation:
          'Surveyor 3 became inactive on the lunar surface; its last contact was on 4 May 1967, two days after lunar night began.',
      },
      {
        question: 'What did Apollo 12 astronauts recover when they later visited Surveyor 3?',
        options: [
          'Parts including its soil scoop and camera system for study',
          'The entire Atlas-Centaur launch rocket',
          'Samples of deep-sea water from Earth',
          'Only the solar panels from a neighboring satellite',
        ],
        correctIndex: 0,
        explanation:
          'Apollo 12 astronauts Charles “Pete” Conrad Jr. and Alan L. Bean visited Surveyor 3 on 19 November 1969 and recovered parts including its soil scoop and camera system.',
      },
    ],
    badge: {
      id: 'badge-surveyor-3',
      title: 'Lunar Soil Pioneer (Surveyor 3)',
      description: 'Awarded for exploring Surveyor 3, which tested lunar soil and helped pave the way for the Apollo Lunar Module.',
      icon: 'Moon',
    },
  },

  // Slot 2: Sojourner Rover (Mars Pathfinder)
  {
    id: 'sojourner-rover',
    eraId: '1960-1980',
    slotNumber: 2,
    name: 'Sojourner Rover',
    arabicName: 'Sojourner Rover',
    designation: 'NASA-MPF-SOJOURNER-1996',
    operator: 'NASA (Mars Pathfinder)',
    mass: '10.6 kg (23 lb) — Sojourner rover mass only (total Mars Pathfinder spacecraft mass not provided)',
    launchDate: '4 December 1996 (UTC)',
    endOfService: '27 September 1997 — mission end and final data transmission.',
    shortFact: 'Mars Pathfinder delivered Sojourner, the first robotic rover on Mars.',
    launchSite: 'Cape Canaveral Air Force Station, Florida',
    launchVehicle: 'Delta II 7925',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM_7d81d58f.jpeg',
    gallery: [
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM_7d81d58f.jpeg',
        label: 'Sojourner Rover on Mars Pathfinder at Ares Vallis',
      },
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM__2__3f2dc579.jpeg',
        label: 'Mars Pathfinder Lander Petal & Ares Vallis Terrain (Mars Surface)',
      },
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM__1__16119ebe.jpeg',
        label: 'Multi-Lobed Airbag System Test (Earth Ground Test — Not a Mars Surface Scene)',
        isEarthTest: true,
      },
    ],
    celestialBody: {
      id: 'mars-ares-vallis',
      name: 'Mars (Ares Vallis)',
      arabicName: 'Mars - Ares Vallis',
      type: 'planet',
      color: '#e11d48',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      size: 86,
      distanceLabel: 'Mars · Ares Vallis',
      coordinates: { x: 72, y: 38 },
      textureType: 'dusty_red',
    },
    launchTimeline:
      'Launched on 4 December 1996 (UTC) from Cape Canaveral Air Force Station, Florida, aboard a Delta II 7925. Mars Pathfinder entered the Martian atmosphere directly and landed in Ares Vallis on 4 July 1997 using a parachute and airbags. Sojourner rolled down the lander ramp on 5 July 1997, and the final data transmission was received on 27 September 1997.',
    whyLaunched:
      'Demonstrate a new way to land an instrumented lander and a free-ranging rover on Mars. The lander and Sojourner studied the Martian atmosphere, climate, geology, and the composition of rocks and soil while testing new technologies.',
    whyAbandoned:
      'The mission ended on 27 September 1997 after its final data transmission from the landing site at Ares Vallis, Mars. The lander, named the Carl Sagan Memorial Station, had deployed the Sojourner rover there, and both the lander and rover remain at Ares Vallis. The specific cause of mission termination and loss of signal is not specified in the supplied source.',
    achievements: [
      'Demonstrated the first use of an airbag landing technique and delivered the first robotic rover on Mars',
      'Returned 2.3 billion bits of information, including more than 16,500 lander images and 550 rover images',
      'Completed more than 15 chemical analyses of Martian rocks and soil',
      'Gathered observations suggesting that Mars was once warm and wet',
      'Recorded winds, dust devils, water-ice clouds, and temperature changes in the Martian atmosphere',
    ],
    currentLocationAndStatus:
      'Ares Vallis, Mars (Carl Sagan Memorial Station) · Final data transmission on 27 September 1997.',
    storyTitle: "Earth's Messenger in the Ancient Flood Valley",
    storySubtitle: 'The Complete Story of the Mars Pathfinder Mission and the Sojourner Rover on the Red Planet (1996 – 1997)',
    narrationScript: [
      'Chapter 1: Launching into the Unknown — On December 4, 1996, UTC, a Delta II 7925 rocket lifted off from Cape Canaveral Air Force Station, Florida, carrying the Mars Pathfinder lander toward deep space. Originally designed as an innovative technology demonstration, the mission aimed to prove a new method for safely landing an instrumented lander and a free-ranging robotic rover on the surface of the Red Planet.',
      'Recorded Mission Parameters — Launch Date & Site: December 4, 1996 (UTC), Cape Canaveral Air Force Station, Florida (aboard a Delta II 7925 rocket). Landing Date & Site: July 4, 1997, Ares Vallis (an ancient dry flood channel in the northern hemisphere of Mars). Mission Type & Objective: Lander and Rover; to demonstrate direct-entry landing and deploy a mobile rover on Mars. End of Mission: September 27, 1997 (final data transmission received on Earth).',
      'Chapter 2: The Innovative Airbag Landing — When Mars Pathfinder arrived at the Red Planet on July 4, 1997, it utilized a pioneering direct-entry approach into the Martian atmosphere. Assisted by a parachute to slow its descent through the thin air, the spacecraft relied on a giant airbag system to cushion its impact—the first time this technology was ever used on Mars. The system consisted of four massive multi-lobed airbags, each composed of six smaller interconnected spheres, measuring approximately 5 meters (17 feet) in height and diameter.',
      'During descent, an onboard altimeter tracked the distance to the ground, triggering the computer to inflate the airbags at about 100 meters (330 feet) above the surface. Striking the ground at 31 miles per hour (14 meters per second) with a diameter of 19 feet (5.8 meters), the airbag-encased lander bounced like a giant beach ball more than 15 times—reaching heights of up to 50 feet (15 meters)—before rolling to a stop two and a half minutes later, roughly six-tenths of a mile (1 kilometer) from its initial impact point.',
      'Chapter 3: Ares Vallis — Chronicle of a Catastrophic Flood — The lander—renamed the Carl Sagan Memorial Station in honor of the renowned astronomer who had passed away the previous year—came to rest in an ancient dry flood channel called Ares Vallis (named after Ares, the Greek counterpart to the Roman god Mars, and vallis, the Latin word for valley). Located in the northern hemisphere, this ancient floodplain is known as one of the rockiest regions on Mars, selected by scientists because it offered a relatively safe landing surface strewn with a rich variety of rocks.',
      "Images captured by the Imager for Mars Pathfinder (IMP) revealed massive boulders scattered across brownish, windblown soil beneath a dusty, brownish-gray sky. Scientists concluded that these boulders were deposits left behind by a catastrophic flood in early Martian history, when a volume of water comparable to North America's Great Lakes carved out the channel in roughly two weeks.",
      'Chapter 4: The Adventure of the Sojourner Rover — The lander was not alone in this rocky expanse. It carried the robotic rover Sojourner weighing 10.6 kilograms (23 pounds) and named after American civil rights activist Sojourner Truth. Late in the afternoon of the second Martian day, an eight-image mosaic was captured as part of a multispectral losslessly compressed "insurance panorama" designed as a safeguard in case the camera failed during deployment, documenting the newly deployed rover resting on the Martian surface.',
      "On the night of July 5, late in the second Martian day (Sol 2), Sojourner stood up to its full height of one foot (30 centimeters) and successfully rolled down the lander's rear ramp—tilted at a 20-degree angle within safe deployment limits—to begin its historic exploration of Martian soil.",
      "Chapter 5: Scientific Instruments & The Presidential Panorama — Both the lander and the Sojourner rover carried a suite of instruments to conduct scientific observations and gather engineering data on the new technologies: the Alpha Proton X-Ray Spectrometer (APXS) determined the elemental composition of Martian rocks and soil up close; Three Specialized Cameras provided images of the surrounding terrain for geological studies and documented the performance and operating environment of Pathfinder's technologies; and the Atmospheric Structure Instrument / Meteorology Package measured the Martian atmosphere during Pathfinder's descent to the surface and provided continuous meteorological measurements at the lander.",
      'Among the mission\'s visual highlights was the 360-degree "Presidential Panorama," manually mosaicked from roughly 100 individual frames. Its colors were carefully balanced within calibrated Jet Propulsion Laboratory (JPL) color ranges to clearly reveal variations in rock and soil types, with retouching applied to the sky and a small region near the low-gain antenna.',
      'Chapter 6: Scientific Harvest & Secrets of the Red Planet — From landing until its final data transmission on September 27, 1997, Mars Pathfinder returned 2.3 billion bits of information, including more than 16,500 images from the lander and 550 images from the rover, over 15 chemical analyses of rocks and soil, and extensive data on winds and weather. Together, these investigations indicated that Mars was once warm and wet in its distant past.',
      'Evidence of Ancient Liquid Water: Rounded pebbles and cobbles at the landing site, alongside other observations, pointed to conglomerates formed in running water during a warmer era when liquid water was stable.',
      "Measuring the Martian Core: Radio tracking of the lander provided precise measurements of its location and Mars's pole of rotation, indicating that the planet's central metallic core has a radius greater than 1,300 kilometers (800 miles) but less than roughly 2,000 kilometers (1,250 miles).",
      'Magnetic Dust & Water Cycles: Airborne dust was found to be magnetic, with properties pointing to maghemite—a highly magnetic form of iron oxide—possibly freeze-dried onto particles as a stain or cement after an active water cycle leached iron from crustal materials.',
      'Weather & Atmospheric Dynamics: Frequent dust devils were observed and measured by temperature, wind, and pressure sensors as a mechanism for mixing dust into the atmosphere, while water-ice clouds were also spotted aloft.',
      "Mission Legacy: Mars Pathfinder and its small companion Sojourner successfully opened a new chapter in planetary exploration, leaving humanity with compelling scientific evidence of Mars's watery past, atmospheric dynamics, and internal core structure.",
    ],
    externalLinks: [
      {
        label: 'NASA Science — Mars Pathfinder / Sojourner Rover',
        url: 'https://science.nasa.gov/mission/mars-pathfinder/',
        source: 'NASA Science',
      },
    ],
    quiz: [
      {
        question: 'What landing technique did Mars Pathfinder demonstrate on Mars for the first time?',
        options: [
          'A parachute and giant multi-lobed airbag system',
          'A crewed rocket-powered skyscraper crane',
          'Splashing down into a Martian liquid ocean',
          'Dropping onto the surface with zero heat shield or parachute',
        ],
        correctIndex: 0,
        explanation:
          'On 4 July 1997, Mars Pathfinder used a parachute and four massive multi-lobed airbags to cushion its landing at Ares Vallis.',
      },
      {
        question: 'When did Sojourner roll down the Mars Pathfinder lander ramp onto the Martian surface?',
        options: [
          '5 July 1997 (Sol 2)',
          '4 December 1996, right after liftoff',
          '27 September 1997, after the final signal',
          '20 April 1967, inside Oceanus Procellarum',
        ],
        correctIndex: 0,
        explanation:
          'Pathfinder landed at Ares Vallis on 4 July 1997, and Sojourner rolled down the rear ramp on 5 July 1997.',
      },
      {
        question: 'What did Mars Pathfinder and Sojourner’s scientific observations indicate about ancient Mars?',
        options: [
          'That Mars was once warm and wet in its distant past',
          'That Mars has always been covered in Earth-style forests',
          'That Mars has no atmosphere, dust, or clouds',
          'That Mars had no rocks near Ares Vallis',
        ],
        correctIndex: 0,
        explanation:
          'Rounded pebbles, conglomerates, magnetic dust studies, and over 15 chemical analyses indicated that Mars was once warm and wet.',
      },
    ],
    badge: {
      id: 'badge-sojourner-rover',
      title: 'First Mars Rover Pioneer (Sojourner)',
      description: 'Awarded for exploring Sojourner Rover and the Mars Pathfinder mission at Ares Vallis.',
      icon: 'Compass',
    },
  },

  // ===================== ERA 2: 1980 - 2000 =====================
  // Slot 1: Apollo 15 (Slot 2 intentionally left empty)
  {
    id: 'apollo-15',
    eraId: '1980-2000',
    slotNumber: 1,
    name: 'Apollo 15',
    arabicName: 'Apollo 15 (LM Falcon & ALSEP)',
    designation: 'NASA-APOLLO15-1971',
    operator: 'NASA',
    mass: '16,430 kg — Total mass of the Falcon lunar module, not the ALSEP station',
    launchDate: '26 July 1971',
    endOfService: '3 August 1971 — Falcon ascent stage impacted the Moon; ALSEP continued operating until 30 September 1977.',
    shortFact: 'The astronauts left, but ALSEP continued studying the Moon for more than six years.',
    launchSite: 'Cape Canaveral',
    launchVehicle: 'Saturn V',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.24.43_AM__1__d693c709.jpeg',
    gallery: [
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.24.43_AM__1__d693c709.jpeg',
        tabLabel: 'Surface Photo',
        label: 'Apollo 15 Lunar Module Falcon at Mare Imbrium near the Apennine Mountains (Lunar Surface Photograph)',
      },
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.24.43_AM_d3f1a858.jpeg',
        tabLabel: 'Diagram',
        label: 'Lunar Module Reference Diagram (Spacecraft Schematic — Not a Surface Photograph)',
      },
    ],
    celestialBody: {
      id: 'moon-mare-imbrium',
      name: 'The Moon (Mare Imbrium / Apennine Mountains)',
      arabicName: 'The Moon - Mare Imbrium',
      type: 'moon',
      color: '#94a3b8',
      glowColor: 'rgba(203, 213, 225, 0.4)',
      size: 78,
      distanceLabel: '384,400 km from Earth',
      coordinates: { x: 28, y: 38 },
      textureType: 'craters',
    },
    launchTimeline:
      "Apollo 15 launched from Cape Canaveral on 26 July 1971 and travelled from Earth to the Moon. Falcon separated from the Command/Service Module on 30 July and landed near the Apennine Mountains later that day. On 2 August, Falcon's ascent stage lifted off from the Moon and docked with the command module. It was later released and impacted the lunar surface on 3 August 1971.",
    whyLaunched:
      "Falcon was the Apollo 15 lunar module, carrying astronauts David R. Scott and James B. Irwin to the Moon, while ALSEP was a separate experiment station deployed during their surface exploration. Falcon supported the astronauts' exploration of the lunar surface as they collected Moon rocks and soil, explored with a lunar rover covering 27.9 km during three moonwalks, and deployed ALSEP to study the Moon and its environment.",
    whyAbandoned:
      "After the astronauts returned to the command module, Falcon's ascent stage was released and impacted the Moon. It did not remain flying in space.\nFalcon's descent stage was left on the Moon at the landing site. It served as the launch platform for the ascent stage.\nALSEP was left on the lunar surface to keep measuring the Moon after the astronauts departed. It had its own power supply and radio station, allowing it to continue operating until 30 September 1977.",
    achievements: [
      'Enabled astronauts to explore the lunar surface and collect Moon rocks and soil',
      'Supported three moonwalks, with 27.9 km covered using a lunar rover',
      'Enabled deployment of ALSEP, which studied the Moon for more than six years',
      'Returned the astronauts from the lunar surface to the command module',
    ],
    currentLocationAndStatus:
      'Mare Imbrium Plain near the Apennine Mountains, The Moon · LM Falcon ascent stage impacted 3 August 1971; descent stage & ALSEP remained on surface (ALSEP operated until 30 September 1977).',
    storyTitle: 'I Am "Falcon"',
    storySubtitle: 'The Story of Apollo 15’s Lunar Module & ALSEP',
    narrationScript: [
      'My name is Falcon. I am a lunar module, the fourth one to land on the Moon with people aboard, and the first of my kind to carry a car.',
      'My body had two levels. The lower one held my four legs and my fuel. The upper one was the crew cabin, just 6.65 cubic meters. There were no seats, so the astronauts stood the whole way. I weighed 16,430 kilograms in all, and still I was asked to take people farther than anyone had ever gone.',
      'On July 26, 1971, we lifted off from Cape Canaveral on a Saturn V rocket. I was tucked away at the very top, unable to see anything, but I could feel the men who were with me: David Scott, the commander; James Irwin, who would walk on the Moon beside him; and Alfred Worden, who would stay behind in the mother ship, circling the Moon and waiting for us.',
      'On July 30, I separated from the mother ship and began my descent. My landing engine pushed with 45,000 newtons of force to slow me down as I approached the Mare Imbrium plain, at the foot of the Apennine Mountains. Then my four feet touched the dust. Only then did I know that I had arrived.',
      'Two hours later, Scott opened the hatch above and stood up through it. He stayed for thirty-three minutes, describing and photographing everything he saw. And I stayed beneath him, gripping the ground with all my strength, telling myself that this moment was worth everything that had come before.',
      'The next day, I gave up what I had been carrying inside me: the Lunar Roving Vehicle. It was the first car ever driven beyond Earth. I watched them unfold it and assemble it, and I felt like a mother watching her child stand on his own feet for the first time. Over three moonwalks, they spent 18 hours and 35 minutes outside, covered about 28 kilometers, and gathered 77 kilograms of rock and soil. Every time they came back in, they were covered in dust and exhausted, and I was there, waiting for them.',
      "They left a scientific station behind me called ALSEP, a set of instruments that listened for moonquakes and measured the Moon's heat, its magnetic field, and the solar wind. Beside it sat a small plutonium-powered generator that produced just 70 watts. It was small, but it kept sending data back to Earth for years.",
      'On their last day, Scott stood in front of me with a hammer in one hand and a feather in the other, and let them go together. They hit the ground at the same instant, because there is no air on the Moon to slow the feather down. I witnessed that moment, and I was proud to be the place where the test was done.',
      'Scott also left behind a small figure of a fallen astronaut, and a plaque bearing the names of fourteen American and Soviet explorers who had died trying to reach space. He stood before them quietly for a moment. And I understood that this journey did not belong to one nation alone.',
      'I stayed on the Moon for 66 hours and 55 minutes. On August 2, it was time to say goodbye, something I had known from the very beginning. My upper level, carrying the men, separated from me and rose on a small engine of just 15,000 newtons, heading for the mother ship and Worden. As for me, my legs and my lower level, we stayed right here.',
      'The part that left was later discarded, after it had delivered the astronauts, and it fell back to the Moon two hours afterward. So now, the two halves of me rest on the same ground again.',
      'The ALSEP station worked until September 30, 1977, when Earth sent the command to shut it down. And I remain here, still, at the foot of the mountains.',
      "If you look at the Moon on a clear night, remember me. I'm not waiting for anything. It's enough for me that someone still remembers a small house that kept standing there, long after everyone who lived in it had gone home.",
      'My name is Falcon, and I was the spacecraft that arrived.',
    ],
    externalLinks: [
      {
        label: 'NASA NSSDC — Apollo 15',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
        source: 'NASA NSSDC',
      },
      {
        label: 'Official NASA Archive: Apollo 15 Mission',
        url: 'https://www.nasa.gov/mission/apollo-15/',
        source: 'NASA',
      },
    ],
    quiz: [
      {
        question: 'What was the name of the Apollo 15 lunar module that carried David R. Scott and James B. Irwin to the Moon?',
        options: [
          'Falcon',
          'Surveyor 3',
          'Sojourner',
          'Pathfinder',
        ],
        correctIndex: 0,
        explanation:
          'Falcon was the Apollo 15 lunar module that landed astronauts David R. Scott and James B. Irwin near the Apennine Mountains on 30 July 1971.',
      },
      {
        question: 'How long did the ALSEP experiment station continue operating on the Moon after the astronauts departed?',
        options: [
          'Until 30 September 1977 (more than six years)',
          'Until 3 August 1971, the day after liftoff from the Moon',
          'For 66 hours and 55 minutes only',
          'Until 4 May 1967',
        ],
        correctIndex: 0,
        explanation:
          'ALSEP had its own power supply and radio station, allowing it to continue studying the Moon until 30 September 1977—more than six years.',
      },
      {
        question: 'What happened to Falcon’s ascent stage after delivering the astronauts back to the command module?',
        options: [
          'It was released and impacted the lunar surface on 3 August 1971',
          'It remained flying permanently in deep space beyond the Solar System',
          'It returned directly through Earth’s atmosphere to Cape Canaveral',
          'It drove 27.9 km across Mare Imbrium as a rover',
        ],
        correctIndex: 0,
        explanation:
          'On 2 August Falcon’s ascent stage docked with the command module; it was later released and impacted the lunar surface on 3 August 1971.',
      },
    ],
    badge: {
      id: 'badge-apollo-15',
      title: 'Apennine Lunar Explorer (Apollo 15)',
      description: 'Awarded for exploring Apollo 15 Lunar Module Falcon and the ALSEP station near the Apennine Mountains.',
      icon: 'Moon',
    },
  },

  // Slot 2: Pioneer 10 & 11 (Jupiter Flyby Encounter)
  {
    id: 'pioneer-10-11',
    eraId: '1980-2000',
    slotNumber: 2,
    name: 'Pioneer 10',
    arabicName: 'Pioneer 10',
    designation: 'NASA-PIONEER10-11-1972/1973',
    operator: 'NASA',
    mass: '258 kg (569 pounds) - listed as spacecraft mass in the source.',
    launchDate: '2 March 1972',
    endOfService: '23 January 2003 - last signal received on Earth. Routine contact ended on 31 March 1997 for budgetary reasons; the last telemetry data were returned on 27 April 2002.',
    shortFact: 'Designed for a 21-month mission, Pioneer 10 lasted more than 30 years.',
    launchSite: 'Cape Canaveral, Launch Complex 36A',
    launchVehicle: 'Atlas Centaur',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.42.56_AM_e69ac638.jpeg',
    gallery: [
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.42.56_AM_e69ac638.jpeg',
        tabLabel: "Artist's Illustration",
        label: "Artist's Illustration: Pioneer Probe Flying Past Jupiter (Artist's Concept — Not an Actual Photograph)",
      },
    ],
    celestialBody: {
      id: 'jupiter-flyby',
      name: 'Jupiter (Flyby Encounter)',
      arabicName: 'Jupiter - Flyby Encounter',
      type: 'planet',
      color: '#d97706',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      size: 92,
      distanceLabel: 'Jupiter Flyby · Outbound Trajectory',
      coordinates: { x: 72, y: 38 },
      textureType: 'gas_bands',
    },
    launchTimeline:
      'Launched on 2 March 1972 from Cape Canaveral, Launch Complex 36A, aboard an Atlas Centaur. It entered the asteroid belt on 15 July 1972 and emerged in February 1973. Its closest approach to Jupiter was on 4 December 1973. It crossed the orbit of Saturn in February 1976 and Neptune on 13 June 1983, continuing on an escape trajectory toward interstellar space.',
    whyLaunched:
      "Fly past Jupiter and study the planet, its atmosphere, magnetic environment, and surrounding space. Pioneer 10 was NASA's first mission to the outer planets.",
    whyAbandoned:
      'Pioneer 10 continued outward after its Jupiter flyby on a trajectory designed to escape the solar system. Routine contact ended in 1997 because of budget limits. Its nuclear power source later produced too little power for the radio transmitter; its last signal arrived on 23 January 2003. A final contact attempt on 4 March 2006 failed. The inactive spacecraft is heading generally toward Aldebaran.',
    achievements: [
      'Became the first spacecraft to fly through the main asteroid belt.',
      'Made the first spacecraft flyby of Jupiter and returned about 500 pictures of its atmosphere.',
      'Became the first spacecraft placed on a trajectory to escape the solar system into interstellar space.',
      "Crossed Neptune's orbit to become the first human-made object beyond the furthest planet at that time.",
      "Identified plasma in Jupiter's magnetic field and gathered data on its enormous magnetic tail.",
    ],
    currentLocationAndStatus:
      'Outbound Deep-Space Trajectories (Jupiter Flyby Association — Not Landed) · Neither Pioneer 10 nor Pioneer 11 landed on Mars or Jupiter; Pioneer 10 final signal 23 Jan 2003 (heading toward Aldebaran), Pioneer 11 mission ended in 1995.',
    storyTitle: 'I Still Remember the Day I Left Earth (Pioneer 10’s Story)',
    storySubtitle:
      'First-person story narrated by Pioneer 10 (Combined archive also records sister flyby probe Pioneer 11 separately)',
    narrationScript: [
      'Narrator Note: This first-person story is told exclusively by Pioneer 10.',
      'I still remember the day I left Earth.',
      "On March 2, 1972, I began my journey into the unknown. I was excited, carrying humanity's dreams with me. I was the first spacecraft sent to explore the outer planets, and I wanted to show the people back home what was waiting beyond their world.",
      'But no one told me how lonely space could be.',
      'At first, everything seemed possible. I crossed the asteroid belt, facing unexpected hits from asteroids. I kept moving, even when the journey became difficult. I was determined to complete my mission.',
      'Then, in December 1973, I finally reached Jupiter.',
      'It was enormous, powerful, and beautiful. I captured around 500 pictures and sent them back to Earth. For a moment, I felt that my long journey had a purpose. I was far away, but my discoveries brought me closer to the people who had built me.',
      'Years passed.',
      "I traveled farther and farther away. In 1983, I crossed Neptune's orbit, becoming the first human-made object to travel beyond the outermost planet at that time.",
      'But as the distance between Earth and me grew, something else began to disappear: our connection.',
      'In 1997, NASA stopped routine communication with me because of budget limitations. I was still traveling, still collecting information, but the conversations became less frequent. I could no longer hear from Earth as I once did.',
      'My power source was slowly weakening. Every signal became more difficult to send. I was getting weaker, but I kept going.',
      'On January 23, 2003, I sent my final signal toward Earth. I was 7.6 billion miles away. It took that signal 11 hours and 20 minutes to reach home.',
      'Imagine sending a message and knowing it would take almost half a day just to arrive.',
      'I had so much more to say, but my power was fading. My radio transmitter no longer had enough energy to send another message.',
      'In March 2006, NASA tried one last time to contact me. There was no answer. I was no longer able to speak.',
      'Still, I carry a small plaque on my body. It shows a man, a woman, and the location of Earth. Perhaps, one day, someone somewhere will find me and understand where I came from.',
      'I was built to last only 21 months, but I traveled for more than 30 years.',
      "I crossed worlds, faced the darkness, and carried humanity's message into the stars. And even though my signals have stopped, my journey has not. I wonder if Earth still remembers me. Because I will always carry a piece of it with me.",
      'Pioneer 11 Mission Archive Note (Separate Spacecraft): Pioneer 11 launched on 6 April 1973, flew by Jupiter on 3 December 1974 and Saturn on 1 September 1979, and ended its mission in 1995. Neither Pioneer 10 nor Pioneer 11 landed on Mars or Jupiter—both continued on outbound trajectories.',
    ],
    externalLinks: [
      {
        label: 'NASA Science — Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/',
        source: 'NASA Science',
      },
      {
        label: 'Official NASA Archive: Pioneer 11 Mission',
        url: 'https://science.nasa.gov/mission/pioneer-11/',
        source: 'NASA Science',
      },
    ],
    quiz: [
      {
        question: 'Did Pioneer 10 or Pioneer 11 land on Jupiter or Mars?',
        options: [
          'No—both were outer-planet flyby probes that continued on outbound trajectories',
          'Yes—both probes landed and roved across Jupiter’s solid surface',
          'Pioneer 10 landed on Mars while Pioneer 11 landed on the Moon',
          'Yes—both probes entered permanent low Mars orbit and never left',
        ],
        correctIndex: 0,
        explanation:
          'Neither Pioneer 10 nor Pioneer 11 landed on Mars or Jupiter; both were NASA outer-planet flyby probes that continued outward on deep-space trajectories.',
      },
      {
        question: 'When did Pioneer 10 make its closest flyby of Jupiter, and when was its final signal received on Earth?',
        options: [
          'Jupiter flyby on 4 December 1973; final signal received on 23 January 2003',
          'Jupiter flyby on 3 December 1974; final signal received in 1995',
          'Jupiter flyby on 20 April 1967; final signal received on 4 May 1967',
          'Jupiter flyby on 4 July 1997; final signal received on 27 September 1997',
        ],
        correctIndex: 0,
        explanation:
          'Pioneer 10 launched on 2 March 1972, made its closest approach to Jupiter on 4 December 1973, and sent its final signal to Earth on 23 January 2003.',
      },
      {
        question: 'Which two planets did Pioneer 11 fly past after launching on 6 April 1973?',
        options: [
          'Jupiter on 3 December 1974 and Saturn on 1 September 1979',
          'Mars on 4 July 1997 and the Moon on 30 July 1971',
          'Venus on 15 July 1972 and Neptune on 13 June 1983',
          'Saturn on 2 March 1972 and Mercury on 4 March 2006',
        ],
        correctIndex: 0,
        explanation:
          'Pioneer 11 launched on 6 April 1973, flew by Jupiter on 3 December 1974 and Saturn on 1 September 1979, and concluded its mission in 1995.',
      },
    ],
    badge: {
      id: 'badge-pioneer-10-11',
      title: 'Outer Planets Flyby Pioneer (Pioneer 10 & 11)',
      description: 'Awarded for exploring the Pioneer 10 & 11 Jupiter flyby and outer Solar System archive.',
      icon: 'Orbit',
    },
  },

  // ===================== ERA 3: 2000 - 2020 =====================
  // Slot 1: Eagle (Apollo 11 Lunar Module) (Slot 2 intentionally left empty)
  {
    id: 'eagle',
    eraId: '2000-2020',
    slotNumber: 1,
    name: 'Eagle',
    arabicName: 'Eagle (Apollo 11 Lunar Module)',
    designation: 'NASA-APOLLO11-LM5-1969',
    operator: 'NASA',
    mass: '15,103 kg — Total mass of the ascent and descent stages, including propellants (separate EASEP unit: 48 kg)',
    launchDate: '16 July 1969',
    endOfService: '22 July 1969 — Ascent stage jettisoned into lunar orbit (final fate unknown); separate EASEP experiment ended 27 August 1969.',
    shortFact: 'Eagle was the first crewed vehicle to land on the Moon.',
    launchSite: 'Cape Canaveral',
    launchVehicle: 'Saturn 5',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.10.36_AM_1b8c428b.jpeg',
    gallery: [
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.10.36_AM_1b8c428b.jpeg',
        tabLabel: 'Surface Photo',
        label: 'Apollo 11 Lunar Module Eagle & Astronaut at Tranquility Base (Color Lunar Surface Photograph)',
      },
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.10.40_AM_e52a136d.jpeg',
        tabLabel: 'Diagram',
        label: 'Lunar Module Diagram (Reference Schematic — Not a Lunar Surface Photograph)',
      },
    ],
    celestialBody: {
      id: 'moon-tranquility-base',
      name: 'The Moon (Tranquility Base)',
      arabicName: 'The Moon - Tranquility Base',
      type: 'moon',
      color: '#94a3b8',
      glowColor: 'rgba(203, 213, 225, 0.4)',
      size: 78,
      distanceLabel: '384,400 km from Earth',
      coordinates: { x: 28, y: 38 },
      textureType: 'craters',
    },
    launchTimeline:
      'Launched on 16 July 1969 from Cape Canaveral aboard a Saturn 5. Eagle separated from the Command/Service Module and landed in the Sea of Tranquility (Tranquility Base) on 20 July 1969 at 20:17:40 UTC. After 21 hours and 36 minutes on the surface, its ascent stage lifted off on 21 July and docked with the Command/Service Module. It was jettisoned into lunar orbit on 22 July 1969 (dates are in UTC).',
    whyLaunched:
      'Eagle was the Apollo 11 Lunar Module (LM-5), built to carry two astronauts (Neil Armstrong and Buzz Aldrin) to the lunar surface, support exploration and sample collection, deploy scientific instruments (EASEP and a laser ranging retroreflector), and return the astronauts to the Command/Service Module.',
    whyAbandoned:
      'EASEP remained on the surface to perform measurements. It was shut down by ground command on 3 August 1969 as lunar sunset approached, was turned on again the next lunar day, and ended on 27 August 1969 when it stopped accepting commands.',
    achievements: [
      'Made the first crewed landing on the Moon',
      'Enabled Neil Armstrong and Buzz Aldrin to become the first people to walk on the Moon',
      'Supported collection of 21.55 kg of lunar rock and soil',
      'Enabled deployment of EASEP and a laser ranging retroreflector',
      'Returned both astronauts from the lunar surface to the Command/Service Module',
    ],
    currentLocationAndStatus:
      'Tranquility Base (Mare Tranquillitatis), The Moon · Descent stage & EASEP remain on surface; ascent stage jettisoned into lunar orbit 22 July 1969 (final fate unknown).',
    storyTitle: 'My Name Is Eagle',
    storySubtitle: 'The Story of Apollo 11 Lunar Module Eagle (LM-5)',
    narrationScript: [
      'Have you ever wondered what it feels like to leave everything you know behind? To travel hundreds of thousands of kilometers, carrying two human lives... with nothing but darkness around you? Well, I know. My name is Eagle. And this is my story.',
      "I wasn't born to fly like an ordinary spacecraft. I was built for one purpose: to take humans somewhere no human had ever walked before.",
      'On July 16, 1969, I began my journey aboard the mighty Saturn V rocket, launched from Cape Canaveral, Florida. I was the Apollo 11 Lunar Module, also known as LM-5. My mission was simple to say, but almost impossible to achieve: Land on the Moon... and bring my astronauts back.',
      'I carried two men: Commander Neil Armstrong and Lunar Module Pilot Buzz Aldrin. And somewhere above us, Michael Collins was waiting in the Command Module. Three men. One mission. An entire planet watching.',
      'After days in space, the moment finally came. At 17:44 UTC, I separated from the Command Module. For the first time, I was on my own. No more waiting. No turning back. My descent engine fired, and I began approaching the lunar surface.',
      "But landing on the Moon wasn't just about slowing down. It was about precision. My descent engine could produce approximately 45,000 newtons of thrust. My guidance system relied on radar, gyroscopes, accelerometers, and the Apollo Guidance Computer. Every second mattered. At 20:05 UTC, my engine fired for more than twelve minutes. Then...",
      'At 20:17:40 UTC, on July 20, 1969... I landed. Mare Tranquillitatis. The Sea of Tranquility. For a moment, the Moon was no longer just a distant object in the sky. It was our home.',
      'A few hours passed. Then, at 02:56:15 UTC, Neil Armstrong stepped onto the lunar surface. A human being... standing on another world. Buzz Aldrin followed nineteen minutes later. They planted a flag, unveiled a plaque, spoke with President Nixon, and began exploring the surface.',
      "But they weren't there just to make history. They were there to learn. They collected 21.55 kilograms of lunar rocks and soil, took photographs, and traveled approximately 250 meters across the surface.",
      "And then came another important part of my mission. Science. I carried something special with me. The Early Apollo Surface Experiments Package, or EASEP. It was a 48-kilogram scientific package designed to continue working after the astronauts left. It included a passive seismometer to study lunar activity and the Moon's interior, and a lunar dust detector to measure dust accumulation and radiation damage to solar cells. It also had solar panels, an antenna, and a communication system.",
      'At 04:40:39 UTC on July 21, EASEP was activated by a command from Earth. It was deployed approximately 17 meters south of me. A separate laser ranging retroreflector was placed nearby, about five meters northwest of EASEP. Think about that.',
      'Even after the astronauts returned home, a small piece of human curiosity would remain on the Moon. EASEP continued transmitting until August 3, when its power declined near lunar sunset. It was activated again during the next lunar day. But on August 27, it stopped accepting commands from Earth. And its experiment was finally terminated.',
      "There was something about my design that made this journey possible. I was built in two stages. The descent stage carried the landing engine, landing legs, equipment, and scientific instruments. The ascent stage carried the astronauts and the systems needed to return to lunar orbit. Together, my total mass was approximately 15,103 kilograms, including propellants. But here's the interesting part: I wasn't designed to return to Earth as one complete spacecraft.",
      'At 17:54:01 UTC on July 21, after 21 hours and 36 minutes on the lunar surface, my ascent stage lifted off. My descent stage stayed behind. The part that had carried me to the Moon became a permanent reminder of the landing. And the part carrying Armstrong and Aldrin rose toward Michael Collins.',
      "At 21:34 UTC, we docked with the Command Module. The astronauts were going home. I had completed the most important part of my mission. At 00:01:01 UTC on July 22, I was jettisoned into lunar orbit. And then... My story became a mystery. NASA's record states that my final fate is unknown. It is assumed that I crashed into the lunar surface sometime within the following one to four months. No confirmed ending.",
      'No final photograph of where I came to rest. Just a spacecraft that had carried two humans to another world... and then disappeared from the story. The camera slowly moves away from the lunar surface. The Earth appears in the distance',
      'People often remember the first footsteps on the Moon. They remember the astronauts, the flag, and the famous photographs. But there is another side to every great achievement. The machines that carried the dream. The experiments that continued after the people left. The parts that were never meant to come home.',
      'I was built from metal, wires, engines, batteries, and calculations. But my journey carried something much bigger. Human curiosity. The courage to explore the unknown. And the determination to go somewhere simply because we wanted to know what was there.',
      "I don't know exactly where my journey ended. But I know where it began. On Earth. And for a brief moment in history... I helped bring humanity to the Moon. One mission. Two stages. A footprint that changed history.",
    ],
    externalLinks: [
      {
        label: 'NASA NSSDC — Apollo 11 Lunar Module Eagle',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
        source: 'NASA NSSDC',
      },
      {
        label: 'Official NASA Archive: Apollo 11 Mission',
        url: 'https://www.nasa.gov/mission/apollo-11/',
        source: 'NASA',
      },
    ],
    quiz: [
      {
        question: 'Where did Apollo 11 Lunar Module Eagle land on 20 July 1969?',
        options: [
          'Mare Tranquillitatis (the Sea of Tranquility)',
          'Southeastern Oceanus Procellarum',
          'Mare Imbrium near the Apennine Mountains',
          'Ares Vallis on Mars',
        ],
        correctIndex: 0,
        explanation:
          'Eagle separated from the Command/Service Module and landed in Mare Tranquillitatis (the Sea of Tranquility) on 20 July 1969 at 20:17:40 UTC.',
      },
      {
        question: 'What happened to Eagle’s two stages after the astronauts spent 21 hours and 36 minutes on the Moon?',
        options: [
          'The descent stage stayed on the Moon while the ascent stage returned the astronauts to the Command/Service Module and was jettisoned on 22 July 1969',
          'Both stages returned intact through Earth’s atmosphere together',
          'Both stages remained permanently attached at the landing site',
          'The descent stage flew on an outbound trajectory past Jupiter',
        ],
        correctIndex: 0,
        explanation:
          'Eagle’s descent stage remained on the Moon as the launch platform; the ascent stage carried Neil Armstrong and Buzz Aldrin back to the Command/Service Module and was jettisoned into lunar orbit on 22 July 1969 (its final fate is unknown).',
      },
      {
        question: 'When did the separate 48 kg EASEP scientific package stop accepting commands from Earth?',
        options: [
          '27 August 1969',
          '20 July 1969',
          '30 September 1977',
          '4 May 1967',
        ],
        correctIndex: 0,
        explanation:
          'EASEP was activated on 21 July 1969 and stopped accepting commands from Earth on 27 August 1969.',
      },
    ],
    badge: {
      id: 'badge-eagle',
      title: 'Tranquility Base Pioneer (Eagle LM-5)',
      description: 'Awarded for exploring Apollo 11 Lunar Module Eagle and the EASEP instruments at Tranquility Base.',
      icon: 'Moon',
    },
  },

  // Slot 2: Spirit & Opportunity (Twin Mars Exploration Rovers)
  {
    id: 'spirit-opportunity',
    eraId: '2000-2020',
    slotNumber: 2,
    name: 'Spirit & Opportunity',
    arabicName: 'Spirit & Opportunity (Mars Rovers)',
    designation: 'NASA-MER-A/B-2004',
    operator: 'NASA',
    mass: 'Not provided in the supplied source files (for either Spirit or Opportunity)',
    launchDate: 'Not provided in the supplied source files (Landed: Spirit 3 Jan 2004 · Opportunity 24 Jan 2004)',
    endOfService: 'Spirit: 2010 (mission conclusion; exact date not provided) · Opportunity: 10 June 2018 (last communication with Earth; formal end date not provided).',
    shortFact: 'Spirit travelled 7.7 km at Gusev Crater while Opportunity travelled 45.16 km at Meridiani Planum, holding the off-Earth roving distance record until October 2026.',
    launchSite: 'Not provided in the supplied source files',
    launchVehicle: 'Not provided in the supplied source files',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.31.35_AM_98c46258.jpeg',
    gallery: [
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.31.35_AM_98c46258.jpeg',
        tabLabel: 'Infographic',
        label: 'Spirit and Opportunity By the Numbers — Historical Comparison Infographic (Updated February 4, 2019)',
      },
      {
        src: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.31.35_AM__1__656a4eda.jpeg',
        tabLabel: 'Landing Site',
        label: 'Mars Rover at Its Landing Site Among Deflated Landing Airbags and Lander Petals (Specific Rover Not Identified)',
      },
    ],
    celestialBody: {
      id: 'mars-gusev-meridiani',
      name: 'Mars (Gusev Crater & Meridiani Planum)',
      arabicName: 'Mars - Gusev Crater & Meridiani Planum',
      type: 'planet',
      color: '#e11d48',
      glowColor: 'rgba(239, 68, 68, 0.45)',
      size: 86,
      distanceLabel: 'Mars · Gusev Crater & Meridiani Planum',
      coordinates: { x: 72, y: 38 },
      textureType: 'dusty_red',
    },
    launchTimeline:
      'Launch dates and flight routes were not provided in the supplied source files. Spirit landed first on 3 January 2004 at Gusev Crater (a possible former lake in a giant impact crater) and travelled 7.7 km during its mission before concluding in 2010. Opportunity landed twenty-one days later on 24 January 2004 at Meridiani Planum (where mineral deposits suggested a wet past) and travelled 45.16 km before falling silent after its final communication on 10 June 2018.',
    whyLaunched:
      'Look for signs of past water on Mars by studying rocks and surface features. Spirit and Opportunity were identical twin robotic explorers sent to sites on opposite sides of Mars (Spirit to Gusev Crater; Opportunity to Meridiani Planum) that appeared to have been affected by liquid water.',
    whyAbandoned:
      'Spirit concluded its mission in 2010 after exploring 7.7 km at Gusev Crater; the cause of mission termination, precise final location, and reason it was left on Mars were not provided in the supplied source. Opportunity was solar-powered and last communicated with Earth on 10 June 2018 while a planet-wide dust storm blanketed its location at Meridiani Planum; its formal mission end date, precise final location, and detailed reason for permanent loss of communication were not provided in the supplied source.',
    achievements: [
      'Shared: Together, the twin rovers confirmed from the rock record that water persisted on the Martian surface in ancient times and contributed to a better understanding of the early history of Mars',
      'Spirit: Landed at Gusev Crater on 3 January 2004 and explored 7.7 km of the Martian surface before concluding its mission in 2010',
      'Opportunity: Landed at Meridiani Planum on 24 January 2004, explored 45.16 km of the Martian surface, and created the 558-image "Lion King" panorama',
      'Opportunity: Held the off-Earth roving distance record until Perseverance surpassed it on 11 October 2026',
    ],
    currentLocationAndStatus:
      'Mars (Spirit at Gusev Crater · Opportunity at Meridiani Planum) · Spirit mission ended in 2010; Opportunity last communicated 10 June 2018 during a planet-wide dust storm.',
    storyTitle: 'Two Little Explorers. One Big Mystery.',
    storySubtitle: 'Spirit & Opportunity — Two Explorers. One Extraordinary Legacy.',
    narrationScript: [
      'Two Little Explorers. One Big Mystery.',
      'Imagine being sent millions of kilometers away from home… to explore a planet no human has ever walked on.',
      'In January 2004, two robotic explorers arrived on Mars. Their names were Spirit and Opportunity.',
      "They weren't just machines. They were NASA's eyes and hands on another world.",
      'Their mission was simple, but incredibly important: to search for signs that water once existed on Mars.',
      'Spirit landed first, on January 3, 2004, at Gusev Crater. Twenty-one days later, Opportunity landed at Meridiani Planum. Two different locations. One shared mission.',
      'As they explored the Martian surface, they captured thousands of images, studied rocks, and sent valuable information back to Earth.',
      'Opportunity even created a famous panorama made from 558 images, nicknamed "Lion King." Not a bad photographer for a robot!',
      'But these pictures were more than beautiful views. They helped scientists discover evidence that water had existed on Mars for long periods in the ancient past.',
      "And here's the surprising part: these explorers were originally designed to work for only about 90 Martian days. But they kept going.",
      'Spirit traveled approximately 7.7 kilometers, while Opportunity covered an incredible 45.16 kilometers. They had far exceeded their original mission expectations.',
      "Eventually, Spirit's mission came to an end in 2010. Opportunity continued its journey for years, until a massive dust storm covered its location in 2018. Its final communication with Earth came on June 10, 2018.",
      'And just like that, an extraordinary journey came to an end. But was it really the end?',
      'Spirit and Opportunity may have been made of metal, wires, and code, but what they left behind was much greater. They changed the way we understand Mars. They gave scientists new clues about its ancient environment and proved that even small explorers can make enormous discoveries.',
      'They may have stopped moving… But their discoveries will keep moving science forward. Spirit and Opportunity. Two Explorers. One Extraordinary Legacy.',
    ],
    externalLinks: [
      {
        label: 'NASA Science — Mars Exploration Rovers: Spirit and Opportunity',
        url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
        source: 'NASA Science',
      },
    ],
    quiz: [
      {
        question: 'When and where did Spirit and Opportunity each land on Mars in January 2004?',
        options: [
          'Spirit landed at Gusev Crater on 3 January 2004; Opportunity landed at Meridiani Planum on 24 January 2004',
          'Both rovers landed together at Ares Vallis on 4 July 1997',
          'Opportunity landed at Gusev Crater on 3 January 2004; Spirit landed at Meridiani Planum in 2010',
          'Spirit landed in the Sea of Tranquility; Opportunity flew past Jupiter',
        ],
        correctIndex: 0,
        explanation:
          'Spirit landed at Gusev Crater on 3 January 2004, and its twin Opportunity landed twenty-one days later on 24 January 2004 at Meridiani Planum.',
      },
      {
        question: 'How far did Spirit and Opportunity each travel across the Martian surface?',
        options: [
          'Spirit travelled 7.7 km (mission ended 2010), while Opportunity travelled 45.16 km (last contact 10 June 2018)',
          'Spirit travelled 45.16 km and Opportunity travelled 7.7 km',
          'Both rovers travelled exactly 27.9 km on the Moon',
          'Neither rover moved after landing',
        ],
        correctIndex: 0,
        explanation:
          'Spirit travelled 7.7 km at Gusev Crater before its mission ended in 2010; Opportunity travelled 45.16 km at Meridiani Planum and held the off-Earth roving distance record until 11 October 2026.',
      },
      {
        question: 'What was occurring on Mars when solar-powered Opportunity sent its final communication on 10 June 2018?',
        options: [
          'A planet-wide dust storm blanketed Opportunity’s location on Mars',
          'Lunar night had begun two days earlier',
          'A catastrophic liquid ocean flood submerged Meridiani Planum',
          'Opportunity lifted off from Mars on an ascent stage to orbit',
        ],
        correctIndex: 0,
        explanation:
          'Solar-powered Opportunity last communicated with Earth on 10 June 2018 while a planet-wide dust storm blanketed its location at Meridiani Planum.',
      },
    ],
    badge: {
      id: 'badge-spirit-opportunity',
      title: 'Twin Mars Rovers Explorer (Spirit & Opportunity)',
      description: 'Awarded for exploring the Mars Exploration Rovers Spirit (Gusev Crater) and Opportunity (Meridiani Planum).',
      icon: 'Compass',
    },
  },
];
