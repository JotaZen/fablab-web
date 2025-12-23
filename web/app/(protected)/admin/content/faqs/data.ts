// Tipos para FAQs - basados en schema de Payload

export interface FAQData {
    id: string;
    question: string;
    answer?: string;
    category?: string;
    order: number;
    published: boolean;
}
