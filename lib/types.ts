export interface Patient {
  patient_id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  disease: string;
  medical_record: string;
}

type Gender = 'Male' | 'Female' | 'Other';

export interface Status {
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

export interface Case {
  case_id: number;
  patient_id: number;
  status_id: number;
  date_submitted: string;
  drug_requested: string;
  details: string;
}

export interface CaseDetails extends Case, Patient, Status {}

export enum ASSISTANT_NAMES {
  Administrator = 'Administrator',
  Pharmacist = 'Pharmacist',
  ClinicalCoordinator = 'Clinical Coordinator',
  MedicalAccessCoordinator = 'Medical Access Coordinator'
}
