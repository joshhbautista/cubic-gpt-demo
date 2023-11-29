// import { NextResponse } from 'next/server';
// import { createClient } from '@vercel/postgres';
// import { faker } from '@faker-js/faker';
// import { Case, Patient } from '@/lib/types';

// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';

// export async function POST(req: Request) {
//   // Parse the request body
//   const input: {
//     num: number | null;
//   } = await req.json();

//   const numberToGenerate = input.num ?? 1;

//   const patients: Patient[] = [];
//   const cases: Case[] = [];

//   for (let i = 1; i <= numberToGenerate; i++) {
//     const patient = generatePatient();
//     patients.push(patient);

//     const drugCase = generateCase(patient);
//     cases.push(drugCase);
//   }

//   const client = createClient();
//   await client.connect();

//   const insertPatient = async (patient: Patient) => {
//     const query =
//       'INSERT INTO Patients (patient_id, name, date_of_birth, gender, disease, medical_history, preferred_communication_method, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
//     const values = [
//       patient.patientId,
//       patient.name,
//       patient.dateOfBirth,
//       patient.gender,
//       patient.disease,
//       patient.medicalHistory,
//       patient.preferredCommunicationMethod,
//       patient.phoneNumber,
//       patient.address
//     ];
//     await client.query(query, values);
//   };

//   // Function to insert a case
//   const insertCase = async (caseData: Case) => {
//     const query =
//       'INSERT INTO Cases (case_id, patient_id, status_id, date_submitted, drug_requested, details, case_notes, decision) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
//     const values = [
//       caseData.caseId,
//       caseData.patientId,
//       caseData.statusId,
//       caseData.dateSubmitted,
//       caseData.drugRequested,
//       caseData.details,
//       JSON.stringify(caseData.caseNotes),
//       caseData.decision
//     ];
//     await client.query(query, values);
//   };

//   const insertData = async () => {
//     for (const patient of patients) {
//       await insertPatient(patient);
//     }

//     for (const caseData of cases) {
//       await insertCase(caseData);
//     }

//     await client.end();
//   };

//   try {
//     await insertData();
//     return NextResponse.json({ message: `Data generated successfully!` });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: `Error generating data: ${error}` });
//   }
// }

// const diseasesAndDrugs: Record<string, string[]> = {
//   Diabetes: ['Metformin', 'Insulin'],
//   Hypertension: ['Lisinopril', 'Amlodipine'],
//   Asthma: ['Albuterol', 'Fluticasone'],
//   Arthritis: ['Ibuprofen', 'Methotrexate'],
//   Depression: ['Fluoxetine', 'Sertraline'],
//   Hyperlipidemia: ['Atorvastatin', 'Simvastatin'],
//   Anxiety: ['Diazepam', 'Lorazepam'],
//   'Chronic Pain': ['Gabapentin', 'Tramadol'],
//   Allergies: ['Cetirizine', 'Loratadine'],
//   Migraine: ['Sumatriptan', 'Propranolol'],
//   'Heart Disease': ['Aspirin', 'Metoprolol'],
//   GERD: ['Omeprazole', 'Esomeprazole'],
//   Insomnia: ['Zolpidem', 'Temazepam'],
//   Osteoporosis: ['Alendronate', 'Calcium Supplements'],
//   Epilepsy: ['Levetiracetam', 'Carbamazepine']
//   // More diseases and corresponding drugs can be added here
// };

// const generateMedicalHistory = (disease: string): string => {
//   const yearDiagnosed = faker.date
//     .past({ years: 20, refDate: new Date() })
//     .getFullYear();
//   let history = `Diagnosed with ${disease} in ${yearDiagnosed}.`;

//   switch (disease) {
//     case 'Diabetes':
//       history += ` Regular monitoring of blood sugar levels. Lifestyle adjustments made.`;
//       break;
//     case 'Hypertension':
//       history += ` History of high blood pressure, managed with medication.`;
//       break;
//     case 'Asthma':
//       history += ` Periodic asthma attacks, using inhalers for management.`;
//       break;
//     // Add specific history snippets for other diseases...
//     default:
//       history += ` Regular follow-ups and management.`;
//       break;
//   }

//   return history;
// };

// const generatePatient = (): Patient => {
//   const disease = faker.helpers.arrayElement(Object.keys(diseasesAndDrugs));
//   return {
//     patientId: Number(faker.string.numeric({ length: { min: 5, max: 5 } })),
//     name: faker.person.fullName(),
//     dateOfBirth: faker.date
//       .past({ years: 60, refDate: new Date('2000-01-01') })
//       .toISOString()
//       .split('T')[0],
//     gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
//     disease,
//     medicalHistory: generateMedicalHistory(disease),
//     preferredCommunicationMethod: faker.helpers.arrayElement([
//       'email',
//       'phone'
//     ]),
//     phoneNumber: faker.phone.number(),
//     address: faker.location.streetAddress(true)
//   };
// };

// const generateCase = (patient: Patient): Case => {
//   const medications = diseasesAndDrugs[patient.disease];
//   const drugRequested = faker.helpers.arrayElement(medications);
//   const statusId = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6]); // Assuming 1, 2, 3 are valid status IDs
//   const decision =
//     statusId === 6
//       ? faker.helpers.arrayElement(['Approved', 'Denied'])
//       : 'In Progress';

//   return {
//     caseId: Number(faker.string.numeric({ length: { min: 5, max: 5 } })),
//     patientId: patient.patientId,
//     statusId,
//     dateSubmitted: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
//     drugRequested,
//     details: `Request for ${drugRequested}, due to ${patient.disease}.`,
//     caseNotes: JSON.stringify([
//       {
//         note: `Patient reported good tolerance to ${drugRequested}.`,
//         date: faker.date.recent({ days: 180 }).toISOString().split('T')[0]
//       },
//       {
//         note: 'Follow-up required in 3 months.',
//         date: faker.date.recent({ days: 90 }).toISOString().split('T')[0]
//       }
//     ]),
//     decision
//   };
// };
