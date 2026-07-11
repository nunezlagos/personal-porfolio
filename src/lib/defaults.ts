export interface ExperienceHighlight {
  title: string;
  description: string;
  dateFrom?: string;
  dateTo?: string;
  date?: string;
}

export interface ExperienceItem {
  id: string;
  dateFrom: string;
  dateTo: string;
  position: string;
  place: string;
  resume: string;
  highlights?: ExperienceHighlight[];
}
