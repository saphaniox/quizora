import { draft, fromMap, generate, numericOptions, type SectionDefinition } from "./helpers.js";

type Facts = [string, string][];
const quiz = (facts: Facts) => fromMap(facts, (k) => k, (_k, v) => `The correct answer is: ${v}.`);

/* ------------------------------------------------------------------ IoT */

const iotFacts: Facts = [
  ["What does IoT stand for?", "Internet of Things"],
  ["Which lightweight publish/subscribe protocol is common in IoT?", "MQTT"],
  ["What is the role of an MQTT broker?", "It routes messages between publishers and subscribers"],
  ["Which protocol is a RESTful alternative designed for constrained devices?", "CoAP"],
  ["Which short-range radio is used by smart wearables?", "Bluetooth Low Energy"],
  ["Which long-range low-power radio technology uses chirp spread spectrum?", "LoRa"],
  ["What is a gateway in an IoT architecture?", "A device that bridges sensors to the internet"],
  ["What is edge computing?", "Processing data close to where it is generated"],
  ["What is a digital twin?", "A virtual model of a physical asset"],
  ["Which sensor measures acceleration and tilt?", "An accelerometer"],
  ["Which sensor measures rotational rate?", "A gyroscope"],
  ["Which sensor is typically used for room occupancy detection?", "A PIR motion sensor"],
  ["What does an ADC do on a microcontroller?", "Converts analogue voltage into a digital value"],
  ["What does PWM control on an actuator?", "The average power by varying duty cycle"],
  ["Which two-wire bus uses SDA and SCL lines?", "IÂ²C"],
  ["Which bus uses MOSI, MISO, SCLK and CS?", "SPI"],
  ["Which serial interface uses TX and RX with no clock line?", "UART"],
  ["What is firmware?", "Software stored permanently on a device"],
  ["What is OTA in IoT device management?", "Over-the-air firmware updating"],
  ["Why is device provisioning important?", "It gives each device a trusted unique identity"],
  ["What is a common IoT security weakness?", "Default or hard-coded credentials"],
  ["Which addressing scheme gives every device a unique global address?", "IPv6"],
  ["What is 6LoWPAN?", "IPv6 over low-power wireless personal area networks"],
  ["What is Zigbee?", "A low-power mesh networking standard"],
  ["What is a mesh network?", "A network where nodes relay data for each other"],
  ["What is telemetry?", "Automatic measurement and transmission of data"],
  ["What is a time-series database used for in IoT?", "Storing timestamped sensor readings efficiently"],
  ["Why do IoT devices use sleep modes?", "To extend battery life"],
  ["What is a watchdog timer?", "A timer that resets a hung device"],
  ["What is MQTT QoS 1?", "At-least-once message delivery"],
  ["What is a payload in messaging?", "The actual data carried in a message"],
  ["Which format is commonly used for IoT payloads?", "JSON"],
  ["What is a real-time operating system used for?", "Meeting strict timing deadlines on embedded devices"],
  ["What is an actuator?", "A device that converts a signal into physical action"],
  ["What is a smart meter?", "A meter that reports utility consumption remotely"],
  ["What is device shadow or twin state?", "A cloud copy of a device's last known state"],
  ["Why use TLS on IoT connections?", "To encrypt and authenticate device traffic"],
  ["What is a cellular option for wide-area IoT?", "NB-IoT or LTE-M"],
  ["What is sensor drift?", "A gradual change in sensor accuracy over time"],
  ["What is calibration?", "Adjusting a sensor's output against a known reference"],
];

const iotBank = () => [
  ...quiz(iotFacts),
  ...generate(
    12,
    (index) => {
      const bits = [8, 10, 12, 16][index % 4] as number;
      const levels = Math.pow(2, bits);
      const kind = index % 2;
      if (kind === 0) {
        return draft(
          `How many discrete levels can a ${bits}-bit ADC represent?`,
          String(levels),
          numericOptions(levels, Math.max(4, Math.round(levels / 4))),
          `2^${bits} = ${levels} levels.`,
        );
      }
      const resolution = Number(((3.3 / levels) * 1000).toFixed(3));
      return draft(
        `A ${bits}-bit ADC with a 3.3 V reference has what voltage resolution?`,
        `${resolution} mV`,
        numericOptions(resolution, 2, 3).map((v) => `${v} mV`),
        `3.3 V / ${levels} = ${resolution} mV per step.`,
      );
    },
    "professional-iot",
  ),
];

/* ----------------------------------------------------- Automation / PLC */

