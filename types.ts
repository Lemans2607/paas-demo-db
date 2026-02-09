export enum UserType {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  SME = 'SME',
  ADMIN = 'ADMIN'
}

export interface ServiceRequest {
  id: string;
  type: UserType;
  description: string;
  files?: File[];
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  notebookLink?: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  category: 'AUDIO' | 'VIDEO' | 'PDF' | 'IMAGE';
  url: string;
  isZeroData: boolean;
}