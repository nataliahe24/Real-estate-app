export interface BuyerVisit {
    scheduleId: number;
    buyerEmail: string;
}

export interface BuyerVisitResponse {
    id: number;
    buyerEmail: string;
    scheduleId: number;
    propertyId: number;
    propertyName: string;
    propertyAddress: string;
    neighborhood: string;
    city: string;
    startDate: Date;
    endDate: Date;
    timestamp: Date;
}

export interface BuyerVisitResponseList {
    buyerVisits: BuyerVisitResponse[];
}

