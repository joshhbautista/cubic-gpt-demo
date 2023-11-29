import { ASSISTANT_NAMES } from './types';

export const ASSISTANTS: {
  id: string;
  name: ASSISTANT_NAMES;
}[] = [
  {
    id: 'asst_F51hdzctFpAuSTtGV035oxp8',
    name: ASSISTANT_NAMES.Administrator
  },
  {
    id: 'asst_dxk0KQrmlEUDKNg5UUlPOjE3',
    name: ASSISTANT_NAMES.Pharmacist
  },
  {
    id: 'asst_0H3DvSJpfuWgCINXTaxmJ9eV',
    name: ASSISTANT_NAMES.ClinicalCoordinator
  },
  {
    id: 'asst_xdFQQkbsruu09RUGtnKHToB9',
    name: ASSISTANT_NAMES.MedicalAccessCoordinator
  }
];

export const ASSISTANT_ID_TO_NAME = ASSISTANTS.reduce(
  (acc, asst) => {
    acc[asst.id] = asst.name;
    return acc;
  },
  {} as Record<string, ASSISTANT_NAMES>
);