const automationFacts: Facts = [
  ["What does PLC stand for?", "Programmable Logic Controller"],
  ["What does SCADA stand for?", "Supervisory Control and Data Acquisition"],
  ["What is an HMI?", "A human machine interface panel for operators"],
  ["Which PLC language uses contacts and coils?", "Ladder logic"],
  ["Which IEC 61131-3 language is graphical and block based?", "Function Block Diagram"],
  ["What is a PLC scan cycle?", "Read inputs, execute logic, update outputs"],
  ["What is a normally open contact?", "A contact that closes when energised"],
  ["What is an interlock?", "Logic that prevents unsafe machine operation"],
  ["What is a latching circuit?", "A circuit that holds its state after the input is removed"],
  ["What is the standard analogue current loop range?", "4 to 20 mA"],
  ["Why is 4-20 mA preferred over 0-20 mA?", "A broken wire is detectable as 0 mA"],
  ["What does PID stand for?", "Proportional, Integral, Derivative"],
  ["What does increasing proportional gain do?", "Speeds response but can cause oscillation"],
  ["What does the integral term remove?", "Steady-state error"],
  ["What does the derivative term react to?", "The rate of change of the error"],
  ["What is a setpoint?", "The target value the controller aims for"],
  ["What is a process variable?", "The measured value being controlled"],
  ["What is open-loop control?", "Control without feedback from the output"],
  ["What is a VFD used for?", "Varying the speed of an AC motor"],
  ["What is a servo drive used for?", "Precise position and speed control"],
  ["What is a stepper motor good at?", "Moving in precise discrete steps"],
  ["What is a limit switch?", "A switch that detects mechanical end of travel"],
  ["What is a proximity sensor?", "A sensor that detects objects without contact"],
  ["What is a thermocouple used for?", "Measuring temperature from a voltage difference"],
  ["What is an RTD?", "A resistance temperature detector such as Pt100"],
  ["What is an encoder used for?", "Measuring shaft position or speed"],
  ["What is Modbus?", "A serial and TCP industrial communication protocol"],
  ["What is PROFIBUS?", "A fieldbus standard for industrial automation"],
  ["What is an industrial Ethernet protocol example?", "EtherNet/IP or PROFINET"],
  ["What is a safety relay used for?", "Monitoring safety devices and stopping machinery"],
  ["What must an emergency stop circuit be?", "Hard-wired and manually reset"],
  ["What is lockout/tagout?", "Isolating energy sources before maintenance"],
  ["What is a SIL rating?", "A safety integrity level for a protective function"],
  ["What is redundancy in control systems?", "Duplicate equipment ready to take over"],
  ["What is a solenoid valve?", "An electrically operated valve"],
  ["What powers a pneumatic actuator?", "Compressed air"],
  ["What is hydraulic actuation good for?", "Producing very high force"],
  ["What is a cascade control loop?", "An outer loop setting the setpoint of an inner loop"],
  ["What is dead time in a process?", "Delay before the output responds to an input change"],
  ["What is hysteresis in a controller?", "A deadband that stops rapid on/off switching"],
];

const automationBank = () => [
  ...quiz(automationFacts),
  ...generate(
    12,
    (index) => {
      const kind = index % 2;
      const span = 100 * (1 + (index % 5));
      if (kind === 0) {
        const mA = 4 + 4 * (1 + (index % 4));
        const value = Number((((mA - 4) / 16) * span).toFixed(1));
        return draft(
          `A 4-20 mA transmitter is scaled 0 to ${span} Â°C. What temperature does ${mA} mA represent?`,
          `${value} Â°C`,
          numericOptions(value, Math.max(5, Math.round(span / 8)), 1).map((v) => `${v} Â°C`),
          `(${mA} âˆ’ 4)/16 Ã— ${span} = ${value} Â°C.`,
        );
      }
      const value = Math.round(span / 4) * (1 + (index % 2));
      const mA = Number((4 + (value / span) * 16).toFixed(2));
      return draft(
        `A 4-20 mA transmitter is scaled 0 to ${span} bar. What current represents ${value} bar?`,
        `${mA} mA`,
        numericOptions(mA, 3, 2).map((v) => `${v} mA`),
        `4 + (${value}/${span}) Ã— 16 = ${mA} mA.`,
      );
    },
    "professional-automation",
  ),
];

/* ------------------------------------------------------- Cybersecurity */

const cyberFacts: Facts = [
  ["What are the three pillars of the CIA triad?", "Confidentiality, integrity and availability"],
  ["What is phishing?", "Fraudulent messages that trick users into revealing data"],
  ["What is spear phishing?", "A targeted phishing attack aimed at a specific person"],
  ["What is ransomware?", "Malware that encrypts data and demands payment"],
  ["What is a zero-day vulnerability?", "A flaw exploited before a patch exists"],
  ["What is multi-factor authentication?", "Verifying identity with two or more different factors"],
  ["What is the principle of least privilege?", "Granting only the access needed to do the job"],
  ["What is defence in depth?", "Layering multiple independent security controls"],
  ["What is a default-deny firewall stance?", "Block everything unless explicitly allowed"],
  ["What is an IDS?", "An intrusion detection system that alerts on suspicious traffic"],
  ["What is an IPS?", "An intrusion prevention system that blocks malicious traffic"],
  ["What is a SIEM?", "A platform aggregating and correlating security logs"],
  ["What is SQL injection?", "Inserting malicious SQL through untrusted input"],
  ["How is SQL injection best prevented?", "Parameterised queries and input validation"],
  ["What is cross-site scripting?", "Injecting scripts that run in another user's browser"],
  ["What is CSRF?", "Forcing a logged-in user's browser to submit unwanted requests"],
  ["What is a brute force attack?", "Trying many passwords until one works"],
  ["What is password salting?", "Adding random data before hashing a password"],
  ["Which hashing family is recommended for passwords?", "bcrypt, scrypt or Argon2"],
  ["What is symmetric encryption?", "Encryption using the same key to encrypt and decrypt"],
  ["What is asymmetric encryption?", "Encryption using a public and private key pair"],
  ["What is AES?", "A widely used symmetric block cipher"],
  ["What is RSA used for?", "Asymmetric encryption and digital signatures"],
  ["What does TLS provide?", "Encryption, integrity and server authentication in transit"],
  ["What is a digital certificate?", "A signed statement binding a public key to an identity"],
  ["What is a certificate authority?", "A trusted body that issues digital certificates"],
  ["What is a VPN?", "An encrypted tunnel over an untrusted network"],
  ["What is network segmentation?", "Splitting a network to limit attack spread"],
  ["What is a DMZ?", "A buffer network exposing services without exposing the LAN"],
  ["What is a DDoS attack?", "Flooding a service from many sources to deny availability"],
  ["What is social engineering?", "Manipulating people into breaking security procedures"],
  ["What is penetration testing?", "Authorised simulated attacks to find weaknesses"],
  ["What is vulnerability scanning?", "Automated checking of systems for known flaws"],
  ["What is patch management?", "The process of testing and applying security updates"],
  ["What is an incident response plan?", "A documented process for handling security breaches"],
  ["What is the first phase of incident response?", "Preparation"],
  ["What is data at rest encryption?", "Encrypting stored data on disk"],
  ["What is zero trust?", "Never trust, always verify every request"],
  ["What is a honeypot?", "A decoy system used to detect and study attackers"],
  ["What does GDPR primarily protect?", "Personal data and privacy rights"],
  ["What is a security baseline?", "A minimum agreed hardening configuration"],
  ["What is MFA fatigue?", "Spamming push prompts until a user approves one"],
  ["What is privilege escalation?", "Gaining higher rights than originally granted"],
  ["What is a supply chain attack?", "Compromising a vendor to reach their customers"],
  ["Why does log retention matter?", "It enables investigation of incidents after the fact"],
  ["What is a threat model?", "A structured view of assets, threats and mitigations"],
  ["What is tokenisation?", "Replacing sensitive values with non-sensitive substitutes"],
  ["What is an air-gapped system?", "A system physically isolated from other networks"],
  ["What is business continuity planning?", "Ensuring critical operations survive disruption"],
  ["What is RPO in disaster recovery?", "The maximum acceptable amount of data loss"],
];

