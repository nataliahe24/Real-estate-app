export interface BuyerVisit {
    scheduleId: number;
    buyerEmail: string;
}

export interface BuyerVisitResponse {
    id: number;
    scheduleId: number;
    buyerEmail: string;
    timestamp: Date;
}

export interface BuyerVisitResponseList {
    buyerVisits: BuyerVisitResponse[];
}

