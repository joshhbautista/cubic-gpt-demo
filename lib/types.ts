export interface PatientModel {
  patient_id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  disease: string;
  medical_record: string;
}

export interface Patient {
  patientId: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  disease: string;
  medicalHistory: string;
  preferredCommunicationMethod: string;
  phoneNumber: string;
  address: string;
}

type Gender = 'Male' | 'Female' | 'Other';

export interface StatusModel {
  status_id: number;
  label: StatusLabel;
}

type StatusLabel =
  | 'Requires Attention'
  | 'Awaiting Reply'
  | 'In Progress'
  | 'Awaiting CA Reply'
  | 'Awaiting Exception'
  | 'Completed';

export interface CaseModel {
  case_id: number;
  patient_id: number;
  status_id: number;
  date_submitted: string;
  drug_requested: string;
  details: string;
}

export interface Case {
  caseId: number;
  patientId: number;
  statusId: number;
  dateSubmitted: string;
  drugRequested: string;
  details: string;
  caseNotes: string;
  decision: string;
}

export interface CaseDetailsModel
  extends CaseModel,
    PatientModel,
    StatusModel {}

export enum ASSISTANT_NAMES {
  Administrator = 'Administrator',
  Pharmacist = 'Pharmacist',
  ClinicalCoordinator = 'Clinical Coordinator',
  MedicalAccessCoordinator = 'Medical Access Coordinator'
}