const cyberBank = () => quiz(cyberFacts);

/* ------------------------------------------------- Mechanical engineering */

const mechanicalFacts: Facts = [
  ["What is torque?", "A turning force about an axis"],
  ["What is a bearing used for?", "Reducing friction between moving parts"],
  ["What is a gear ratio?", "The ratio of driven to driving gear teeth"],
  ["What does a high reduction gearbox give?", "More torque at lower speed"],
  ["What is a coupling?", "A component connecting two rotating shafts"],
  ["What is a keyway used for?", "Locking a hub to a shaft to transmit torque"],
  ["What is a fillet on a part?", "A rounded internal corner that reduces stress"],
  ["What is fatigue failure?", "Failure from repeated cyclic loading below yield stress"],
  ["What is the yield strength of a material?", "The stress at which permanent deformation begins"],
  ["What is ductility?", "The ability to deform plastically before fracture"],
  ["What is hardness?", "Resistance to surface indentation or scratching"],
  ["What is annealing?", "Heating and slow cooling to soften metal"],
  ["What is quenching?", "Rapid cooling to harden steel"],
  ["What is tempering used for?", "Reducing brittleness after hardening"],
  ["What is welding?", "Joining metals by fusing them together"],
  ["What is brazing?", "Joining metals with a filler that melts below the base metal"],
  ["What is a tolerance on a drawing?", "The allowable variation in a dimension"],
  ["What is an interference fit?", "A fit where the shaft is larger than the hole"],
  ["What unit is surface roughness measured in?", "Micrometres, often as Ra"],
  ["What is CNC machining?", "Computer numerically controlled cutting of parts"],
  ["What is CAD?", "Computer aided design software"],
  ["What is FEA used for?", "Simulating stress and deformation numerically"],
  ["What is a pump used for?", "Moving liquid by adding energy"],
  ["What is cavitation in a pump?", "Vapour bubbles forming and collapsing, damaging the impeller"],
  ["What is NPSH?", "Net positive suction head available to a pump"],
  ["What is a heat exchanger?", "A device transferring heat between two fluids"],
  ["What are the main refrigeration cycle components?", "Compressor, condenser, expansion valve and evaporator"],
  ["What is viscosity?", "A fluid's resistance to flow"],
  ["What are the strokes of a four-stroke engine?", "Intake, compression, power and exhaust"],
  ["What is a flywheel used for?", "Storing rotational energy and smoothing speed"],
  ["What is an advantage of a belt drive?", "Quiet operation and shock absorption"],
  ["What is preventive maintenance?", "Servicing on a schedule before failure occurs"],
  ["What is condition monitoring?", "Tracking vibration, heat or oil to predict failure"],
  ["What is vibration analysis useful for?", "Detecting imbalance, misalignment and bearing faults"],
  ["What is the main purpose of lubrication?", "Reducing friction and wear"],
  ["What is a tolerance stack-up?", "Accumulated variation across assembled parts"],
  ["What is a factor of safety?", "The ratio of design strength to expected load"],
  ["What is a pressure vessel?", "A container designed to hold fluid at pressure"],
  ["What is thermal expansion?", "Dimensional growth of a material when heated"],
  ["What is a P&ID?", "A piping and instrumentation diagram"],
];

const mechanicalBank = () => [
  ...quiz(mechanicalFacts),
  ...generate(
    14,
    (index, random) => {
      const kind = index % 3;
      const f = 10 * (1 + Math.floor(random() * 20));
      const r = Number((0.1 * (1 + (index % 9))).toFixed(1));
      if (kind === 0) {
        const t = Number((f * r).toFixed(1));
        return draft(
          `A force of ${f} N acts at ${r} m from a shaft centre. What torque is produced?`,
          `${t} NÂ·m`,
          numericOptions(t, Math.max(2, Math.round(t / 5)), 1).map((v) => `${v} NÂ·m`),
          `T = F Ã— r = ${f} Ã— ${r} = ${t} NÂ·m.`,
        );
      }
      if (kind === 1) {
        const driver = 10 * (1 + (index % 4));
        const driven = driver * (2 + (index % 3));
        const ratio = driven / driver;
        return draft(
          `A ${driver}-tooth gear drives a ${driven}-tooth gear. What is the gear ratio?`,
          `${ratio}:1`,
          numericOptions(ratio, 2).map((v) => `${v}:1`),
          `${driven} / ${driver} = ${ratio}:1 reduction.`,
        );
      }
      const area = 100 * (1 + (index % 5));
      const stress = Number((f / area).toFixed(3));
      return draft(
        `A tensile force of ${f} N acts on a cross-section of ${area} mmÂ². What is the stress?`,
        `${stress} MPa`,
        numericOptions(stress, 1, 3).map((v) => `${v} MPa`),
        `Ïƒ = F/A = ${f} N / ${area} mmÂ² = ${stress} MPa (1 N/mmÂ² = 1 MPa).`,
      );
    },
    "professional-mechanical",
  ),
];

