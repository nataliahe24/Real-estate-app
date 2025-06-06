export interface BuyerVisit {
    scheduleId: number;
    buyerEmail: string;
}

export interface BuyerVisitResponse {
    id: number;
    buyerEmail: string;
    scheduleId: number;
    startDate: Date;
    endDate: Date;
    timestamp: Date;
}

export interface BuyerVisitResponseList {
    buyerVisits: BuyerVisitResponse[];
}

