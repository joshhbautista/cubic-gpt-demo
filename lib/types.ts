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

export interface CaseWithPatientStatus extends Case, Patient, Status {};