/* ------------------------------------------------------ Civil engineering */

const civilFacts: Facts = [
  ["What is the binding ingredient in concrete?", "Cement"],
  ["What is a common nominal C20 concrete mix by volume?", "1:2:4 cement, sand and aggregate"],
  ["What does reinforcement steel resist in concrete?", "Tensile forces"],
  ["What is curing of concrete?", "Keeping it moist so it gains strength"],
  ["At what age is characteristic concrete strength normally tested?", "28 days"],
  ["What is a slump test used for?", "Measuring the workability of fresh concrete"],
  ["What is a foundation's purpose?", "Transferring building loads safely to the ground"],
  ["When is a raft foundation used?", "To spread load over weak soils"],
  ["What is a pile foundation?", "Deep columns transferring load to firm strata"],
  ["What is a beam?", "A horizontal member carrying loads in bending"],
  ["What is a column?", "A vertical member carrying axial compression"],
  ["What is a lintel?", "A beam over a door or window opening"],
  ["What is a shear wall?", "A wall resisting lateral forces such as wind"],
  ["What is a bending moment?", "The internal moment causing a member to bend"],
  ["What is a dead load?", "The permanent self weight of the structure"],
  ["What is a live load?", "Movable or temporary loading such as people"],
  ["What is a factor of safety in design?", "A margin between capacity and expected load"],
  ["What is a survey level used for?", "Measuring height differences on site"],
  ["What is a theodolite used for?", "Measuring horizontal and vertical angles"],
  ["What is a contour line on a map?", "A line joining points of equal elevation"],
  ["What is soil compaction?", "Increasing density by removing air voids"],
  ["What is soil bearing capacity?", "The pressure the ground can safely support"],
  ["What is a retaining wall?", "A wall holding back soil"],
  ["What is a culvert?", "A drainage channel passing under a road"],
  ["What is a bill of quantities?", "An itemised list of works and materials with quantities"],
  ["What is a snag list?", "A list of defects to be corrected before handover"],
  ["What is formwork?", "Temporary moulds that shape wet concrete"],
  ["What is a screed?", "A levelled layer applied over a floor slab"],
  ["What is a damp proof course?", "A barrier stopping rising moisture in walls"],
  ["What is a truss?", "A framework of triangles carrying loads efficiently"],
  ["What is a cantilever?", "A member supported at one end only"],
  ["What is an expansion joint for?", "Allowing thermal movement without cracking"],
  ["What is asphalt used for?", "Flexible road surfacing"],
  ["What is road camber?", "A cross slope shedding water off the carriageway"],
  ["What is a site safety induction?", "Briefing workers on hazards before starting"],
  ["What is a permit to work?", "Formal authorisation for high-risk tasks"],
  ["What is a project programme?", "A time schedule of construction activities"],
  ["What is a variation order?", "An approved change to the contracted works"],
  ["What is retention in a construction contract?", "A held-back percentage released after defects liability"],
  ["What is an as-built drawing?", "A drawing showing the works as actually constructed"],
];

const civilBank = () => [
  ...quiz(civilFacts),
  ...generate(
    14,
    (index) => {
      const kind = index % 2;
      const l = 2 + (index % 8);
      const w = 2 + ((index * 2) % 6);
      if (kind === 0) {
        const volume = Number((l * w * 0.15).toFixed(2));
        return draft(
          `A slab measures ${l} m by ${w} m and is 150 mm thick. What volume of concrete is required?`,
          `${volume} mÂ³`,
          numericOptions(volume, 2, 2).map((v) => `${v} mÂ³`),
          `${l} Ã— ${w} Ã— 0.15 = ${volume} mÂ³.`,
        );
      }
      const udl = 5 * (1 + (index % 5));
      const moment = Number(((udl * l * l) / 8).toFixed(2));
      return draft(
        `A simply supported beam of span ${l} m carries a UDL of ${udl} kN/m. What is the maximum bending moment?`,
        `${moment} kNÂ·m`,
        numericOptions(moment, Math.max(2, Math.round(moment / 5)), 2).map((v) => `${v} kNÂ·m`),
        `M = wLÂ²/8 = ${udl} Ã— ${l}Â² / 8 = ${moment} kNÂ·m.`,
      );
    },
    "professional-civil",
  ),
];

/* --------------------------------------------------------- Healthcare */

const healthcareFacts: Facts = [
  ["What is the normal adult resting heart rate range?", "60 to 100 beats per minute"],
  ["What is a normal adult body temperature?", "About 36.5 to 37.5 Â°C"],
  ["What is a normal adult respiratory rate?", "12 to 20 breaths per minute"],
  ["What blood pressure is considered normal for adults?", "About 120/80 mmHg"],
  ["What does hypertension mean?", "Persistently high blood pressure"],
  ["What does hypoglycaemia mean?", "Abnormally low blood glucose"],
  ["What is the first action in basic life support?", "Check for danger and responsiveness"],
  ["What is the recommended CPR compression rate?", "100 to 120 per minute"],
  ["What adult CPR compression depth is recommended?", "About 5 to 6 cm"],
  ["What is the recovery position for?", "Keeping an unconscious breathing patient's airway open"],
  ["What does ABC stand for in emergency care?", "Airway, breathing, circulation"],
  ["What is triage?", "Sorting patients by urgency of treatment"],
  ["What is the role of hand hygiene?", "Preventing transmission of infection"],
  ["When should hands be washed in clinical care?", "Before and after every patient contact"],
  ["What is PPE in healthcare?", "Personal protective equipment such as gloves and masks"],
  ["What is a sharps bin used for?", "Safe disposal of needles and blades"],
  ["What is a nosocomial infection?", "An infection acquired in a healthcare facility"],
  ["What is sterilisation?", "Destroying all microorganisms including spores"],
  ["What are antibiotics effective against?", "Bacterial infections"],
  ["Why is completing an antibiotic course important?", "To reduce antimicrobial resistance"],
  ["What is a vaccine?", "A preparation that stimulates protective immunity"],
  ["What is the cold chain?", "Keeping vaccines within a safe temperature range"],
  ["What is informed consent?", "Agreement to treatment after understanding risks"],
  ["What is patient confidentiality?", "Protecting patient information from unauthorised disclosure"],
  ["What are the five rights of medication?", "Right patient, drug, dose, route and time"],
  ["What is an adverse drug reaction?", "A harmful unintended response to a medicine"],
  ["What is the first-line treatment for anaphylaxis?", "Intramuscular adrenaline"],
  ["What does BMI measure?", "Weight relative to height"],
  ["What is dehydration?", "Loss of body fluid exceeding intake"],
  ["What is oral rehydration solution used for?", "Replacing fluid and salts lost in diarrhoea"],
  ["What is a communicable disease?", "A disease that spreads from person to person"],
  ["What causes malaria?", "A Plasmodium parasite spread by mosquitoes"],
  ["Which organ does tuberculosis mainly affect?", "The lungs"],
  ["What is a chronic disease?", "A long-lasting condition needing ongoing management"],
  ["What is preventive healthcare?", "Actions taken to avoid illness before it occurs"],
  ["What is a differential diagnosis?", "A list of possible causes of a patient's signs"],
  ["Why is nursing documentation important?", "Continuity of care and legal record"],
  ["How are pressure ulcers prevented?", "Regular repositioning and skin care"],
  ["What is palliative care?", "Care focused on comfort and quality of life"],
  ["What is a clinical audit?", "Reviewing care against standards to improve quality"],
  ["What is the incubation period of a disease?", "Time between infection and first symptoms"],
  ["What is herd immunity?", "Protection of a population when enough people are immune"],
  ["What is a notifiable disease?", "A disease that must be reported to health authorities"],
  ["What is a health information system used for?", "Collecting and using data for health decisions"],
  ["What is an epidemic?", "An unusual increase of a disease in an area"],
];

const healthcareBank = () => quiz(healthcareFacts);

/* -------------------------------------------------------- Agriculture */

const agricultureFacts: Facts = [
  ["What is crop rotation?", "Growing different crops in sequence on the same land"],
  ["Why is crop rotation useful?", "It breaks pest cycles and maintains soil fertility"],
  ["What is a legume's benefit to soil?", "It fixes nitrogen in the soil"],
  ["What is soil pH?", "A measure of soil acidity or alkalinity"],
  ["What corrects acidic soil?", "Applying agricultural lime"],
  ["What are the three main nutrients in NPK fertiliser?", "Nitrogen, phosphorus and potassium"],
  ["What does nitrogen mainly promote?", "Leafy vegetative growth"],
  ["What does phosphorus mainly promote?", "Root development and flowering"],
  ["What does potassium mainly promote?", "Disease resistance and fruit quality"],
  ["What is compost?", "Decomposed organic matter used as a soil improver"],
  ["What is mulching?", "Covering soil to retain moisture and suppress weeds"],
  ["What is the advantage of drip irrigation?", "It delivers water efficiently to plant roots"],
  ["What is soil erosion?", "The removal of topsoil by wind or water"],
  ["What is contour ploughing for?", "Reducing runoff and erosion on slopes"],
  ["What is agroforestry?", "Combining trees with crops or livestock"],
  ["What is integrated pest management?", "Combining biological, cultural and chemical pest control"],
  ["What is a pesticide pre-harvest interval?", "The wait required between spraying and harvesting"],
  ["What is a herbicide used for?", "Controlling weeds"],
  ["What is a fungicide used for?", "Controlling fungal disease"],
  ["What is certified seed?", "Seed tested and approved for purity and germination"],
  ["What is a germination test?", "Checking the percentage of seed that sprouts"],
  ["What is transplanting?", "Moving seedlings from nursery to field"],
  ["What is post-harvest loss?", "Produce lost between harvest and consumption"],
  ["What reduces grain storage losses?", "Drying grain and using airtight storage"],
  ["What moisture content is safe for storing maize?", "About 13 percent or lower"],
  ["What is animal husbandry?", "The care, breeding and management of livestock"],
  ["What is a ruminant?", "An animal with a multi-chamber stomach such as a cow"],
  ["What is silage?", "Fermented, high-moisture fodder stored for livestock"],
  ["Why is livestock deworming done?", "To control internal parasites"],
  ["What is artificial insemination used for?", "Improving livestock genetics without keeping a bull"],
  ["What is the gestation period of a cow?", "About nine months"],
  ["What is poultry brooding?", "Keeping chicks warm in their first weeks"],
  ["What is a layer chicken raised for?", "Egg production"],
  ["What is a broiler raised for?", "Meat production"],
  ["What is farm biosecurity?", "Practices preventing disease entry and spread"],
  ["What is aquaculture?", "Farming fish and other aquatic organisms"],
  ["What is value addition in agribusiness?", "Processing produce to increase its market value"],
  ["What is a farm record used for?", "Tracking costs, yields and decisions"],
  ["What is gross margin in farming?", "Revenue minus variable costs of an enterprise"],
  ["What is an agricultural cooperative?", "A member-owned group that markets and buys together"],
  ["What is climate-smart agriculture?", "Farming that raises yields while adapting to climate change"],
  ["What is conservation tillage?", "Minimum soil disturbance to protect soil structure"],
  ["What is greenhouse farming good for?", "Controlling growing conditions and extending seasons"],
  ["What is a soil test used for?", "Determining nutrient needs before fertilising"],
  ["What is intercropping?", "Growing two or more crops together on the same field"],
];

const agricultureBank = () => quiz(agricultureFacts);

/* ----------------------------------------------------- Human resources */

const hrFacts: Facts = [
  ["What is recruitment?", "Attracting and selecting candidates for roles"],
  ["What is a job description?", "A document listing duties and responsibilities of a role"],
  ["What is a person specification?", "The skills and attributes a role requires"],
  ["What is onboarding?", "Integrating a new hire into the organisation"],
  ["What is a probation period?", "An initial period to assess new employee suitability"],
  ["What is a performance appraisal?", "A structured review of an employee's performance"],
  ["What is 360-degree feedback?", "Feedback from peers, managers and reports"],
  ["What are SMART objectives?", "Specific, measurable, achievable, relevant and time-bound goals"],
  ["What is a training needs analysis?", "Identifying skill gaps that training should close"],
  ["What is succession planning?", "Preparing internal candidates for key future roles"],
  ["What is staff turnover?", "The rate at which employees leave an organisation"],
  ["What is an exit interview?", "A discussion with a departing employee about their reasons"],
  ["What is employee engagement?", "The emotional commitment employees have to their work"],
  ["What is a grievance procedure?", "A formal route for employees to raise complaints"],
  ["What is a disciplinary procedure?", "A fair process for addressing misconduct"],
  ["What is gross misconduct?", "Serious wrongdoing that can justify dismissal"],
  ["What is constructive dismissal?", "When an employee resigns due to the employer's breach"],
  ["What is unfair dismissal?", "Termination without a fair reason or fair process"],
  ["What is a contract of employment?", "A legal agreement setting out terms of work"],
  ["What is a collective bargaining agreement?", "Terms negotiated between employer and a union"],
  ["What is the role of a trade union?", "Representing workers' collective interests"],
  ["What is workplace diversity?", "A workforce reflecting varied backgrounds and identities"],
  ["What is inclusion at work?", "Ensuring everyone can participate and contribute fully"],
  ["What is indirect discrimination?", "A neutral rule that disadvantages a protected group"],
  ["What is reasonable accommodation?", "Adjustments enabling a disabled employee to work"],
  ["What is a harassment policy for?", "Preventing and handling unwanted offensive conduct"],
  ["What is whistleblowing?", "Reporting wrongdoing in the public interest"],
  ["What is payroll?", "The process of paying employees and deducting statutory amounts"],
  ["What is gross pay?", "Pay before deductions"],
  ["What is net pay?", "Pay after all deductions"],
  ["What is a benefit-in-kind?", "A non-cash benefit provided to an employee"],
  ["What is a pension scheme?", "A plan providing income after retirement"],
  ["What is annual leave?", "Paid holiday entitlement"],
  ["What is compassionate leave?", "Time off following bereavement or family emergency"],
  ["What is flexible working?", "Adjusted hours or location arrangements"],
  ["What is a hybrid work model?", "Splitting work between office and remote locations"],
  ["What is HR analytics?", "Using workforce data to guide people decisions"],
  ["What is an employee handbook?", "A guide to policies and expectations"],
  ["What is job evaluation?", "Systematically assessing the relative worth of jobs"],
  ["What is a competency framework?", "A defined set of behaviours and skills for roles"],
  ["What is a psychometric test used for?", "Assessing aptitude or personality in selection"],
  ["What is workforce planning?", "Matching future staffing supply with demand"],
  ["What is redundancy?", "A dismissal because the role is no longer needed"],
  ["What is talent management?", "Attracting, developing and retaining high performers"],
  ["What is an employee value proposition?", "The package of rewards and experience offered to staff"],
];

const hrBank = () => quiz(hrFacts);

/* ---------------------------------------------------- Law & compliance */

const lawFacts: Facts = [
  ["What is a contract?", "A legally binding agreement between parties"],
  ["What are the essential elements of a contract?", "Offer, acceptance, consideration and intention"],
  ["What is consideration in contract law?", "Something of value exchanged between the parties"],
  ["What is a breach of contract?", "Failure to perform an agreed obligation"],
  ["What is the remedy of damages?", "Financial compensation for loss suffered"],
  ["What is specific performance?", "A court order to carry out the contract"],
  ["What is negligence?", "Breach of a duty of care causing foreseeable harm"],
  ["What must a claimant prove in negligence?", "Duty, breach, causation and damage"],
  ["What is vicarious liability?", "An employer's liability for employees' acts at work"],
  ["What is a tort?", "A civil wrong other than breach of contract"],
  ["What is defamation?", "A false statement that harms someone's reputation"],
  ["What is intellectual property?", "Legal rights over creations of the mind"],
  ["What does copyright protect?", "Original literary, artistic and software works"],
  ["What does a patent protect?", "A new, inventive and industrially applicable invention"],
  ["What does a trademark protect?", "Signs distinguishing goods or services of a trader"],
  ["What is a trade secret?", "Confidential business information kept from competitors"],
  ["What is a non-disclosure agreement?", "A contract restricting disclosure of confidential information"],
  ["What is due diligence?", "Investigation of a matter before entering a transaction"],
  ["What is corporate governance?", "The system by which companies are directed and controlled"],
  ["What is a fiduciary duty?", "A duty to act in another party's best interests"],
  ["What is a conflict of interest?", "A situation where personal interest could bias a decision"],
  ["What is anti-money laundering?", "Controls preventing criminal funds entering the system"],
  ["What is KYC?", "Know your customer identity verification"],
  ["What is bribery?", "Offering or receiving an advantage to influence a decision"],
  ["What is a compliance programme?", "A structured system for meeting legal obligations"],
  ["What is a data controller?", "The party deciding why and how personal data is processed"],
  ["What is a data processor?", "A party processing personal data on the controller's behalf"],
  ["What is data minimisation?", "Collecting only the personal data actually needed"],
  ["What is a data subject access request?", "A request to see the personal data held about you"],
  ["What is the data breach notification duty?", "The obligation to report qualifying breaches promptly"],
  ["What is consumer protection law about?", "Fair treatment and safety of buyers"],
  ["What is a warranty?", "A promise about the quality or performance of goods"],
  ["What is an indemnity clause?", "A promise to cover another party's specified losses"],
  ["What is a force majeure clause?", "Relief from obligations due to extraordinary events"],
  ["What is arbitration?", "Private dispute resolution by an appointed arbitrator"],
  ["What is mediation?", "Assisted negotiation to reach a voluntary settlement"],
  ["What does a jurisdiction clause decide?", "Which country's courts will hear disputes"],
  ["What is a limitation period?", "The deadline for bringing a legal claim"],
  ["What is a statutory duty?", "An obligation imposed directly by legislation"],
  ["What is a regulator?", "A body supervising compliance in a sector"],
  ["What is an audit trail?", "Records evidencing what happened and who did it"],
  ["What is a code of conduct?", "Rules setting expected ethical behaviour"],
  ["What is a sanction?", "A penalty imposed for breaching rules"],
  ["What is a licence in regulation?", "Official permission to carry out an activity"],
  ["What is contract novation?", "Replacing a party to a contract with a new one"],
];

const lawBank = () => quiz(lawFacts);

/* ------------------------------------------------------------ Automotive */

const automotiveFacts: Facts = [
  ["What does OBD-II provide?", "Standardised on-board diagnostics access"],
  ["What is a DTC?", "A diagnostic trouble code stored by the ECU"],
  ["What is the role of the ECU?", "Controlling engine functions electronically"],
  ["What does a lambda sensor measure?", "Oxygen content in the exhaust"],
  ["What does a catalytic converter do?", "Reduces harmful exhaust emissions"],
  ["What does ABS prevent?", "Wheel lock-up during hard braking"],
  ["What does ESP or ESC do?", "Reduces skidding by braking individual wheels"],
  ["What is the purpose of a differential?", "Allowing wheels to rotate at different speeds"],
  ["What is a clutch used for?", "Disconnecting the engine from the gearbox"],
  ["What is engine compression ratio?", "The ratio of cylinder volume at BDC to TDC"],
  ["Which engine ignites fuel by compression?", "The diesel engine"],
  ["What is turbocharging?", "Using exhaust gas to force more air into the engine"],
  ["What is an intercooler for?", "Cooling compressed intake air to increase density"],
  ["What does engine oil do?", "Lubricates, cools and cleans internal parts"],
  ["What does a timing belt control?", "Synchronisation of crankshaft and camshaft"],
  ["What happens if a timing belt snaps on an interference engine?", "Valves and pistons can collide, causing major damage"],
  ["What does an alternator do?", "Charges the battery and powers electrics when running"],
  ["What is the usual car battery voltage?", "About 12 volts"],
  ["What is a starter motor for?", "Cranking the engine to begin combustion"],
  ["What is wheel alignment?", "Setting camber, caster and toe angles correctly"],
  ["What causes uneven tyre wear?", "Poor alignment, pressure or worn suspension"],
  ["What minimum tyre tread depth is commonly required?", "1.6 mm"],
  ["What is a shock absorber's job?", "Damping suspension oscillation"],
  ["What is brake fade?", "Loss of braking power from overheating"],
  ["What fluid is used in hydraulic brakes?", "Brake fluid such as DOT 4"],
  ["Why must brake fluid be replaced periodically?", "It absorbs moisture and lowers the boiling point"],
  ["What is a hybrid vehicle?", "A vehicle using both an engine and an electric motor"],
  ["What is regenerative braking?", "Recovering braking energy back into the battery"],
  ["Which battery chemistry dominates electric vehicles?", "Lithium-ion"],
  ["What is EV state of charge?", "The remaining battery energy as a percentage"],
  ["What is DC fast charging?", "High-power direct current charging of an EV battery"],
  ["What is a CAN bus in a vehicle?", "A network letting control modules communicate"],
  ["What is a service interval?", "The mileage or time between scheduled services"],
  ["What is a compression test used for?", "Assessing cylinder sealing and engine health"],
  ["What does white exhaust smoke often indicate?", "Coolant entering the combustion chamber"],
  ["What does blue exhaust smoke indicate?", "Oil being burned in the cylinders"],
  ["What is a fuel injector?", "A valve that sprays metered fuel into the engine"],
  ["What is an air filter for?", "Preventing dust from entering the engine"],
  ["What is a torque wrench used for?", "Tightening fasteners to a specified torque"],
  ["What is a roadworthiness inspection?", "A legal safety check of a vehicle's condition"],
];

const automotiveBank = () => [
  ...quiz(automotiveFacts),
  ...generate(
    10,
    (index) => {
      const km = 100 * (1 + (index % 8));
      const litres = 5 + (index % 6);
      const consumption = Number(((litres / km) * 100).toFixed(2));
      return draft(
        `A vehicle uses ${litres} litres of fuel over ${km} km. What is its fuel consumption?`,
        `${consumption} L/100 km`,
        numericOptions(consumption, 2, 2).map((v) => `${v} L/100 km`),
        `(${litres} / ${km}) Ã— 100 = ${consumption} L per 100 km.`,
      );
    },
    "professional-automotive",
  ),
];

/* ------------------------------------------------------ Cloud & DevOps */

const cloudFacts: Facts = [
  ["What is IaaS?", "Infrastructure as a service such as virtual machines"],
  ["What is PaaS?", "A managed platform for running applications"],
  ["What is SaaS?", "Fully managed software delivered over the internet"],
  ["What is elasticity in cloud computing?", "Automatically scaling resources with demand"],
  ["What is high availability?", "Designing so service continues despite component failure"],
  ["What is a cloud region?", "A geographic area containing data centres"],
  ["What is an availability zone?", "An isolated data centre location within a region"],
  ["What is a load balancer for?", "Spreading traffic across multiple servers"],
  ["What is autoscaling?", "Adding or removing instances based on load"],
  ["What is a container?", "An isolated package of an app with its dependencies"],
  ["What is Docker used for?", "Building and running containers"],
  ["What is Kubernetes used for?", "Orchestrating containers across a cluster"],
  ["What is a Kubernetes pod?", "The smallest deployable unit holding one or more containers"],
  ["What is a Kubernetes service?", "A stable network endpoint for a set of pods"],
  ["What is serverless computing?", "Running code without managing servers, billed per execution"],
  ["What is infrastructure as code?", "Defining infrastructure in version-controlled files"],
  ["What is Terraform used for?", "Declarative provisioning of cloud infrastructure"],
  ["What is CI in DevOps?", "Continuous integration of code with automated builds and tests"],
  ["What is CD in DevOps?", "Continuous delivery or deployment of validated builds"],
  ["What is a build pipeline?", "An automated sequence from commit to deployable artefact"],
  ["What is a blue-green deployment?", "Switching traffic between two identical environments"],
  ["What is a canary release?", "Rolling out a change to a small subset of users first"],
  ["What is a rollback?", "Reverting to the previous working version"],
  ["What three signals make up observability?", "Logs, metrics and traces"],
  ["What is an SLA?", "A contractual service level agreement with customers"],
  ["What is an SLO?", "An internal target for a service level indicator"],
  ["What is an error budget?", "The allowed unreliability before releases are paused"],
  ["What is horizontal scaling?", "Adding more instances rather than bigger ones"],
  ["What is vertical scaling?", "Increasing the size of an existing instance"],
  ["What is a CDN?", "A network caching content close to users"],
  ["What is object storage used for?", "Storing files and blobs accessible by key"],
  ["What is a managed database service?", "A database run and maintained by the cloud provider"],
  ["What is a backup retention policy?", "Rules for how long backups are kept"],
  ["What is disaster recovery?", "Restoring service after a major outage"],
  ["What is RTO?", "The target time to restore service after an incident"],
  ["What is IAM in cloud?", "Identity and access management of users and permissions"],
  ["What is a service account?", "A non-human identity used by workloads"],
  ["What is a secret manager for?", "Storing credentials securely outside code"],
  ["What is a VPC?", "A logically isolated virtual network in the cloud"],
  ["What is a security group?", "A virtual firewall controlling instance traffic"],
  ["What is cost tagging used for?", "Attributing cloud spend to teams or projects"],
  ["What is a reserved instance?", "Committed capacity purchased at a discount"],
  ["What is a runbook?", "Documented steps for handling an operational task"],
  ["What is a postmortem?", "A blameless review of an incident and its causes"],
  ["What is GitOps?", "Managing deployments through declarative files in Git"],
];

const cloudBank = () => quiz(cloudFacts);

export const professionalExtraSections: SectionDefinition[] = [
  { id: "professional-iot", name: "IoT & Embedded Systems", description: "Sensors, microcontrollers, MQTT, edge computing and device security.", difficulty: "Hard", build: iotBank },
  { id: "professional-automation", name: "Automation & Control", description: "PLCs, SCADA, PID control, instrumentation and industrial safety.", difficulty: "Hard", build: automationBank },
  { id: "professional-cybersecurity", name: "Cybersecurity", description: "Threats, cryptography, hardening, incident response and governance.", difficulty: "Hard", build: cyberBank },
  { id: "professional-mechanical", name: "Mechanical Engineering", description: "Materials, machine elements, torque, stress and maintenance.", difficulty: "Hard", build: mechanicalBank },
  { id: "professional-civil", name: "Civil & Structural Engineering", description: "Concrete, foundations, structures, surveying and site management.", difficulty: "Hard", build: civilBank },
  { id: "professional-healthcare", name: "Healthcare & Nursing", description: "Vital signs, emergency care, infection control and patient safety.", difficulty: "Hard", build: healthcareBank },
  { id: "professional-agriculture", name: "Agriculture & Agribusiness", description: "Soils, crops, livestock, post-harvest handling and farm economics.", difficulty: "Medium", build: agricultureBank },
  { id: "professional-hr", name: "Human Resources", description: "Recruitment, performance, employment relations and HR policy.", difficulty: "Medium", build: hrBank },
  { id: "professional-law", name: "Law, Ethics & Compliance", description: "Contracts, liability, data protection and regulatory compliance.", difficulty: "Hard", build: lawBank },
  { id: "professional-automotive", name: "Automotive & Mechatronics", description: "Engines, diagnostics, braking, EV systems and servicing.", difficulty: "Hard", build: automotiveBank },
  { id: "professional-cloud", name: "Cloud & DevOps", description: "Cloud models, containers, CI/CD, reliability and cloud security.", difficulty: "Hard", build: cloudBank },
];
